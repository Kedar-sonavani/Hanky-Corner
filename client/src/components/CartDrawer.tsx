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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[70] shadow-2xl flex flex-col
                                 bg-background border-l border-border text-foreground"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/20">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-heading font-bold uppercase tracking-tight">Your Bag ({cartCount})</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-primary">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="bg-secondary p-6 rounded-full">
                                        <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-muted-foreground font-medium text-lg">Your bag is empty.</p>
                                    <Button onClick={onClose} variant="outline" className="border-primary/20 hover:bg-secondary font-bold">
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="h-24 w-24 relative rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-heading font-bold text-sm text-foreground line-clamp-1">{item.title}</h3>
                                                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive p-1 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold mt-1 text-muted-foreground">₹{item.price}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-border rounded-lg bg-background p-0.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 text-foreground hover:bg-secondary rounded-md disabled:opacity-20 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 text-foreground hover:bg-secondary rounded-md disabled:opacity-20 transition-colors"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <p className="font-bold text-sm text-primary">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-border bg-secondary/20 space-y-4 backdrop-blur-md">
                                <div className="flex justify-between items-center text-lg font-heading font-bold">
                                    <span className="text-foreground">Subtotal</span>
                                    <span className="text-primary">₹{cartTotal}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
                                <div className="grid gap-3">
                                    <Link href="/checkout" onClick={onClose} className="w-full">
                                        <Button className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20">
                                            Checkout Now
                                        </Button>
                                    </Link>
                                    <Button variant="outline" onClick={onClose} className="w-full py-4 border-border bg-transparent hover:bg-background">
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