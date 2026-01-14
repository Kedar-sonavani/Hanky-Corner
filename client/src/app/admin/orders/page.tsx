'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    ExternalLink,
    Search,
    Filter
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
    customer_phone: string;
    shipping_address: string;
    total_price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    admin_notes: string;
    created_at: string;
    order_items: OrderItem[];
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const statusIcons = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle2,
    cancelled: XCircle
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/orders`, {
                headers: { 'x-admin-secret': 'AdminPASS' }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`${apiUrl}/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': 'AdminPASS'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchOrders();
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
                }
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-50/50 py-12 px-6">
            <div className="container max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link href="/admin" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-2">
                            <ChevronLeft className="h-3 w-3" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-light tracking-tight text-zinc-900 flex items-center gap-3">
                            <Package className="h-8 w-8 text-zinc-600 stroke-[1.5px]" />
                            Order Management
                        </h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Orders List */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email or ID..."
                                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-zinc-400 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-300">
                                <div className="animate-spin h-8 w-8 border-4 border-zinc-900 border-t-transparent rounded-full mx-auto mb-4" />
                                <p className="text-zinc-500 font-medium">Loading orders...</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-300">
                                <Package className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                                <p className="text-zinc-500 font-medium">No orders found.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredOrders.map((order) => {
                                    const StatusIcon = statusIcons[order.status];
                                    return (
                                        <motion.div
                                            layoutId={order.id}
                                            key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            className={`group p-6 rounded-2xl border transition-all cursor-pointer ${selectedOrder?.id === order.id
                                                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-200'
                                                    : 'bg-white border-zinc-200 hover:border-zinc-400'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold uppercase tracking-widest opacity-50">#{order.id.slice(0, 8)}</span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${selectedOrder?.id === order.id
                                                                ? 'border-white/20 bg-white/10 text-white'
                                                                : statusColors[order.status]
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-lg">{order.customer_name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-light tracking-tighter">₹{order.total_price.toLocaleString('en-IN')}</p>
                                                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Order Details Panel */}
                    <div className="lg:col-span-4">
                        <AnimatePresence mode="wait">
                            {selectedOrder ? (
                                <motion.div
                                    key={selectedOrder.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="sticky top-24 space-y-6"
                                >
                                    <Card className="border-zinc-200 rounded-[2rem] shadow-sm bg-white overflow-hidden">
                                        <CardHeader className="border-b border-zinc-50 p-8">
                                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-900 flex items-center justify-between">
                                                Order Details
                                                <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-zinc-900">
                                                    <XCircle size={20} className="stroke-[1.5px]" />
                                                </button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-8">
                                            {/* Status Update */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Update Status</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Object.keys(statusColors).map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateStatus(selectedOrder.id, s);
                                                            }}
                                                            className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${selectedOrder.status === s
                                                                    ? 'bg-zinc-900 border-zinc-900 text-white'
                                                                    : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-400'
                                                                }`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customer</p>
                                                    <p className="font-bold text-sm text-zinc-900">{selectedOrder.customer_name}</p>
                                                    <p className="text-sm text-zinc-600 font-medium">{selectedOrder.customer_email}</p>
                                                    <p className="text-sm text-zinc-600 font-medium">{selectedOrder.customer_phone}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Shipping Address</p>
                                                    <p className="text-sm text-zinc-800 leading-relaxed font-medium">{selectedOrder.shipping_address}</p>
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <div className="space-y-4 border-t border-zinc-100 pt-6">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Order Items</p>
                                                <div className="space-y-4">
                                                    {selectedOrder.order_items.map((item) => (
                                                        <div key={item.id} className="flex justify-between items-start gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-zinc-900 line-clamp-1">{item.product_title}</p>
                                                                <p className="text-xs text-zinc-500 font-medium">Qty: {item.quantity} × ₹{item.price_at_purchase}</p>
                                                            </div>
                                                            <p className="font-bold text-sm text-zinc-900">₹{item.quantity * item.price_at_purchase}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-4 border-t border-zinc-100 flex justify-between items-end">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Revenue</p>
                                                    <p className="text-2xl font-light tracking-tighter text-zinc-900">₹{selectedOrder.total_price.toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-zinc-200 rounded-[2rem] text-center">
                                    <div className="space-y-2">
                                        <Package className="h-10 w-10 text-zinc-200 mx-auto stroke-[1.5px]" />
                                        <p className="text-sm text-zinc-400 font-medium">Select an order to view details and update status.</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
