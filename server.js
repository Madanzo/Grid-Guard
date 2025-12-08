// Stripe backend server for local development payment processing
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { config } from 'dotenv';

config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CORS Configuration - restrict to local development origins
const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());

// Shipping constants - should match constants.ts
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST_CENTS = 499; // $4.99

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
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
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round((item.casePrice + item.screenProtectorPrice) * 100), // Stripe uses cents
            },
            quantity: item.quantity,
        }));

        // Add shipping if applicable
        const subtotal = items.reduce(
            (sum, item) => sum + (item.casePrice + item.screenProtectorPrice) * item.quantity,
            0
        );

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

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${req.headers.origin}/checkout`,
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

        res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Payment processing error. Please try again.' });
    }
});

// Verify payment status
app.get('/api/verify-payment/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Validate sessionId format
        if (!sessionId || !sessionId.startsWith('cs_')) {
            return res.status(400).json({ error: 'Invalid session ID format' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json({
            paid: session.payment_status === 'paid',
            customerEmail: session.customer_email,
            amountTotal: session.amount_total / 100,
            metadata: session.metadata,
        });
    } catch (error) {
        console.error('Verify error:', error);

        if (error?.code === 'resource_missing') {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.status(500).json({ error: 'Failed to verify payment. Please try again.' });
    }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`💳 Stripe server running on http://localhost:${PORT}`);
    console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
});

