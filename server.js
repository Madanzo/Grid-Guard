// Stripe backend server for payment processing
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { config } from 'dotenv';

config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({ origin: ['http://localhost:8081', 'http://localhost:5173'] }));
app.use(express.json());

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, customerInfo, orderId } = req.body;

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

        if (subtotal < 50) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Shipping',
                        description: 'Standard shipping',
                    },
                    unit_amount: 499, // $4.99
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
                customerPhone: customerInfo.phone,
                shippingAddress: JSON.stringify(customerInfo.address),
            },
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
        });

        res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify payment status
app.get('/api/verify-payment/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        res.json({
            paid: session.payment_status === 'paid',
            customerEmail: session.customer_email,
            amountTotal: session.amount_total / 100,
            metadata: session.metadata,
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`💳 Stripe server running on http://localhost:${PORT}`);
});
