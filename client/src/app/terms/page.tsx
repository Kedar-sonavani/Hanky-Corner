'use client';

import { motion } from 'framer-motion';
import { Gavel, ShoppingBag, Truck, RotateCcw, CreditCard, Scale } from 'lucide-react';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-zinc-50/50 pt-24 pb-20 font-sans">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* HEADER */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex p-3 rounded-2xl bg-zinc-900 text-white mb-4"
                    >
                        <Gavel className="h-8 w-8" />
                    </motion.div>
                    <h1 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900">
                        Terms of Service
                    </h1>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">Agreement for Excellence</p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 p-8 md:p-12 space-y-12">

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-900">
                            <ShoppingBag className="h-6 w-6" />
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">1. Purchase Terms</h2>
                        </div>
                        <p className="text-zinc-600 leading-relaxed font-medium">
                            By placing an order with Hanky Corner, you agree to provide current, complete, and accurate purchase and account information for all purchases made at our boutique. We reserve the right to refuse any order you place with us.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-900">
                            <CreditCard className="h-6 w-6" />
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">2. Pricing & Payments</h2>
                        </div>
                        <p className="text-zinc-600 leading-relaxed font-medium">
                            All prices for our handcrafted items are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-900">
                            <Truck className="h-6 w-6" />
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">3. Shipping & Delivery</h2>
                        </div>
                        <p className="text-zinc-600 leading-relaxed font-medium">
                            Items are shipped within 3-5 business days. Delivery times are estimates and may vary based on your location and carrier performance. Hanky Corner is not responsible for delays caused by the shipping provider.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-900">
                            <RotateCcw className="h-6 w-6" />
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">4. Returns & Refunds</h2>
                        </div>
                        <p className="text-zinc-600 leading-relaxed font-medium">
                            Due to the handcrafted and personal nature of our products, we typically do not accept returns unless the item is defective. Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-900">
                            <Scale className="h-6 w-6" />
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">5. Governing Law</h2>
                        </div>
                        <p className="text-zinc-600 leading-relaxed font-medium">
                            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
}
