import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, CaseProduct, iPhoneModel, ScreenProtector } from '@/types/store';
import { screenProtectors } from '@/data/products';

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

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

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
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
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
