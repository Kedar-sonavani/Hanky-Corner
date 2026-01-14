'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-square bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center rounded-[2rem]">
                <span className="text-zinc-400 font-bold italic uppercase tracking-widest text-xs">No Imagery Available</span>
            </div>
        );
    }

    const nextImage = () => setSelectedIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="space-y-6">
            {/* Main Interactive Image */}
            <div
                className="relative aspect-[4/5] bg-zinc-50 dark:bg-zinc-950 rounded-[2.5rem] overflow-hidden group border border-zinc-100"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full relative"
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`${productName} - Image ${selectedIndex + 1}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-zinc-900 h-14 w-14 flex items-center justify-center rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 -translate-x-4 group-hover:translate-x-0"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-zinc-900 h-14 w-14 flex items-center justify-center rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 translate-x-4 group-hover:translate-x-0"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Premium Thumbnail Grid */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {images.map((image, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${index === selectedIndex
                                ? 'border-primary shadow-xl shadow-primary/10'
                                : 'border-zinc-100 grayscale hover:grayscale-0 hover:border-zinc-300'
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
