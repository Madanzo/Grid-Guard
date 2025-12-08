import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Returns() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-950">
            <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Return & Refund Policy</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 prose prose-invert prose-zinc">
                <p className="text-zinc-400 text-sm">Last updated: December 8, 2024</p>

                <h2>30-Day Return Policy</h2>
                <p>
                    We want you to be completely satisfied with your purchase. If you're not happy with
                    your order, you may return it within 30 days of delivery for a full refund or exchange.
                </p>

                <h2>Return Conditions</h2>
                <p>To be eligible for a return, your item must be:</p>
                <ul>
                    <li>Unused and in the same condition that you received it</li>
                    <li>In the original packaging</li>
                    <li>Returned within 30 days of delivery</li>
                </ul>

                <h2>Non-Returnable Items</h2>
                <p>The following items cannot be returned:</p>
                <ul>
                    <li>Items that have been used or show signs of wear</li>
                    <li>Items without original packaging</li>
                    <li>Items returned after 30 days</li>
                </ul>

                <h2>How to Return</h2>
                <ol>
                    <li>
                        <strong>Contact Us:</strong> Email us at{' '}
                        <a href="mailto:support@gridnguard.com" className="text-primary hover:underline">
                            support@gridnguard.com
                        </a>{' '}
                        with your order number and reason for return
                    </li>
                    <li>
                        <strong>Receive Instructions:</strong> We'll provide you with return shipping
                        instructions and a return authorization
                    </li>
                    <li>
                        <strong>Ship Your Return:</strong> Pack the item securely and ship it to the
                        address provided
                    </li>
                    <li>
                        <strong>Receive Refund:</strong> Once we receive and inspect your return, we'll
                        process your refund
                    </li>
                </ol>

                <h2>Refund Process</h2>
                <p>
                    Once your return is received and inspected, we will send you an email notification.
                    If approved, your refund will be processed and applied to your original payment
                    method within 5-10 business days.
                </p>

                <h2>Return Shipping Costs</h2>
                <ul>
                    <li><strong>Defective/Wrong Items:</strong> We cover return shipping costs</li>
                    <li><strong>Change of Mind:</strong> Customer is responsible for return shipping costs</li>
                </ul>

                <h2>Damaged or Defective Items</h2>
                <p>
                    If you receive a damaged or defective item, please contact us immediately with photos
                    of the damage. We will arrange for a replacement or full refund at no additional cost to you.
                </p>

                <h2>Exchanges</h2>
                <p>
                    If you'd like to exchange an item for a different color or iPhone model, please contact
                    us. Exchanges are subject to availability.
                </p>

                <h2>Late or Missing Refunds</h2>
                <p>If you haven't received your refund after 10 business days:</p>
                <ol>
                    <li>Check your bank account again</li>
                    <li>Contact your credit card company (it may take time to post)</li>
                    <li>Contact your bank</li>
                    <li>If you've done all of this and still haven't received your refund, please contact us</li>
                </ol>

                <h2>Contact Us</h2>
                <p>
                    For questions about returns or refunds, please contact us at:{' '}
                    <a href="mailto:support@gridnguard.com" className="text-primary hover:underline">
                        support@gridnguard.com
                    </a>
                </p>
            </main>
        </div>
    );
}
