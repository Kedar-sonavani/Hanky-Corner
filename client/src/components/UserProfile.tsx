'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ShoppingBag, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function UserProfile() {
    const { user, isAdmin, signOut, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="h-10 w-10 flex items-center justify-center rounded-full animate-pulse bg-zinc-100" />
        );
    }

    if (!user) {
        return (
            <Link href="/auth">
                <button className="hover:bg-black/5 dark:hover:bg-white/10 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-inherit hover:text-inherit transition-colors">
                    Login
                </button>
            </Link>
        );
    }

    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];
    const initials = (user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase();

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-inherit"
            >
                <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {initials}
                </div>
            </button>


            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-[100]"
                    >
                        <div className="p-4 bg-zinc-50/50">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Signed in as</p>
                            <p className="text-sm font-bold text-zinc-900 truncate">{displayName}</p>
                            <p className="text-[10px] text-zinc-400 truncate tracking-tight">{user.email}</p>
                        </div>

                        <div className="p-2 space-y-1">
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Shield size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900">Admin Dashboard</p>
                                        <p className="text-[10px] text-zinc-500">Manage store & orders</p>
                                    </div>
                                </Link>
                            )}

                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
                            >
                                <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-200 transition-colors">
                                    <User size={16} />
                                </div>
                                <p className="text-sm font-bold text-zinc-900">My Profile</p>
                            </Link>

                            <Link
                                href="/profile/orders"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
                            >
                                <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-200 transition-colors">
                                    <ShoppingBag size={16} />
                                </div>
                                <p className="text-sm font-bold text-zinc-900">Orders</p>
                            </Link>

                            <div className="h-px bg-zinc-100 mx-2 my-1" />

                            <button
                                onClick={() => {
                                    signOut();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors group"
                            >
                                <div className="h-8 w-8 rounded-lg bg-red-100/50 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
                                    <LogOut size={16} />
                                </div>
                                <p className="text-sm font-bold">Sign Out</p>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}