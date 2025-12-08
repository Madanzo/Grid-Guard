// Vercel Serverless Function to get orders from Firestore
// Uses Firebase Admin SDK (server-side)

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (only once)
if (getApps().length === 0) {
    try {
        const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!key) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing');
        }

        // Handle potential parsing issues
        let serviceAccount;
        try {
            serviceAccount = JSON.parse(key);

            // FIX: Handle newlines in private key for Vercel env vars
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }
        } catch (e) {
            console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON', e);
            throw new Error(`Invalid JSON in FIREBASE_SERVICE_ACCOUNT_KEY: ${e.message}`);
        }

        initializeApp({
            credential: cert(serviceAccount),
        });
        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Firebase initialization error:', error);
        // Store initialization error to return it later
        global.firebaseInitError = error;
    }
}

const db = getFirestore();
const ORDERS_COLLECTION = 'orders';

// CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check for initialization error
    if (global.firebaseInitError) {
        return res.status(500).json({
            error: 'Firebase Initialization Failed',
            details: global.firebaseInitError.message
        });
    }

    try {
        const snapshot = await db.collection(ORDERS_COLLECTION)
            .orderBy('createdAt', 'desc')
            .get();

        const orders = [];
        snapshot.forEach(doc => {
            orders.push(doc.data());
        });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            error: 'Failed to fetch orders',
            details: error.message
        });
    }
}
