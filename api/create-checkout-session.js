// Vercel Serverless Function for Stripe Checkout
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

    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { items, customerInfo, orderId } = req.body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items are required' });
        }

        if (!customerInfo?.email) {
            return res.status(400).json({ error: 'Customer email is required' });
        }

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        // Build line items for Stripe
        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `${item.caseName} - ${item.iPhoneModel}`,
                    description: `Screen Protector: ${item.screenProtector}`,
                },
                unit_amount: Math.round((item.casePrice + item.screenProtectorPrice) * 100),
            },
            quantity: item.quantity,
        }));

        // Add shipping if subtotal < $50
        const subtotal = items.reduce(
            (sum, item) => sum + (item.casePrice + item.screenProtectorPrice) * item.quantity,
            0
        );

        const FREE_SHIPPING_THRESHOLD = 50;
        const SHIPPING_COST_CENTS = 499; // $4.99

        if (subtotal < FREE_SHIPPING_THRESHOLD) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Shipping',
                        description: 'Standard shipping',
                    },
                    unit_amount: SHIPPING_COST_CENTS,
                },
                quantity: 1,
            });
        }

        // Get the origin for redirect URLs
        const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://gridandguard.com';

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${origin}/checkout`,
            customer_email: customerInfo.email,
            metadata: {
                orderId,
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                customerPhone: customerInfo.phone || '',
                shippingAddress: JSON.stringify(customerInfo.address || {}),
            },
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
        });

        res.status(200).json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Stripe checkout error:', error);

        // Don't expose internal error details to client
        const isStripeError = error?.type?.startsWith('Stripe');
        res.status(500).json({
            error: isStripeError
                ? 'Payment processing error. Please try again.'
                : 'An unexpected error occurred. Please try again.'
        });
    }
}

