import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Package,
    ExternalLink,
    RefreshCw,
    Truck,
    CheckCircle,
    Clock,
    ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Order } from '@/types/store';
import { ORDER_STATUS_CONFIG as statusConfigBase } from '@/lib/constants';
import { subscribeToOrders, updateOrderStatus as updateOrderStatusInFirestore, getOrders } from '@/lib/orderService';

// Extend status config with icons for UI
const statusConfig = {
    pending: { ...statusConfigBase.pending, icon: Clock },
    paid: { ...statusConfigBase.paid, icon: CheckCircle },
    ordered_from_temu: { ...statusConfigBase.ordered_from_temu, icon: ShoppingCart },
    shipped: { ...statusConfigBase.shipped, icon: Truck },
    delivered: { ...statusConfigBase.delivered, icon: CheckCircle },
};

export default function Admin() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Admin password - In production, use proper authentication (Firebase Auth, etc.)
    // This is read from environment variable or falls back to a default for development
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    useEffect(() => {
        // Check if already authenticated from PasswordModal
        const isAuth = localStorage.getItem('gridGuardAdminAuth') === 'true';
        if (isAuth) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Subscribe to real-time order updates from Firestore
        const unsubscribe = subscribeToOrders((updatedOrders) => {
            setOrders(updatedOrders);
            setIsLoading(false);

            // Update selected order if it was updated
            if (selectedOrder) {
                const updated = updatedOrders.find(o => o.id === selectedOrder.id);
                if (updated) {
                    setSelectedOrder(updated);
                }
            }
        });

        setIsLoading(true);

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [isAuthenticated]);

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const fetchedOrders = await getOrders();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast({ title: 'Error', description: 'Failed to load orders.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            toast({ title: 'Welcome!', description: 'Logged into admin dashboard.' });
        } else {
            toast({ title: 'Invalid Password', description: 'Please try again.', variant: 'destructive' });
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
        try {
            await updateOrderStatusInFirestore(orderId, newStatus);
            toast({ title: 'Status Updated', description: `Order ${orderId} marked as ${newStatus}` });
        } catch (error) {
            console.error('Error updating order status:', error);
            toast({ title: 'Error', description: 'Failed to update order status.', variant: 'destructive' });
        }
    };

    const openTemuLinks = (order: Order) => {
        // Open all Temu links for the order items
        order.items.forEach((item, index) => {
            if (item.temuCaseUrl) {
                setTimeout(() => window.open(item.temuCaseUrl, '_blank'), index * 500);
            }
            if (item.temuScreenProtectorUrl) {
                setTimeout(() => window.open(item.temuScreenProtectorUrl, '_blank'), index * 500 + 250);
            }
        });
        toast({ title: 'Opening Temu Links', description: 'Product pages are opening in new tabs.' });
    };

    // Login screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
                <div className="max-w-sm w-full">
                    <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            className="w-full h-12 px-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none"
                        />
                        <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90">
                            Login
                        </Button>
                    </form>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-4 text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-zinc-400" />
                        </button>
                        <h1 className="text-xl font-bold text-white">Order Dashboard</h1>
                    </div>
                    <button
                        onClick={loadOrders}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm text-white">Refresh</span>
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
                        <p className="text-zinc-500">Orders will appear here when customers make purchases.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Orders List */}
                        <div className="lg:col-span-1 space-y-3">
                            <h2 className="text-sm font-medium text-zinc-400 mb-3">
                                {orders.length} Order(s)
                            </h2>
                            {orders.map((order) => {
                                const StatusIcon = statusConfig[order.status].icon;
                                return (
                                    <button
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedOrder?.id === order.id
                                            ? 'bg-zinc-800 border-primary'
                                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="font-mono text-sm text-white">{order.id}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusConfig[order.status].color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig[order.status].label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-400">
                                            {order.customer.firstName} {order.customer.lastName}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-zinc-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-sm font-semibold text-primary">
                                                ${order.total.toFixed(2)}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Order Details */}
                        <div className="lg:col-span-2">
                            {selectedOrder ? (
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    {/* Order Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Order {selectedOrder.id}</h2>
                                            <p className="text-sm text-zinc-500">
                                                {new Date(selectedOrder.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => openTemuLinks(selectedOrder)}
                                            className="bg-orange-500 hover:bg-orange-600"
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Order from Temu
                                        </Button>
                                    </div>

                                    {/* Status Actions */}
                                    <div className="flex flex-wrap gap-2 mb-6 p-4 bg-zinc-800/50 rounded-lg">
                                        <span className="text-sm text-zinc-400 mr-2">Update Status:</span>
                                        {Object.entries(statusConfig).map(([status, config]) => (
                                            <button
                                                key={status}
                                                onClick={() => handleUpdateOrderStatus(selectedOrder.id, status as Order['status'])}
                                                className={`text-xs px-3 py-1.5 rounded-full transition-all ${selectedOrder.status === status
                                                    ? config.color + ' ring-2 ring-white/20'
                                                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                                    }`}
                                            >
                                                {config.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Customer Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-zinc-400 mb-2">Customer</h3>
                                            <div className="bg-zinc-800/50 rounded-lg p-4 space-y-1">
                                                <p className="text-white font-medium">
                                                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                                                </p>
                                                <p className="text-sm text-zinc-400">{selectedOrder.customer.email}</p>
                                                <p className="text-sm text-zinc-400">{selectedOrder.customer.phone}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-zinc-400 mb-2">Shipping Address</h3>
                                            <div className="bg-zinc-800/50 rounded-lg p-4 text-sm text-zinc-300">
                                                <p>{selectedOrder.customer.address.street}</p>
                                                {selectedOrder.customer.address.apartment && (
                                                    <p>{selectedOrder.customer.address.apartment}</p>
                                                )}
                                                <p>
                                                    {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state}{' '}
                                                    {selectedOrder.customer.address.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-zinc-400 mb-2">Items</h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-4"
                                                >
                                                    <div>
                                                        <p className="text-white font-medium">{item.caseName}</p>
                                                        <p className="text-sm text-zinc-500">
                                                            {item.iPhoneModel} • {item.screenProtector}
                                                        </p>
                                                        <p className="text-xs text-zinc-600">Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white font-medium">
                                                            ${((item.casePrice + item.screenProtectorPrice) * item.quantity).toFixed(2)}
                                                        </p>
                                                        {item.temuCaseUrl && (
                                                            <a
                                                                href={item.temuCaseUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline"
                                                            >
                                                                View on Temu →
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Totals */}
                                    <div className="border-t border-zinc-700 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-400">Subtotal</span>
                                            <span className="text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-400">Shipping</span>
                                            <span className={selectedOrder.shipping === 0 ? 'text-green-400' : 'text-white'}>
                                                {selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping.toFixed(2)}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-700">
                                            <span className="text-white">Total</span>
                                            <span className="text-primary">${selectedOrder.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
                                    <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                    <p className="text-zinc-500">Select an order to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
