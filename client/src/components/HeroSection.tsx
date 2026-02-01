'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative w-full h-[calc(100vh-4rem)] min-h-[600px] overflow-hidden bg-black text-white">

            {/* 1. BACKGROUND IMAGE */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
            >
                <Image
                    src={process.env.NEXT_PUBLIC_HERO_IMAGE || "/thumb.png"}
                    alt={`${process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner"} Premium Editorial`}
                    fill
                    className="object-cover object-center opacity-90"
                    priority
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
                />
            </motion.div>

            {/* 2. POSTER FRAME (FIXED) */}
            {/* - Changed 'top-4' to 'top-24'. This pushes the white border DOWN, below the Navbar.
               - Removed the center text "Premium Collection" so it doesn't fight with your Nav Menu.
            */}
            <div className="absolute top-24 bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 border border-white/20 pointer-events-none z-10 flex flex-col justify-between p-6">

                {/* Top Poster Details */}
                <div className="flex justify-between items-start text-xs font-mono uppercase tracking-widest opacity-70">
                    <span>Vol. 01 — 2024</span>
                    {/* REMOVED: <span className="hidden md:block">Premium Collection</span> (Conflicts with Navbar) */}
                    <span>Est. NYC</span>
                </div>

                {/* Bottom Poster Details */}
                <div className="flex justify-between items-end text-xs font-mono uppercase tracking-widest opacity-70">
                    <span className="hidden md:block">Scroll for more</span>
                    <span>Ref: #8829-B</span>
                </div>
            </div>

            {/* 3. CENTER CONTENT (FIXED) */}
            {/* Added 'pt-20' to push the main text down further from the header */}
            <div className="relative z-20 container h-full flex flex-col justify-center items-center text-center pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                // Content Box with blurred background

                >
                    {/* Badge */}
                    <span className="inline-block py-2 px-4 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-black text-white shadow-lg mb-4">
                        New Season Arrival
                    </span>

                    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white drop-shadow-xl">
                        MODERN <br /> ESSENTIALS
                    </h1>

                    <p className="text-sm md:text-lg text-white/90 max-w-lg mx-auto leading-relaxed font-medium drop-shadow-md">
                        Redefining the standard for everyday wear. Crafted with precision, designed for the bold.
                    </p>

                    <div className="pt-8">
                        <Link href="#collection">
                            <Button className="group h-14 px-8 bg-white text-black hover:bg-white/90 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                Explore Lookbook
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}