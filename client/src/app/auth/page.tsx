'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

type AuthMode = 'login' | 'signup' | 'forgot';

function AuthContent() {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push(redirectTo);
            } else if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: 'user'
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    }
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Check your email for confirmation link!' });
            } else if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/update-password`,
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Password reset link sent to your email!' });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account',
                    },
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
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
                            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join the Archive' : 'Reset Access'}
                        </h2>
                        <p className="mt-2 text-sm font-medium text-zinc-400">
                            {mode === 'login'
                                ? 'Enter your credentials to access your archive.'
                                : mode === 'signup'
                                    ? 'Become a member of the handcrafted community.'
                                    : 'Enter your email to receive a reset link.'}
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
                            {mode !== 'forgot' && (
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Secure Password"
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
                            )}
                        </div>

                        {mode === 'login' && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setMode('forgot')}
                                    className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

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
                                    {mode === 'login' ? 'Authenticate' : mode === 'signup' ? 'Complete Registration' : 'Send Reset Link'}
                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    {mode !== 'forgot' && (
                        <>
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-4 bg-white text-zinc-400 font-bold uppercase tracking-widest">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full py-7 rounded-2xl border-zinc-100 hover:bg-zinc-50 transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">Sign in with Google</span>
                            </Button>
                        </>
                    )}

                    <div className="mt-8 pt-8 border-t border-zinc-50 text-center space-y-4">
                        <button
                            onClick={() => {
                                if (mode === 'forgot') setMode('login');
                                else setMode(mode === 'login' ? 'signup' : 'login');
                                setMessage(null);
                            }}
                            className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors block w-full"
                        >
                            {mode === 'login'
                                ? "Don't have an account? Sign Up"
                                : mode === 'signup'
                                    ? 'Already a member? Sign In'
                                    : 'Back to Sign In'}
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

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
}
