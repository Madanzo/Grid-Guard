import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-950">
            <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 prose prose-invert prose-zinc">
                <p className="text-zinc-400 text-sm">Last updated: December 8, 2024</p>

                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly to us, including:</p>
                <ul>
                    <li><strong>Contact Information:</strong> Name, email address, phone number, shipping address</li>
                    <li><strong>Payment Information:</strong> Processed securely by Stripe (we do not store card details)</li>
                    <li><strong>Order Information:</strong> Products purchased, order history</li>
                    <li><strong>Communications:</strong> Messages you send to us</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                    <li>Process and fulfill your orders</li>
                    <li>Send order confirmations and shipping updates</li>
                    <li>Respond to your questions and requests</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Improve our products and services</li>
                    <li>Prevent fraud and abuse</li>
                </ul>

                <h2>3. Information Sharing</h2>
                <p>We may share your information with:</p>
                <ul>
                    <li><strong>Service Providers:</strong> Companies that help us operate our business (Stripe for payments, shipping carriers)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
                <p>We do not sell your personal information to third parties.</p>

                <h2>4. Data Security</h2>
                <p>
                    We implement appropriate security measures to protect your personal information.
                    All payment transactions are encrypted using SSL technology and processed by Stripe,
                    a PCI-compliant payment processor.
                </p>

                <h2>5. Cookies and Tracking</h2>
                <p>
                    We use cookies and similar technologies to enhance your experience, analyze site
                    traffic, and understand user behavior. You can control cookies through your browser settings.
                </p>

                <h2>6. Your Rights</h2>
                <p>Depending on your location, you may have the right to:</p>
                <ul>
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt out of marketing communications</li>
                    <li>Data portability</li>
                </ul>

                <h2>7. California Privacy Rights (CCPA)</h2>
                <p>
                    California residents have additional rights under the California Consumer Privacy Act,
                    including the right to know what personal information we collect and the right to
                    request deletion.
                </p>

                <h2>8. Children's Privacy</h2>
                <p>
                    Our website is not intended for children under 13. We do not knowingly collect
                    personal information from children under 13.
                </p>

                <h2>9. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of any
                    changes by posting the new policy on this page.
                </p>

                <h2>10. Contact Us</h2>
                <p>
                    For questions about this Privacy Policy, please contact us at:{' '}
                    <a href="mailto:support@gridnguard.com" className="text-primary hover:underline">
                        support@gridnguard.com
                    </a>
                </p>
            </main>
        </div>
    );
}
