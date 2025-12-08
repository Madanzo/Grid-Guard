import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface Order {
    id: string;
    total: number;
    customer: {
        email: string;
        address: {
            city: string;
            state: string;
        };
    };
    items: Array<{
        caseName: string;
    }>;
}

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(false);
    const [order, setOrder] = useState<Order | null>(location.state?.order || null);
    const { clearCart } = useCart();

    // Check for Stripe redirect
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        if (sessionId && orderId && !order) {
            verifyPayment();
        }
    }, [sessionId, orderId]);

    const verifyPayment = async () => {
        setIsVerifying(true);
        try {
            // Verify payment with backend
            const apiUrl = import.meta.env.DEV
                ? `http://localhost:3001/api/verify-payment/${sessionId}`
                : `/api/verify-payment?sessionId=${sessionId}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.paid) {
                // Payment confirmed - now safe to clear the cart!
                clearCart();

                // Update order status in localStorage
                const orders = JSON.parse(localStorage.getItem('gridGuardOrders') || '[]');
                const updatedOrders = orders.map((o: Order) => {
                    if (o.id === orderId) {
                        return { ...o, status: 'paid' };
                    }
                    return o;
                });
                localStorage.setItem('gridGuardOrders', JSON.stringify(updatedOrders));

                // Find and set the order
                const paidOrder = updatedOrders.find((o: Order) => o.id === orderId);
                if (paidOrder) {
                    setOrder(paidOrder);
                }
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
        } finally {
            setIsVerifying(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h1 className="text-xl font-bold text-white">Verifying your payment...</h1>
                <p className="text-zinc-400">Please wait a moment</p>
            </div>
        );
    }

    if (!order && !sessionId) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">No order found</h1>
                <Button onClick={() => navigate('/store')} className="bg-primary hover:bg-primary/90">
                    Back to Store
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 py-12">
            <div className="max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
                <p className="text-zinc-400 mb-6">
                    Thank you for your order. Your payment has been processed successfully.
                </p>

                {/* Order Details Card */}
                {order && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-left mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-white">Order #{order.id}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Items</span>
                                <span className="text-white">{order.items?.length || 0} item(s)</span>
                            </div>
                            {order.customer?.address && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Shipping to</span>
                                    <span className="text-white text-right">
                                        {order.customer.address.city}, {order.customer.address.state}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm pt-3 border-t border-zinc-700">
                                <span className="text-zinc-400">Total Paid</span>
                                <span className="text-primary font-bold">${order.total?.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Paid Badge */}
                        <div className="mt-4 flex items-center justify-center gap-2 py-2 bg-green-500/10 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-400 font-medium">Payment Confirmed</span>
                        </div>
                    </div>
                )}

                {/* Confirmation Email Notice */}
                {order?.customer?.email && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
                        <p className="text-sm text-zinc-300">
                            A confirmation email will be sent to{' '}
                            <span className="text-primary font-medium">{order.customer.email}</span>
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                    <Button
                        onClick={() => navigate('/store')}
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        Continue Shopping
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
