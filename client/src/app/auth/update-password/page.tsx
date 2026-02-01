'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' });

            setTimeout(() => {
                router.push('/auth');
            }, 2000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 border border-zinc-100">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-zinc-900 shadow-xl shadow-zinc-200">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-heading font-black tracking-tight text-zinc-900">
                            New Password
                        </h2>
                        <p className="mt-2 text-sm font-medium text-zinc-400">
                            Enter your new secure password below to regain access.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleUpdate}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="New Password"
                                    className="block w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm New Password"
                                    className="block w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`p-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest text-center ${message.type === 'error'
                                        ? 'bg-red-50 border-red-100 text-red-600'
                                        : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                        }`}
                                >
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-7 rounded-2xl text-base font-black uppercase tracking-[0.2em] shadow-xl shadow-zinc-200/50 hover:shadow-zinc-300 transition-all group"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto text-white/50" />
                            ) : (
                                <>
                                    Update Password
                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-zinc-300">
                    Handcrafted Security by Hanky Corner
                </p>
            </motion.div>
        </div>
    );
}
