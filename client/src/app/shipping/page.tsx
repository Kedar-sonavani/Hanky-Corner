'use client';

import Link from 'next/link';
import { Package, Clock, MapPin, Truck } from 'lucide-react';

export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="container max-w-4xl mx-auto px-4">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-8">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-foreground">Shipping</span>
                </nav>

                {/* Header */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10">
                            <Truck className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">
                            Shipping Policy
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
                                <h2 className="font-heading text-2xl font-bold uppercase tracking-tight mb-3">Processing Time</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.
                                    If we are experiencing a high volume of orders, shipments may be delayed by a few days.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/20 shrink-0">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-heading text-2xl font-bold uppercase tracking-tight mb-3">Shipping Rates & Delivery</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Shipping charges for your order will be calculated and displayed at checkout. We offer the following shipping options:
                                </p>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span><strong>Standard Shipping:</strong> 5-7 business days - ₹100</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span><strong>Express Shipping:</strong> 2-3 business days - ₹250</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span><strong>Free Shipping:</strong> On orders above ₹2,000</span>
                                    </li>
                                </ul>
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
                                <h2 className="font-heading text-2xl font-bold uppercase tracking-tight mb-3">Order Tracking</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Once your order has shipped, you will receive an email with a tracking number. You can track your package using this number
                                    on our courier partner's website. If you have any questions about your shipment, please contact us at{' '}
                                    <a href="mailto:support@hankycorner.com" className="text-primary hover:underline">support@hankycorner.com</a>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-4 pt-8 border-t border-border">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">International Shipping</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We currently ship within India only. International shipping will be available soon.
                            Please check back or contact us for updates.
                        </p>
                    </section>

                    {/* Contact CTA */}
                    <div className="mt-12 p-8 rounded-2xl bg-secondary/10 border border-border">
                        <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-2">Have Questions?</h3>
                        <p className="text-muted-foreground mb-4">
                            If you have any questions about our shipping policy, please don't hesitate to reach out.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
