// Vercel Serverless Function for Stripe Checkout
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { items, customerInfo, orderId } = req.body;

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

        if (subtotal < 50) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Shipping',
                        description: 'Standard shipping',
                    },
                    unit_amount: 499,
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
                customerPhone: customerInfo.phone,
                shippingAddress: JSON.stringify(customerInfo.address),
            },
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
        });

        res.status(200).json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
}
