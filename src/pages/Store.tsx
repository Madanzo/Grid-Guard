import { useState } from 'react';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { caseProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import ContactModal from '@/components/ContactModal';

export default function Store() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const { itemCount } = useCart();

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="flex items-center">
                        <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-white">
                            Grid<span className="text-primary">&</span>Guard
                        </span>
                    </a>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Contact */}
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Support</span>
                        </button>

                        {/* Cart Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5 text-white" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-16 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="relative max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Premium Cases for
                        <br />
                        <span className="text-primary">Every iPhone</span>
                    </h1>
                    <p className="text-lg text-zinc-400 mb-6">
                        Each case includes a FREE screen protector of your choice
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Free shipping on orders over $50
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {caseProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800 py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-zinc-500">
                            © 2024 Grid & Guard. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <a href="/terms" className="text-zinc-400 hover:text-primary transition-colors">
                                Terms of Service
                            </a>
                            <a href="/privacy" className="text-zinc-400 hover:text-primary transition-colors">
                                Privacy Policy
                            </a>
                            <a href="/returns" className="text-zinc-400 hover:text-primary transition-colors">
                                Returns
                            </a>
                            <button
                                onClick={() => setIsContactOpen(true)}
                                className="text-zinc-400 hover:text-primary transition-colors"
                            >
                                Contact
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Contact Modal */}
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </div>
    );
}
