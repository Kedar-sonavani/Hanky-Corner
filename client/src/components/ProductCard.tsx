'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMasterSwitch } from '@/context/MasterSwitchContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    discount_price?: number;
    images: string[];
    is_new?: boolean;
    is_featured?: boolean;
    stock?: number;
}

export function ProductCard({ product, index = 0 }: { product: Product, index?: number }) {
    const { isEcommerceActive } = useMasterSwitch();
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: Math.random().toString(36).substr(2, 9),
            product_id: product.id,
            title: product.title,
            price: product.discount_price ?? product.price,
            quantity: 1,
            image: product.images[0],
            stock: product.stock ?? 0
        });
        showToast(`${product.title} added to bag!`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <Link href={`/products/${product.id}`} className="block h-full group/main">
                <Card className="overflow-hidden border-none bg-white dark:bg-zinc-950 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] cursor-pointer h-full flex flex-col rounded-[2rem]">
                    <div className="aspect-[4/5] relative bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                        {/* Premium Badges */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            {product.is_new && (
                                <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
                                    New
                                </span>
                            )}
                            {product.is_featured && (
                                <span className="bg-white/90 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl backdrop-blur-md border border-zinc-200">
                                    Curated
                                </span>
                            )}
                            {isEcommerceActive && (product.stock ?? 0) <= 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
                                    Out of Stock
                                </span>
                            )}
                            {product.discount_price && (
                                <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
                                    {Math.round(((product.price - product.discount_price) / product.price) * 100)}% Off
                                </span>
                            )}
                        </div>

                        {product.images && product.images.length > 0 ? (
                            <>
                                <Image
                                    src={product.images[currentImageIndex]}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover/main:scale-110"
                                />
                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-900 h-10 w-10 flex items-center justify-center rounded-full opacity-0 group-hover/main:opacity-100 transition-all duration-300 z-10 shadow-lg translate-x-[-10px] group-hover/main:translate-x-0"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-900 h-10 w-10 flex items-center justify-center rounded-full opacity-0 group-hover/main:opacity-100 transition-all duration-300 z-10 shadow-lg translate-x-[10px] group-hover/main:translate-x-0"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-400 font-medium italic">
                                Preview Unavailable
                            </div>
                        )}

                        {/* Quick Action Overlay */}
                        {isEcommerceActive && (product.stock ?? 0) > 0 && (
                            <div className="absolute inset-x-4 bottom-4 z-20 translate-y-12 group-hover/main:translate-y-0 opacity-0 group-hover/main:opacity-100 transition-all duration-500">
                                <Button
                                    onClick={handleAddToCart}
                                    className="w-full h-12 rounded-2xl bg-black text-white hover:bg-zinc-800 border-none font-bold uppercase tracking-widest text-xs shadow-2xl"
                                >
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Quick Add
                                </Button>
                            </div>
                        )}
                        {isEcommerceActive && (product.stock ?? 0) <= 0 && (
                            <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-center translate-y-12 group-hover/main:translate-y-0 opacity-0 group-hover/main:opacity-100 transition-all duration-500">
                                <div className="w-full h-12 rounded-2xl bg-zinc-200/50 backdrop-blur-md text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center">
                                    Unavailable
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex justify-between items-start gap-4">
                                <h3 className="text-lg font-bold tracking-tight text-zinc-900 group-hover/main:text-primary transition-colors">{product.title}</h3>
                                <div className="flex flex-col items-end">
                                    {product.discount_price ? (
                                        <>
                                            <span className="text-lg font-black tracking-tighter text-zinc-900 italic">₹{product.discount_price}</span>
                                            <span className="text-xs font-bold text-zinc-400 line-through">₹{product.price}</span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-black tracking-tighter text-zinc-900 italic">₹{product.price}</span>
                                    )}
                                </div>
                            </div>
                            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 font-medium">{product.description}</p>
                        </div>

                        {!isEcommerceActive && (
                            <div className="mt-4 pt-4 border-t border-zinc-50">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Showcase Only</span>
                            </div>
                        )}
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}
