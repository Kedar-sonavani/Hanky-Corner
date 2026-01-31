'use client';

import { useMasterSwitch } from '@/context/MasterSwitchContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    const [isHovered, setIsHovered] = useState(false);

    // Calculate Discount
    const isDiscounted = !!product.discount_price;
    const discountPercentage = isDiscounted
        ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
        : 0;

    // Navigation Handlers
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
        showToast(`${product.title} added to bag.`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative w-full cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.id}`} className="block h-full">

                {/* 1. IMAGE CONTAINER */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-secondary/20 isolate">

                    {/* Tags (Top Left) */}
                    <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
                        {product.is_new && (
                            <span className="inline-flex items-center rounded-sm bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                                New
                            </span>
                        )}
                        {isDiscounted && (
                            <span className="inline-flex items-center rounded-sm bg-[#FF3333] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                                -{discountPercentage}%
                            </span>
                        )}
                    </div>

                    {/* Image Carousel */}
                    <div className="relative h-full w-full">
                        <Image
                            src={product.images[currentImageIndex]}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>

                    {/* Navigation Arrows (Visible on Hover) */}
                    {product.images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className={cn(
                                    "absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center text-black shadow-sm transition-all duration-300 hover:bg-white",
                                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                )}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={nextImage}
                                className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center text-black shadow-sm transition-all duration-300 hover:bg-white",
                                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                )}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </>
                    )}

                    {/* Quick Add Button (Visible on Hover) */}
                    {isEcommerceActive && (
                        <div className={cn(
                            "absolute bottom-4 right-4 z-20 transition-all duration-300",
                            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}>
                            <Button
                                onClick={handleAddToCart}
                                size="icon"
                                className="h-10 w-10 rounded-full bg-black text-white shadow-lg hover:bg-black/90 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Plus className="h-5 w-5" />
                                <span className="sr-only">Add to Cart</span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* 2. PRODUCT DETAILS */}
                <div className="mt-4 space-y-1">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="font-heading font-semibold text-base leading-tight text-foreground line-clamp-2">
                            {product.title}
                        </h3>

                        {/* Rating (Minimalist) */}
                        <div className="flex items-center gap-1 shrink-0">
                            <Star className="h-3 w-3 fill-current text-foreground/30" />
                            <span className="text-xs font-mono text-muted-foreground">4.5</span>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-bold text-foreground font-mono tracking-tight">
                            ₹{isDiscounted ? product.discount_price?.toLocaleString() : product.price.toLocaleString()}
                        </span>
                        {isDiscounted && (
                            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                                ₹{product.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}