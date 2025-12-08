import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-950">
            <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Terms of Service</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 prose prose-invert prose-zinc">
                <p className="text-zinc-400 text-sm">Last updated: December 8, 2024</p>

                <h2>1. Agreement to Terms</h2>
                <p>
                    By accessing or using Grid & Guard ("we," "our," or "us") website at gridnguard.com,
                    you agree to be bound by these Terms of Service. If you do not agree to these terms,
                    please do not use our website or services.
                </p>

                <h2>2. Products and Orders</h2>
                <p>
                    All products displayed on our website are subject to availability. We reserve the right
                    to limit quantities, refuse orders, or discontinue products at any time without prior notice.
                </p>
                <p>
                    Prices are subject to change without notice. We are not responsible for typographical
                    errors regarding price or product information.
                </p>

                <h2>3. Payment</h2>
                <p>
                    We accept major credit cards through our secure payment processor, Stripe. By placing
                    an order, you represent that you are authorized to use the payment method provided.
                </p>
                <p>
                    All payments are processed securely. We do not store your credit card information on our servers.
                </p>

                <h2>4. Shipping</h2>
                <p>
                    Shipping times are estimates and not guaranteed. We are not responsible for delays
                    caused by shipping carriers, customs, or other factors outside our control.
                </p>
                <p>
                    Risk of loss and title for items pass to you upon delivery to the carrier.
                </p>

                <h2>5. Returns and Refunds</h2>
                <p>
                    Please refer to our <a href="/returns" className="text-primary hover:underline">Return Policy</a> for
                    information about returns, exchanges, and refunds.
                </p>

                <h2>6. Intellectual Property</h2>
                <p>
                    All content on this website, including text, graphics, logos, images, and software,
                    is the property of Grid & Guard and is protected by intellectual property laws.
                </p>

                <h2>7. Limitation of Liability</h2>
                <p>
                    To the maximum extent permitted by law, Grid & Guard shall not be liable for any
                    indirect, incidental, special, consequential, or punitive damages arising from your
                    use of our products or services.
                </p>
                <p>
                    Our total liability shall not exceed the amount you paid for the product in question.
                </p>

                <h2>8. Indemnification</h2>
                <p>
                    You agree to indemnify and hold harmless Grid & Guard from any claims, damages, or
                    expenses arising from your use of our website or violation of these terms.
                </p>

                <h2>9. Governing Law</h2>
                <p>
                    These terms shall be governed by the laws of the United States. Any disputes shall
                    be resolved in the courts of competent jurisdiction.
                </p>

                <h2>10. Changes to Terms</h2>
                <p>
                    We reserve the right to modify these terms at any time. Continued use of our website
                    after changes constitutes acceptance of the new terms.
                </p>

                <h2>11. Contact Us</h2>
                <p>
                    For questions about these Terms of Service, please contact us at:{' '}
                    <a href="mailto:support@gridnguard.com" className="text-primary hover:underline">
                        support@gridnguard.com
                    </a>
                </p>
            </main>
        </div>
    );
}
