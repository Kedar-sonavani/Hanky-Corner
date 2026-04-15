'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getApiUrl } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Calendar, Package, ChevronRight, IndianRupee, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface OrderItem {
    id: string;
    product_id: string;
    title: string;
    quantity: number;
    price_at_purchase: number;
    product_title: string;
    // Handle both object (one-to-one) and array (one-to-many/ambiguous) join structures
    products?: {
        images: string[];
    } | {
        images: string[];
    }[] | null;
}

interface Order {
    id: string;
    customer_name: string;
    total_price: number;
    status: string;
    created_at: string;
    order_items: OrderItem[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    processing: 'bg-blue-50 text-blue-700 border-blue-100',
    shipped: 'bg-purple-50 text-purple-700 border-purple-100',
    delivered: 'bg-green-50 text-green-700 border-green-100',
    cancelled: 'bg-red-50 text-red-700 border-red-100',
};

const statusIcons: Record<string, any> = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle2,
    cancelled: AlertCircle,
};

export function OrderHistory() {
    const { session, user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session) return;

            try {
                const apiUrl = getApiUrl();
                const res = await fetch(`${apiUrl}/api/orders/mine`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch your orders');

                const data = await res.json();
                setOrders(data);
            } catch (err: any) {
                console.error('Error fetching orders:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session]);

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 w-full bg-zinc-100 animate-pulse rounded-3xl" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-12 text-center border-dashed border-2 border-red-100 bg-red-50/30 rounded-[2.5rem]">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-900 mb-2">Error Loading Orders</h3>
                <p className="text-red-600/70 text-sm max-w-xs mx-auto mb-6">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full border-red-200 text-red-700 hover:bg-red-100">
                    Try Again
                </Button>
            </Card>
        );
    }

    if (orders.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 px-6 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200"
            >
                <div className="h-20 w-20 bg-white rounded-[2rem] shadow-xl shadow-zinc-200 flex items-center justify-center mx-auto mb-8">
                    <ShoppingBag className="h-10 w-10 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-heading font-black uppercase tracking-tight text-zinc-900 mb-3">No orders yet</h3>
                <p className="text-zinc-500 max-w-xs mx-auto mb-8 font-medium">When you place an order, it will appear here for you to track.</p>
                <Button asChild className="rounded-full px-10 py-7 font-black uppercase tracking-widest text-[11px] shadow-2xl">
                    <a href="/collections">Start Shopping</a>
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8">
            {orders.map((order, idx) => {
                const StatusIcon = statusIcons[order.status] || Clock;
                return (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="overflow-hidden border-zinc-200/60 shadow-xl shadow-zinc-200/40 rounded-[2.5rem] group hover:border-zinc-900 transition-all duration-500">
                            {/* Order Header */}
                            <div className="p-6 md:p-8 bg-zinc-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-100">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Order ID</p>
                                        <span className="text-xs font-mono font-bold text-zinc-900 bg-white px-2 py-0.5 rounded shadow-sm">
                                            {order.id.slice(0, 8)}...
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                                        <Calendar className="h-4 w-4 text-zinc-400" />
                                        {new Date(order.created_at).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>

                                <div className={cn(
                                    "px-4 py-2 rounded-2xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                                    statusColors[order.status] || 'bg-zinc-100'
                                )}>
                                    <StatusIcon className="h-4 w-4" />
                                    {order.status}
                                </div>
                            </div>

                            {/* Order Body */}
                            <div className="p-6 md:p-8">
                                <div className="space-y-6">
                                    {order.order_items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-6">
                                            <div className="h-16 w-16 bg-zinc-100 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 relative">
                                                {(() => {
                                                    // Extract image from either object or array structure
                                                    const productData = Array.isArray(item.products) ? item.products[0] : item.products;
                                                    const imageUrl = productData?.images?.[0];
                                                    
                                                    if (imageUrl) {
                                                        return (
                                                            <Image 
                                                                src={imageUrl} 
                                                                alt={item.product_title} 
                                                                fill 
                                                                className="object-cover"
                                                                unoptimized={imageUrl.startsWith('http')} 
                                                            />
                                                        );
                                                    }
                                                    return (
                                                        <div className="h-full w-full flex items-center justify-center text-zinc-300">
                                                            <Package className="h-8 w-8" />
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm md:text-base font-bold text-zinc-900 truncate">{item.product_title}</h4>
                                                <p className="text-xs text-zinc-500 font-medium">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-zinc-900 flex items-center justify-end">
                                                    <IndianRupee className="h-3 w-3" />
                                                    {item.price_at_purchase * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Total Paid</p>
                                        <p className="text-2xl font-black text-zinc-900 flex items-center">
                                            <IndianRupee className="h-5 w-5 mr-1" />
                                            {order.total_price}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
