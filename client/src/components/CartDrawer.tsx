'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cartItems, removeItem, updateQuantity, cartTotal, cartCount } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[70] shadow-2xl flex flex-col
                                 bg-zinc-900/80 backdrop-blur-2xl border-l border-white/10 !text-white"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 !text-white" />
                                <h2 className="text-xl font-bold !text-white">Your Bag ({cartCount})</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="h-6 w-6 !text-white" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <ShoppingBag className="h-12 w-12 text-white/20" />
                                    <p className="!text-white/60 font-medium">Your bag is empty.</p>
                                    <Button onClick={onClose} variant="outline" className="border-white/20 !text-white hover:bg-white/10">
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-24 w-24 relative rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-sm !text-white line-clamp-1">{item.title}</h3>
                                                    <button onClick={() => removeItem(item.id)} className="text-white/40 hover:text-red-400 p-1 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="!text-white/90 font-bold mt-1">₹{item.price}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-white/20 rounded-lg bg-white/5 px-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 !text-white hover:bg-white/10 disabled:opacity-20"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold !text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 !text-white hover:bg-white/10 disabled:opacity-20"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="font-bold text-sm !text-white">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-white/5 space-y-4 backdrop-blur-md">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="!text-white">Subtotal</span>
                                    <span className="!text-white">₹{cartTotal}</span>
                                </div>
                                <p className="text-xs !text-white/50">Shipping and taxes calculated at checkout.</p>
                                <div className="grid gap-3">
                                    <Link href="/checkout" onClick={onClose} className="w-full">
                                        <Button className="w-full py-6 text-lg font-bold bg-white !text-black hover:bg-zinc-200">
                                            Checkout Now
                                        </Button>
                                    </Link>
                                    <Button variant="outline" onClick={onClose} className="w-full py-4 border-white/20 !text-white hover:bg-white/10">
                                        Continue Shopping
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}