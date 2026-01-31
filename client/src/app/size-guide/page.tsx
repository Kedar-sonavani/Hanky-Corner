'use client';

import Link from 'next/link';
import { Ruler, Shirt } from 'lucide-react';

export default function SizeGuidePage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="container max-w-4xl mx-auto px-4">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-8">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-foreground">Size Guide</span>
                </nav>

                {/* Header */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10">
                            <Ruler className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">
                            Size Guide
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Find your perfect fit with our comprehensive sizing information.
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none space-y-12">

                    {/* Handkerchief Sizes */}
                    <section className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/20 shrink-0">
                                <Shirt className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-heading text-2xl font-bold uppercase tracking-tight mb-4">Handkerchief Sizes</h2>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-border">
                                                <th className="text-left py-3 px-4 font-bold uppercase tracking-widest text-xs">Size</th>
                                                <th className="text-left py-3 px-4 font-bold uppercase tracking-widest text-xs">Dimensions</th>
                                                <th className="text-left py-3 px-4 font-bold uppercase tracking-widest text-xs">Best For</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-muted-foreground">
                                            <tr className="border-b border-border">
                                                <td className="py-4 px-4 font-bold">Pocket Square</td>
                                                <td className="py-4 px-4">10" × 10" (25cm × 25cm)</td>
                                                <td className="py-4 px-4">Suit jacket breast pocket</td>
                                            </tr>
                                            <tr className="border-b border-border">
                                                <td className="py-4 px-4 font-bold">Standard</td>
                                                <td className="py-4 px-4">16" × 16" (40cm × 40cm)</td>
                                                <td className="py-4 px-4">Everyday carry, general use</td>
                                            </tr>
                                            <tr className="border-b border-border">
                                                <td className="py-4 px-4 font-bold">Large</td>
                                                <td className="py-4 px-4">20" × 20" (50cm × 50cm)</td>
                                                <td className="py-4 px-4">Display, decorative purposes</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Measurement Guide */}
                    <section className="space-y-4 pt-8 border-t border-border">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">How to Measure</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            All measurements are taken flat and represent the finished product dimensions. Our handkerchiefs are square-shaped
                            with hand-rolled or machine-hemmed edges, depending on the product.
                        </p>
                    </section>

                    {/* Care Instructions */}
                    <section className="space-y-4 pt-8 border-t border-border">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Care Instructions</h2>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Cotton:</strong> Machine wash cold, tumble dry low, iron on medium heat</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Silk:</strong> Hand wash or dry clean only, iron on low heat with a pressing cloth</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Linen:</strong> Machine wash cold, line dry, iron while slightly damp for best results</span>
                            </li>
                        </ul>
                    </section>

                    {/* Contact CTA */}
                    <div className="mt-12 p-8 rounded-2xl bg-secondary/10 border border-border">
                        <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-2">Still Unsure?</h3>
                        <p className="text-muted-foreground mb-4">
                            If you need help choosing the right size or have specific questions, we're here to assist.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
