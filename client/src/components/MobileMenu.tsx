'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const menuItems = [
        { label: 'New Arrivals', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: 'Accessories', href: '/accessories' },
        { label: 'Editorial', href: '/editorial' },
        { label: 'Our Story', href: '/about' },
    ];

    // Simplified Animation Variants
    const menuVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.3, delay: 0.2 } }
    };

    const containerVars = {
        initial: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
        animate: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
        exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
    };

    const linkVars = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { y: 20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={menuVars}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fixed inset-0 z-[60] bg-black text-white flex flex-col overflow-hidden"
                >
                    {/* 1. HEADER */}
                    <div className="flex justify-between items-center p-6 border-b border-white/10 relative z-20">
                        <span className="font-heading font-extrabold tracking-tighter text-2xl uppercase">
                            {(process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner").split(' ')[0]} <span className="italic font-serif text-white/70">{(process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner").split(' ').slice(1).join(' ')}</span>
                        </span>

                        <button
                            onClick={onClose}
                            className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* 2. MAIN LINKS (Centered) */}
                    <motion.div
                        variants={containerVars}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex-1 flex flex-col justify-center px-6 relative z-20"
                    >
                        <div className="space-y-6">
                            {menuItems.map((item, i) => (
                                <div key={i} className="overflow-hidden">
                                    <motion.div variants={linkVars}>
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className="group flex items-center gap-4"
                                        >
                                            <span className="font-heading font-bold text-4xl sm:text-5xl uppercase tracking-tight text-white/80 group-hover:text-white transition-colors">
                                                {item.label}
                                            </span>
                                            {/* Simple dot that turns into arrow */}
                                            <span className="h-2 w-2 rounded-full bg-white/30 group-hover:w-6 group-hover:bg-white group-hover:rounded-sm transition-all duration-300" />
                                        </Link>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 3. FOOTER (Simplified) */}
                    <div className="p-6 border-t border-white/10 flex justify-between items-center relative z-20 bg-black">
                        <div className="flex gap-4">
                            <SocialLink Icon={Instagram} />
                            <SocialLink Icon={Facebook} />
                        </div>
                        <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                            Est. 2024
                        </span>
                    </div>

                    {/* 4. WATERMARK (Fixed Size & Centered) */}
                    <div className="absolute bottom-20 left-0 right-0 z-10 pointer-events-none flex justify-center opacity-[0.03]">
                        <span className="font-black uppercase text-[12vw] leading-none whitespace-nowrap">
                            {process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner"}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function SocialLink({ Icon }: { Icon: any }) {
    return (
        <a href="#" className="text-white/50 hover:text-white transition-colors">
            <Icon className="h-5 w-5" />
        </a>
    );
}