// Vercel Serverless Function to update order status in Firestore
// Uses Firebase Admin SDK (server-side)

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin (only once)
if (getApps().length === 0) {
    try {
        const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!key) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing');

        let serviceAccount = JSON.parse(key);
        // FIX: Handle newlines in private key for Vercel env vars
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }

        initializeApp({
            credential: cert(serviceAccount),
        });
    } catch (error) {
        console.error('Firebase initialization error:', error);
        global.firebaseInitError = error;
    }
}

const db = getFirestore(undefined, 'us-central');
const ORDERS_COLLECTION = 'orders';

// CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ error: 'Order ID and status are required' });
        }

        // Update order in Firestore
        const orderRef = db.collection(ORDERS_COLLECTION).doc(orderId);
        await orderRef.update({
            status: status,
            updatedAt: Timestamp.now(),
        });

        console.log('Order status updated:', orderId, status);

        res.status(200).json({ success: true, orderId, status });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
}
