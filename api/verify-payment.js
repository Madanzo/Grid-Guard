// Vercel Serverless Function for verifying Stripe payment
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sessionId } = req.query;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID required' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.status(200).json({
            paid: session.payment_status === 'paid',
            customerEmail: session.customer_email,
            amountTotal: session.amount_total / 100,
            metadata: session.metadata,
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: error.message });
    }
}
