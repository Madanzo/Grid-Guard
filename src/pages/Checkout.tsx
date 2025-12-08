import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, CreditCard, Check, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { CustomerInfo, Order } from '@/types/store';
import { createOrder } from '@/lib/orderService';

type CheckoutStep = 'info' | 'payment';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, getSubtotal, getShipping, getTotal } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
            street: '',
            apartment: '',
            city: '',
            state: '',
            zipCode: '',
        },
    });

    // Redirect if cart is empty
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
                <p className="text-zinc-400 mb-6">Add some cases to your cart first!</p>
                <Button onClick={() => navigate('/store')} className="bg-primary hover:bg-primary/90">
                    Browse Cases
                </Button>
            </div>
        );
    }

    const handleInputChange = (field: string, value: string) => {
        if (field.startsWith('address.')) {
            const addressField = field.replace('address.', '');
            setCustomerInfo({
                ...customerInfo,
                address: {
                    ...customerInfo.address,
                    [addressField]: value,
                },
            });
        } else {
            setCustomerInfo({
                ...customerInfo,
                [field]: value,
            });
        }
    };

    // Step 1: Validate info and proceed to payment step
    const handleContinueToPayment = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate contact info
        const { firstName, lastName, email, phone, address } = customerInfo;
        if (!firstName || !lastName || !email || !phone) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in your contact information.',
                variant: 'destructive',
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: 'Invalid Email',
                description: 'Please enter a valid email address.',
                variant: 'destructive',
            });
            return;
        }

        // Validate shipping address
        if (!address.street || !address.city || !address.state || !address.zipCode) {
            toast({
                title: 'Missing Address',
                description: 'Please fill in your complete shipping address.',
                variant: 'destructive',
            });
            return;
        }

        // All valid, proceed to payment step
        setCurrentStep('payment');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Step 2: Submit to Stripe
    const handleStripeCheckout = async () => {
        setIsSubmitting(true);

        try {
            // Generate order ID
            const orderId = `GG-${Date.now()}`;

            // Prepare items for Stripe
            const stripeItems = items.map(item => ({
                caseName: item.caseProduct.name,
                casePrice: item.caseProduct.price,
                iPhoneModel: item.iPhoneModel.name,
                screenProtector: item.screenProtector.name,
                screenProtectorPrice: item.screenProtector.price,
                quantity: item.quantity,
                image: item.caseProduct.image,
                temuCaseUrl: item.caseProduct.temuUrl,
            }));

            // Create order object for Firestore
            const order = {
                id: orderId,
                createdAt: new Date().toISOString(),
                status: 'pending' as const,
                customer: customerInfo,
                items: stripeItems as unknown as Order['items'],
                subtotal: getSubtotal(),
                shipping: getShipping(),
                total: getTotal(),
            };


            // TEMPORARILY DISABLED - Save order to Firestore
            // TODO: Re-enable after Firestore is properly configured
            /*
            try {
                await createOrder(order);
                console.log('Order saved to Firestore:', orderId);
            } catch (firestoreError) {
                console.error('Firestore error:', firestoreError);
                toast({
                    title: 'Database Error',
                    description: 'Failed to save order. Please try again or contact support.',
                    variant: 'destructive',
                });
                setIsSubmitting(false);
                return;
            }
            */
            console.log('Skipping Firestore save (temporarily disabled), orderId:', orderId);

            // Call API to create Stripe checkout session
            const apiUrl = import.meta.env.DEV
                ? 'http://localhost:3001/api/create-checkout-session'
                : '/api/create-checkout-session';

            console.log('Calling Stripe API:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: stripeItems,
                    customerInfo,
                    orderId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Stripe API error:', response.status, errorData);
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const { url } = await response.json();

            if (!url) {
                throw new Error('No checkout URL received from Stripe');
            }

            console.log('Redirecting to Stripe:', url);

            // Note: Cart is NOT cleared here intentionally.
            // If the user navigates back from Stripe, their cart will still be intact.
            // The cart is cleared in OrderSuccess.tsx after payment verification.

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            console.error('Checkout error:', error);
            toast({
                title: 'Checkout Failed',
                description: error instanceof Error ? error.message : 'Unable to connect to payment server. Please try again.',
                variant: 'destructive',
            });
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (currentStep === 'payment') {
            setCurrentStep('info');
        } else {
            navigate('/store');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </button>
                    <span className="font-heading text-xl font-bold tracking-tight text-white">
                        Grid<span className="text-primary">&</span>Guard
                    </span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                {/* Step Indicator */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === 'info' ? 'bg-primary text-white' : 'bg-green-500 text-white'
                            }`}>
                            {currentStep === 'info' ? '1' : <Check className="w-4 h-4" />}
                        </div>
                        <span className={currentStep === 'info' ? 'text-white font-medium' : 'text-green-400'}>
                            Your Information
                        </span>
                    </div>
                    <div className="flex-1 h-px bg-zinc-700" />
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === 'payment' ? 'bg-primary text-white' : 'bg-zinc-700 text-zinc-400'
                            }`}>
                            2
                        </div>
                        <span className={currentStep === 'payment' ? 'text-white font-medium' : 'text-zinc-500'}>
                            Payment
                        </span>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">
                    {currentStep === 'info' ? 'Checkout' : 'Review & Pay'}
                </h1>
                <p className="text-zinc-400 mb-8">
                    {currentStep === 'info'
                        ? 'Enter your contact and shipping information'
                        : 'Review your order and complete payment'}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        {currentStep === 'info' ? (
                            <form id="checkout-form" onSubmit={handleContinueToPayment} className="space-y-6">
                                {/* Contact Information */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName" className="text-zinc-300">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                value={customerInfo.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName" className="text-zinc-300">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                value={customerInfo.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-zinc-300">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={customerInfo.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-zinc-300">Phone *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={customerInfo.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-4">Shipping Address</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="street" className="text-zinc-300">Street Address *</Label>
                                            <Input
                                                id="street"
                                                value={customerInfo.address.street}
                                                onChange={(e) => handleInputChange('address.street', e.target.value)}
                                                placeholder="123 Main Street"
                                                className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="apartment" className="text-zinc-300">Apt, Suite, Unit (optional)</Label>
                                            <Input
                                                id="apartment"
                                                value={customerInfo.address.apartment}
                                                onChange={(e) => handleInputChange('address.apartment', e.target.value)}
                                                placeholder="Apt 4B"
                                                className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="col-span-2 md:col-span-1">
                                                <Label htmlFor="city" className="text-zinc-300">City *</Label>
                                                <Input
                                                    id="city"
                                                    value={customerInfo.address.city}
                                                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                                                    className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="state" className="text-zinc-300">State *</Label>
                                                <Input
                                                    id="state"
                                                    value={customerInfo.address.state}
                                                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                                                    placeholder="TX"
                                                    className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="zipCode" className="text-zinc-300">ZIP Code *</Label>
                                                <Input
                                                    id="zipCode"
                                                    value={customerInfo.address.zipCode}
                                                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                                                    placeholder="78701"
                                                    className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Continue to Payment Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-semibold"
                                >
                                    Continue to Payment
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </form>
                        ) : (
                            /* Step 2: Payment Review */
                            <div className="space-y-6">
                                {/* Order Review */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-4">Your Information</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Contact Info */}
                                        <div>
                                            <p className="text-sm text-zinc-500 mb-1">Contact</p>
                                            <p className="text-white font-medium">
                                                {customerInfo.firstName} {customerInfo.lastName}
                                            </p>
                                            <p className="text-zinc-400 text-sm">{customerInfo.email}</p>
                                            <p className="text-zinc-400 text-sm">{customerInfo.phone}</p>
                                        </div>

                                        {/* Shipping Address */}
                                        <div>
                                            <p className="text-sm text-zinc-500 mb-1">Ship to</p>
                                            <p className="text-white">{customerInfo.address.street}</p>
                                            {customerInfo.address.apartment && (
                                                <p className="text-zinc-400 text-sm">{customerInfo.address.apartment}</p>
                                            )}
                                            <p className="text-zinc-400 text-sm">
                                                {customerInfo.address.city}, {customerInfo.address.state} {customerInfo.address.zipCode}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setCurrentStep('info')}
                                        className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Edit information
                                    </button>
                                </div>

                                {/* Stripe Payment Info */}
                                <div className="bg-gradient-to-r from-purple-500/10 to-primary/10 border border-primary/30 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <CreditCard className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">Secure Stripe Checkout</h3>
                                            <p className="text-sm text-zinc-400">
                                                You'll be redirected to Stripe's secure payment page to complete your purchase.
                                                Your payment information is never stored on our servers.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security badges */}
                                <div className="flex items-center justify-center gap-6 py-4">
                                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                        <Shield className="w-4 h-4" />
                                        <span>Secure checkout</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                        <Lock className="w-4 h-4" />
                                        <span>SSL encrypted</span>
                                    </div>
                                </div>

                                {/* Pay Button */}
                                <Button
                                    onClick={handleStripeCheckout}
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-semibold"
                                >
                                    {isSubmitting ? 'Redirecting to Stripe...' : `Pay with Stripe • $${getTotal().toFixed(2)}`}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6">
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                            <img
                                                src={item.caseProduct.image}
                                                alt={item.caseProduct.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://placehold.co/64x64/1f1f23/a855f7?text=${encodeURIComponent(item.caseProduct.name.charAt(0))}`;
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium truncate">{item.caseProduct.name}</p>
                                            <p className="text-xs text-zinc-500">{item.iPhoneModel.name}</p>
                                            <p className="text-xs text-zinc-500">+ {item.screenProtector.name}</p>
                                            <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm text-white font-medium">
                                            ${((item.caseProduct.price + item.screenProtector.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 pt-4 border-t border-zinc-700">
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

                            {/* Desktop Button */}
                            {currentStep === 'info' ? (
                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    className="w-full h-12 mt-6 bg-primary hover:bg-primary/90 font-semibold hidden lg:flex items-center justify-center gap-2"
                                >
                                    Continue to Payment
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    disabled={isSubmitting}
                                    onClick={handleStripeCheckout}
                                    className="w-full h-12 mt-6 bg-primary hover:bg-primary/90 font-semibold hidden lg:flex items-center justify-center gap-2"
                                >
                                    <Lock className="w-4 h-4" />
                                    {isSubmitting ? 'Redirecting...' : 'Pay with Stripe'}
                                </Button>
                            )}

                            <div className="flex items-center justify-center gap-2 mt-4">
                                <Shield className="w-4 h-4 text-zinc-500" />
                                <p className="text-xs text-zinc-500">Powered by Stripe</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
