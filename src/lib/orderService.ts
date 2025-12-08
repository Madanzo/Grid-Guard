// Order Service - Firestore operations for order management
import { db } from './firebase';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
} from 'firebase/firestore';
import { Order, CustomerInfo } from '@/types/store';

const ORDERS_COLLECTION = 'orders';

/**
 * Create a new order in Firestore
 * Called when customer submits checkout form, before Stripe redirect
 */
export async function createOrder(order: Order): Promise<void> {
    const orderRef = doc(db, ORDERS_COLLECTION, order.id);

    // Convert the order to a Firestore-friendly format
    const orderData = {
        ...order,
        createdAt: Timestamp.fromDate(new Date(order.createdAt)),
        updatedAt: Timestamp.now(),
    };

    await setDoc(orderRef, orderData);
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
        return null;
    }

    const data = orderSnap.data();
    return {
        ...data,
        id: orderSnap.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    } as Order;
}

/**
 * Get all orders, sorted by creation date (newest first)
 */
export async function getOrders(): Promise<Order[]> {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        } as Order;
    });
}

/**
 * Subscribe to real-time order updates
 * Returns an unsubscribe function
 */
export function subscribeToOrders(
    callback: (orders: Order[]) => void
): () => void {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
        const orders = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            } as Order;
        });
        callback(orders);
    });
}

/**
 * Update order status
 * Called by webhook when payment is confirmed, or by admin to update order progress
 */
export async function updateOrderStatus(
    orderId: string,
    status: Order['status'],
    additionalData?: Partial<Order>
): Promise<void> {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);

    await updateDoc(orderRef, {
        status,
        updatedAt: Timestamp.now(),
        ...additionalData,
    });
}

/**
 * Mark order as paid (called by Stripe webhook)
 */
export async function markOrderAsPaid(
    orderId: string,
    stripePaymentId: string
): Promise<void> {
    await updateOrderStatus(orderId, 'paid', { stripePaymentId });
}

/**
 * Convert order items from cart format to storage format
 */
export interface OrderItem {
    caseName: string;
    casePrice: number;
    iPhoneModel: string;
    screenProtector: string;
    screenProtectorPrice: number;
    quantity: number;
    image?: string;
    temuCaseUrl?: string;
}

export function createOrderObject(
    orderId: string,
    customerInfo: CustomerInfo,
    items: OrderItem[],
    subtotal: number,
    shipping: number,
    total: number
): Order {
    return {
        id: orderId,
        createdAt: new Date().toISOString(),
        status: 'pending',
        customer: customerInfo,
        items: items as unknown as Order['items'], // Type coercion for storage format
        subtotal,
        shipping,
        total,
    };
}
