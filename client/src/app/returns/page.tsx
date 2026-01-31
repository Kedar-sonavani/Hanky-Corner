'use client';

import Link from 'next/link';
import { RotateCcw, Package, Clock, CheckCircle } from 'lucide-react';

export default function ReturnsPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="container max-w-4xl mx-auto px-4">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-8">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-foreground">Returns</span>
                </nav>

                {/* Header */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10">
                            <RotateCcw className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">
                            Returns & Exchanges
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Last updated: January 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none space-y-12">

                    {/* Section 1 */}
                    <section className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/20 shrink-0">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-heading text-2xl font-bold uppercase tracking-tight mb-3">Return Window</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We accept returns within <strong>14 days</strong> of delivery. To be eligible for a return, your item must be unused,
                                    in the same condition that you received it, and in its original packaging with all tags attached.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/20 shrink-0">
                                <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-heading text-2xl font-bold uppercase tracking-tight mb-3">Return Process</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    To initiate a return, please follow these steps:
                                </p>
                                <ol className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="font-bold text-primary shrink-0">1.</span>
                                        <span>Contact our customer service team at <a href="mailto:returns@hankycorner.com" className="text-primary hover:underline">returns@hankycorner.com</a> with your order number and reason for return.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="font-bold text-primary shrink-0">2.</span>
                                        <span>Wait for our team to provide you with a Return Authorization (RA) number and return shipping instructions.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="font-bold text-primary shrink-0">3.</span>
                                        <span>Pack the item securely in its original packaging and include the RA number on the package.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="font-bold text-primary shrink-0">4.</span>
                                        <span>Ship the package to the address provided by our team.</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/20 shrink-0">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-heading text-2xl font-bold uppercase tracking-tight mb-3">Refunds</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Once we receive your return, we will inspect the item and notify you of the approval or rejection of your refund.
                                    If approved, your refund will be processed within 5-7 business days, and a credit will automatically be applied to
                                    your original method of payment.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mt-4">
                                    <strong>Note:</strong> Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-4 pt-8 border-t border-border">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Exchanges</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We currently do not offer direct exchanges. If you need a different size or color, please return the original item
                            and place a new order for the desired product.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section className="space-y-4 pt-8 border-t border-border">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Non-Returnable Items</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            The following items cannot be returned:
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Items marked as "Final Sale"</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Personalized or custom-made items</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Items without original tags or packaging</span>
                            </li>
                        </ul>
                    </section>

                    {/* Contact CTA */}
                    <div className="mt-12 p-8 rounded-2xl bg-secondary/10 border border-border">
                        <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-2">Need Help?</h3>
                        <p className="text-muted-foreground mb-4">
                            If you have any questions about returns or exchanges, our team is here to help.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
