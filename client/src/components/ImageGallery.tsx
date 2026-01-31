'use client';

import { useState, useRef, MouseEvent, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
    images: string[];
    productName: string;
    autoPlayInterval?: number;
}

export function ImageGallery({ images, productName, autoPlayInterval = 4000 }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Zoom State
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    // --- Logic: Navigation ---
    const nextImage = useCallback(() => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // --- Logic: Auto Swap Mechanism ---
    useEffect(() => {
        if (images.length <= 1 || isZoomed || isFullscreen) return;

        const timer = setInterval(() => {
            nextImage();
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [images.length, isZoomed, isFullscreen, autoPlayInterval, nextImage]);


    // --- Logic: Zoom Handling ---
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();

        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setMousePosition({ x, y });
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="space-y-6 select-none">
            {/* MAIN IMAGE CONTAINER */}
            <div
                className="relative aspect-[4/5] w-full bg-[#F5F5F5] rounded-[2rem] overflow-hidden group isolate cursor-zoom-in border border-border/50"
                ref={imageRef}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setIsFullscreen(true)}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            scale: isZoomed ? 2 : 1,
                            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.2, ease: "easeOut" }
                        }}
                        className="w-full h-full relative"
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`${productName} - View ${selectedIndex + 1}`}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators (Dots) */}
                {images.length > 1 && !isZoomed && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                    idx === selectedIndex
                                        ? "w-6 bg-white"
                                        : "w-1.5 bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Overlay Hint */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <span className="bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full backdrop-blur-md border border-white/10">
                        Click to Expand
                    </span>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && !isZoomed && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-20"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-20"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>

            {/* THUMBNAIL STRIP */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 snap-start border-2",
                                index === selectedIndex
                                    ? "border-primary shadow-md opacity-100 scale-105"
                                    : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            {index === selectedIndex && !isZoomed && !isFullscreen && (
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
                                    className="absolute bottom-0 left-0 h-1 bg-primary z-10"
                                    key={selectedIndex}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* FULLSCREEN LIGHTBOX */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors z-50"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-10 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="relative w-full h-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={images[selectedIndex]}
                                    alt="Fullscreen view"
                                    fill
                                    className="object-contain"
                                    quality={100}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}