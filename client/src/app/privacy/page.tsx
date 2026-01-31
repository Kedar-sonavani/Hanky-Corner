'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Cookie, Mail, MapPin, Globe } from 'lucide-react';

export default function PrivacyPage() {
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
                        <Shield className="h-8 w-8" />
                    </motion.div>
                    <h1 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900">
                        Privacy Archive
                    </h1>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">Last Updated: January 2024</p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 p-8 md:p-12 space-y-12">

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-900">
                            <Eye className="h-6 w-6" />
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">Data Collection</h2>
                        </div>
                        <p className="text-zinc-600 leading-relaxed font-medium">
                            At Hanky Corner, we collect information that you provide directly to us when you make a purchase, sign up for our newsletter, or create an archive account. This information may include your name, email address, shipping address, and phone number.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-900">
                            <Lock className="h-6 w-6" />
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">Information Usage</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Processing your handcrafted orders",
                                "Managing your personalized archive",
                                "Sending shipping and delivery alerts",
                                "Curating exclusive product previews"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 italic font-medium text-zinc-700">
                                    <div className="h-2 w-2 rounded-full bg-zinc-900" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-900">
                            <Cookie className="h-6 w-6" />
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">Cookies & Tracking</h2>
                        </div>
                        <p className="text-zinc-600 leading-relaxed font-medium">
                            We use cookies to understand how you interact with our collection and to remember your archive preferences. This helps us provide a seamless and premium experience across our digital boutique.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-900">
                            <Mail className="h-6 w-6" />
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">Contact Us</h2>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-zinc-900 text-white space-y-4">
                            <p className="font-medium text-white/80">If you have any questions regarding your privacy in our archive, please reach out to our team:</p>
                            <div className="space-y-3 pt-4">
                                <div className="flex items-center gap-4">
                                    <Mail className="h-4 w-4 text-white/50" />
                                    <span className="font-bold tracking-wider">privacy@hankycorner.com</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Globe className="h-4 w-4 text-white/50" />
                                    <span className="font-bold tracking-wider">hankycorner.com</span>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
