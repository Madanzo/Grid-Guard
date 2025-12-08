import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { screenProtectors } from '@/data/products';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const {
        items,
        removeFromCart,
        updateQuantity,
        updateScreenProtector,
        getSubtotal,
        getShipping,
        getTotal,
        itemCount,
    } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold text-white">Your Cart</h2>
                        <span className="bg-primary/20 text-primary text-sm px-2 py-0.5 rounded-full">
                            {itemCount}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500">Your cart is empty</p>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div
                                key={`${item.caseProduct.id}-${item.iPhoneModel.id}-${index}`}
                                className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700"
                            >
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0">
                                        <img
                                            src={item.caseProduct.image}
                                            alt={item.caseProduct.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://placehold.co/80x80/1f1f23/a855f7?text=${encodeURIComponent(item.caseProduct.name.charAt(0))}`;
                                            }}
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium truncate">
                                            {item.caseProduct.name}
                                        </h3>
                                        <p className="text-sm text-zinc-500">{item.iPhoneModel.name}</p>

                                        {/* Screen Protector Selector */}
                                        <Select
                                            value={item.screenProtector.id}
                                            onValueChange={(value) => {
                                                const sp = screenProtectors.find((s) => s.id === value);
                                                if (sp) updateScreenProtector(index, sp);
                                            }}
                                        >
                                            <SelectTrigger className="h-8 mt-2 bg-zinc-700 border-zinc-600 text-xs text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                                {screenProtectors.map((sp) => (
                                                    <SelectItem
                                                        key={sp.id}
                                                        value={sp.id}
                                                        className="text-white text-xs hover:bg-zinc-700 focus:bg-zinc-700"
                                                    >
                                                        {sp.name} {sp.price > 0 && `(+$${sp.price.toFixed(2)})`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(index)}
                                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors self-start"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>

                                {/* Quantity and Price Row */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-700">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(index, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                                        >
                                            <Minus className="w-4 h-4 text-white" />
                                        </button>
                                        <span className="w-8 text-center text-white font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(index, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4 text-white" />
                                        </button>
                                    </div>

                                    {/* Item Total */}
                                    <span className="text-white font-semibold">
                                        ${((item.caseProduct.price + item.screenProtector.price) * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer with Totals */}
                {items.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-6">
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Subtotal</span>
                                <span className="text-white">${getSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Shipping</span>
                                <span className={getShipping() === 0 ? 'text-green-400' : 'text-white'}>
                                    {getShipping() === 0 ? 'FREE' : `$${getShipping().toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-700">
                                <span className="text-white">Total</span>
                                <span className="text-primary">${getTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-semibold"
                        >
                            Checkout
                        </Button>

                        <p className="text-xs text-zinc-500 text-center mt-3">
                            Free shipping on orders over $50
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
