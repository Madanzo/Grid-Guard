// Vercel Serverless Function for Stripe Webhook
// Handles payment confirmation events from Stripe

// Note: This endpoint uses Firebase Admin SDK for server-side Firestore access
// You need to add FIREBASE_SERVICE_ACCOUNT_KEY to your Vercel environment variables

import Stripe from 'stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin (only once)
if (getApps().length === 0) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore(undefined, 'us-central');
const ORDERS_COLLECTION = 'orders';

export const config = {
    api: {
        bodyParser: false, // Stripe webhooks require raw body
    },
};

/**
 * Buffer the raw body for Stripe signature verification
 */
async function buffer(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('Missing STRIPE_WEBHOOK_SECRET');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    let event;

    try {
        const rawBody = await buffer(req);
        const signature = req.headers['stripe-signature'];

        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;

            console.log('Payment completed for session:', session.id);

            // Get the order ID from session metadata
            const orderId = session.metadata?.orderId;

            if (!orderId) {
                console.error('No orderId in session metadata');
                return res.status(400).json({ error: 'Missing orderId in metadata' });
            }

            try {
                // Update order status to 'paid' in Firestore
                const orderRef = db.collection(ORDERS_COLLECTION).doc(orderId);
                const orderDoc = await orderRef.get();

                if (!orderDoc.exists) {
                    console.error('Order not found:', orderId);
                    return res.status(404).json({ error: 'Order not found' });
                }

                await orderRef.update({
                    status: 'paid',
                    stripePaymentId: session.payment_intent || session.id,
                    stripeSessionId: session.id,
                    paidAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                });

                console.log('Order updated to paid:', orderId);
            } catch (dbError) {
                console.error('Error updating order:', dbError);
                return res.status(500).json({ error: 'Failed to update order' });
            }

            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            console.log('Payment failed:', paymentIntent.id);
            // Optionally update order status to 'failed'
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
}
