'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, ShoppingBag, ArrowRight, User, LogOut, ShieldCheck, Mail, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getApiUrl } from '@/lib/api';

interface OrderItem {
    id: string;
    product_title: string;
    quantity: number;
    price_at_purchase: number;
}

interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    total_price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    order_items: OrderItem[];
}

export default function AccountPage() {
    const { user, session, signOut, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setProducts] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = getApiUrl();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth?redirect=/account');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session?.access_token) return;
            try {
                const res = await fetch(`${apiUrl}/api/orders/mine`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });
                if (res.ok) {
                    setProducts(await res.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user, session, apiUrl]);

    if (authLoading || (!user && !authLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50/50 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT: USER PROFILE CARD */}
                    <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
                            <div className="bg-zinc-900 p-8 text-white text-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 pointer-events-none">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
                                </div>
                                <div className="relative inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                                    <User className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-heading font-black tracking-tight uppercase">Profile</h2>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Hanky Corner Archive</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                        <div className="p-2 rounded-xl bg-white shadow-sm border border-zinc-200">
                                            <Mail className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Archive Email</p>
                                            <p className="text-sm font-semibold text-zinc-900 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                        <div className="p-2 rounded-xl bg-white shadow-sm border border-zinc-200">
                                            <ShieldCheck className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</p>
                                            <p className="text-sm font-semibold text-zinc-900">Authenticated Member</p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => signOut()}
                                    variant="outline"
                                    className="w-full py-6 rounded-2xl border-zinc-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all font-bold uppercase tracking-widest text-xs"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ORDER HISTORY */}
                    <div className="lg:col-span-8 space-y-8">
                        <div>
                            <h1 className="font-heading text-4xl font-black uppercase tracking-tighter text-zinc-900">Order Archive</h1>
                            <p className="text-zinc-400 font-medium text-sm mt-1">Review your history of excellence.</p>
                        </div>

                        {loading ? (
                            <div className="space-y-6">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="h-48 rounded-[2.5rem] bg-zinc-200/50 animate-pulse" />
                                ))}
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-[2.5rem] shadow-xl shadow-zinc-200/40 border border-zinc-100 overflow-hidden"
                                    >
                                        <div className="p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 border-b border-zinc-50">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-2xl bg-zinc-900 text-white shadow-lg shadow-zinc-200">
                                                    <Hash className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Order ID</p>
                                                    <p className="text-sm font-mono font-bold text-zinc-900">{order.id.split('-')[0].toUpperCase()}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Archive</p>
                                                    <p className="text-lg font-black text-zinc-900">₹{order.total_price.toLocaleString()}</p>
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                    order.status === 'delivered' ? "bg-green-50 text-green-600 border-green-100" :
                                                        order.status === 'shipped' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            order.status === 'cancelled' ? "bg-red-50 text-red-600 border-red-100" :
                                                                "bg-zinc-100 text-zinc-600 border-zinc-200"
                                                )}>
                                                    {order.status}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 sm:p-8 bg-zinc-50/50">
                                            <div className="space-y-4">
                                                {order.order_items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-white border border-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                                                {item.quantity}x
                                                            </div>
                                                            <p className="text-sm font-bold text-zinc-800">{item.product_title}</p>
                                                        </div>
                                                        <p className="text-sm font-mono text-zinc-500">₹{item.price_at_purchase.toLocaleString()}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">
                                                        {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    className="rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-100 pr-2 group"
                                                >
                                                    View Details
                                                    <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] p-20 text-center space-y-8 border border-zinc-100 shadow-xl shadow-zinc-200/40">
                                <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-900 text-white shadow-2xl shadow-zinc-200 rotate-12">
                                    <ShoppingBag className="h-10 w-10" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-heading text-3xl font-black uppercase tracking-tight text-zinc-900">Your archive is empty</h3>
                                    <p className="text-zinc-400 font-medium max-w-sm mx-auto">It's time to curate your first collection of handcrafted excellence.</p>
                                </div>
                                <Link href="/collections">
                                    <Button className="py-7 rounded-[2rem] px-10 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-zinc-200/50">
                                        Browse Archive
                                        <ArrowRight className="h-4 w-4 ml-3" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
