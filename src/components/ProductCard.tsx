import { useState } from 'react';
import { iPhoneModel } from '@/types/store';
import { CaseProductWithVariants, ColorVariant, iPhoneModels, screenProtectors } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ShoppingCart, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
    product: CaseProductWithVariants;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [selectedVariant, setSelectedVariant] = useState<ColorVariant>(
        product.variants.find(v => v.id === product.defaultVariant) || product.variants[0]
    );
    const [selectedModel, setSelectedModel] = useState<iPhoneModel | null>(null);
    const [isAdded, setIsAdded] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!selectedModel) {
            toast({
                title: 'Select your iPhone model',
                description: 'Please choose your iPhone model before adding to cart.',
                variant: 'destructive',
            });
            return;
        }

        // Create a product object compatible with the cart
        const cartProduct = {
            id: selectedVariant.id,
            name: `${product.name} - ${selectedVariant.name}`,
            description: product.description,
            price: product.price,
            image: selectedVariant.image,
            temuUrl: product.temuUrl,
        };

        addToCart(cartProduct, selectedModel, screenProtectors[0]);
        setIsAdded(true);

        toast({
            title: 'Added to cart!',
            description: `${product.name} (${selectedVariant.name}) for ${selectedModel.name} added.`,
        });

        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
            {/* Product Image */}
            <div className="aspect-square relative overflow-hidden bg-zinc-800">
                <img
                    src={selectedVariant.image}
                    alt={`${product.name} - ${selectedVariant.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x400/1f1f23/a855f7?text=${encodeURIComponent(product.name)}`;
                    }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                </div>

                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{product.description}</p>

                {/* Color Variants */}
                {product.variants.length > 1 && (
                    <div className="mb-4">
                        <p className="text-xs text-zinc-500 mb-2">Color: {selectedVariant.name}</p>
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedVariant.id === variant.id
                                        ? 'border-primary scale-110'
                                        : 'border-zinc-600 hover:border-zinc-400'
                                        }`}
                                    style={{ backgroundColor: variant.colorHex }}
                                    title={variant.name}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Included Badge */}
                <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Includes free screen protector</span>
                </div>

                {/* Actions Wrapper - Pushes to bottom */}
                <div className="mt-auto">
                    {/* iPhone Model Selector */}
                    <Select
                        onValueChange={(value) => {
                            const model = iPhoneModels.find((m) => m.id === value);
                            setSelectedModel(model || null);
                        }}
                    >
                        <SelectTrigger className="w-full mb-3 bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Select iPhone Model" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                            {iPhoneModels.map((model) => (
                                <SelectItem
                                    key={model.id}
                                    value={model.id}
                                    className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                                >
                                    {model.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Add to Cart Button */}
                    <Button
                        onClick={handleAddToCart}
                        className={`w-full ${isAdded
                            ? 'bg-green-600 hover:bg-green-600'
                            : 'bg-primary hover:bg-primary/90'
                            } transition-colors`}
                    >
                        {isAdded ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Added!
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
