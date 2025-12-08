// Vercel Serverless Function to save orders to Firestore
// Uses Firebase Admin SDK (server-side) instead of client SDK

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

const db = getFirestore();
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
        const { order } = req.body;

        if (!order || !order.id) {
            return res.status(400).json({ error: 'Order data is required' });
        }

        // Save order to Firestore
        const orderRef = db.collection(ORDERS_COLLECTION).doc(order.id);
        await orderRef.set({
            ...order,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });

        console.log('Order saved to Firestore:', order.id);

        res.status(200).json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ error: 'Failed to save order' });
    }
}
