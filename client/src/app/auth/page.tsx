'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push(redirectTo);
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: 'user' // Default role
                        }
                    }
                });
                if (error) throw error;
                alert('Check your email for confirmation!');
            }
        } catch (err: any) {
            setError(err.message);
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
                            {isLogin ? 'Welcome Back' : 'Join the Archive'}
                        </h2>
                        <p className="mt-2 text-sm font-medium text-zinc-400">
                            {isLogin ? 'Enter your credentials to access your archive.' : 'Become a member of the handcrafted community.'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleAuth}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Archive Email"
                                    className="block w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 transition-all outline-none"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Secure Password"
                                    className="block w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center"
                                >
                                    {error}
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
                                    {isLogin ? 'Authenticate' : 'Complete Registration'}
                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-zinc-50 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : 'Already a member? Sign In'}
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-zinc-300">
                    Handcrafted Security by Hanky Corner
                </p>
            </motion.div>
        </div>
    );
}
