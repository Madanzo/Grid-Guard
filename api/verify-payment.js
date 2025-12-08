// Vercel Serverless Function for verifying Stripe payment
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Allowed origins for CORS - update these with your actual domains
const ALLOWED_ORIGINS = [
    'https://gridandguard.com',
    'https://www.gridandguard.com',
];

// Add development origins
if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview') {
    ALLOWED_ORIGINS.push(
        'http://localhost:5173',
        'http://localhost:8080',
        'http://localhost:3000'
    );
}

/**
 * Set CORS headers with origin validation
 */
function setCorsHeaders(req, res) {
    const origin = req.headers.origin;

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default async function handler(req, res) {
    // Set CORS headers
    setCorsHeaders(req, res);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sessionId } = req.query;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Validate sessionId format (Stripe session IDs start with 'cs_')
        if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
            return res.status(400).json({ error: 'Invalid session ID format' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.status(200).json({
            paid: session.payment_status === 'paid',
            customerEmail: session.customer_email,
            amountTotal: session.amount_total / 100,
            metadata: session.metadata,
        });
    } catch (error) {
        console.error('Payment verification error:', error);

        // Handle specific Stripe errors
        if (error?.code === 'resource_missing') {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Don't expose internal error details
        res.status(500).json({ error: 'Failed to verify payment. Please try again.' });
    }
}

