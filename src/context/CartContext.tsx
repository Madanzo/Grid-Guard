import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CaseProduct, iPhoneModel, ScreenProtector } from '@/types/store';
import { screenProtectors } from '@/data/products';
import { SHIPPING, STORAGE_KEYS } from '@/lib/constants';

interface CartContextType {
    items: CartItem[];
    addToCart: (caseProduct: CaseProduct, iPhoneModel: iPhoneModel, screenProtector?: ScreenProtector) => void;
    removeFromCart: (index: number) => void;
    updateQuantity: (index: number, quantity: number) => void;
    updateScreenProtector: (index: number, screenProtector: ScreenProtector) => void;
    clearCart: () => void;
    getSubtotal: () => number;
    getShipping: () => number;
    getTotal: () => number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Load cart from localStorage
 */
function loadCartFromStorage(): CartItem[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CART);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validate that it's an array
            if (Array.isArray(parsed)) {
                // Filter out test products that might be stuck in localStorage
                return parsed.filter((item: any) => {
                    const name = item.caseProduct?.name || '';
                    return !name.toUpperCase().includes('TEST') && !name.includes('No Shipping');
                });
            }
        }
    } catch (error) {
        console.warn('Failed to load cart from localStorage:', error);
    }
    return [];
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage(items: CartItem[]): void {
    try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    // Initialize state from localStorage
    const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

    // Persist to localStorage whenever cart changes
    useEffect(() => {
        saveCartToStorage(items);
    }, [items]);

    const addToCart = (
        caseProduct: CaseProduct,
        iPhoneModel: iPhoneModel,
        screenProtector?: ScreenProtector
    ) => {
        const defaultScreenProtector = screenProtector || screenProtectors[0];

        // Check if same case + model combination exists
        const existingIndex = items.findIndex(
            (item) =>
                item.caseProduct.id === caseProduct.id &&
                item.iPhoneModel.id === iPhoneModel.id &&
                item.screenProtector.id === defaultScreenProtector.id
        );

        if (existingIndex > -1) {
            // Increase quantity
            const newItems = [...items];
            newItems[existingIndex].quantity += 1;
            setItems(newItems);
        } else {
            // Add new item
            setItems([
                ...items,
                {
                    caseProduct,
                    iPhoneModel,
                    screenProtector: defaultScreenProtector,
                    quantity: 1,
                },
            ]);
        }
    };

    const removeFromCart = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateQuantity = (index: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(index);
            return;
        }
        const newItems = [...items];
        newItems[index].quantity = quantity;
        setItems(newItems);
    };

    const updateScreenProtector = (index: number, screenProtector: ScreenProtector) => {
        const newItems = [...items];
        newItems[index].screenProtector = screenProtector;
        setItems(newItems);
    };

    const clearCart = () => {
        setItems([]);
    };

    const getSubtotal = () => {
        return items.reduce((total, item) => {
            const itemPrice = item.caseProduct.price + item.screenProtector.price;
            return total + itemPrice * item.quantity;
        }, 0);
    };

    const getShipping = () => {
        const subtotal = getSubtotal();
        return subtotal >= SHIPPING.FREE_THRESHOLD ? 0 : SHIPPING.COST;
    };

    const getTotal = () => {
        return getSubtotal() + getShipping();
    };

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                updateScreenProtector,
                clearCart,
                getSubtotal,
                getShipping,
                getTotal,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

