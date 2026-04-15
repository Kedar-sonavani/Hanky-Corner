'use client';

import { OrderHistory } from '@/components/OrderHistory';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function UserOrdersPage() {
    return (
        <main className="min-h-screen bg-white pt-24 pb-20">
            <div className="container max-w-4xl">
                
                {/* Navigation / Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <Link 
                            href="/profile" 
                            className="group flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                            <ChevronLeft className="h-3 w-3 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Profile
                        </Link>
                        <div>
                            <h1 className="text-4xl font-heading font-black uppercase tracking-tighter text-zinc-900 flex items-center gap-4">
                                My Order History
                            </h1>
                            <p className="text-zinc-500 font-medium mt-2">Track your curated collection and past purchases.</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative">
                    {/* Decorative Background Element */}
                    <div className="absolute -top-24 -right-24 h-64 w-64 bg-zinc-50 rounded-full blur-3xl opacity-50 -z-10" />
                    <div className="absolute top-1/2 -left-32 h-96 w-96 bg-zinc-50 rounded-full blur-3xl opacity-50 -z-10" />
                    
                    <OrderHistory />
                </div>

                {/* Footer Tip */}
                <div className="mt-16 text-center">
                    <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                        Handcrafted with care for you
                    </p>
                </div>
            </div>
        </main>
    );
}
