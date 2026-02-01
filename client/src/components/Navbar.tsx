'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMasterSwitch } from '@/context/MasterSwitchContext';
import { useCart } from '@/context/CartContext';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useTransform } from 'framer-motion';
import { useState } from 'react';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';
import { UserProfile } from './UserProfile';
import { Input } from '@/components/ui/input';

export function Navbar() {
    const { isEcommerceActive, whatsappNumber, isLoading } = useMasterSwitch();
    const { cartCount } = useCart();

    // State
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { scrollY } = useScroll();

    // Handle Scroll State
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const handleInquiry = () => {
        const message = "Hi! I'm interested in the hanky collection.";
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // UPDATED: Scroll transitions to BLACK (Dark Mode)
    const backgroundColor = useTransform(
        scrollY,
        [0, 50],
        ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)'] // Transparent -> Black/80
    );
    const borderBottom = useTransform(
        scrollY,
        [0, 50],
        ['1px solid rgba(255, 255, 255, 0)', '1px solid rgba(255, 255, 255, 0.1)'] // Transparent -> Faint White
    );

    return (
        <>
            <motion.header
                style={{ backgroundColor, borderBottom, backdropFilter: 'blur(12px)' }}
                className="sticky top-0 z-[50] w-full transition-all duration-300"
            >
                <div className="container flex items-center justify-between h-14">

                    {/* 1. LEFT: LOGO */}
                    <div className="flex-shrink-0 z-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className={cn(
                                "font-heading font-extrabold tracking-tighter text-2xl md:text-3xl uppercase transition-colors duration-300",
                                isScrolled ? "text-white" : "text-black"
                            )}>
                                {(process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner").split(' ')[0]}{' '}
                                <span className={cn(
                                    "italic font-serif transition-colors duration-300",
                                    isScrolled ? "text-white/80" : "text-black/80"
                                )}>
                                    {(process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner").split(' ').slice(1).join(' ')}
                                </span>
                            </span>
                        </Link>
                    </div>

                    {/* 2. CENTER: NAVIGATION */}
                    <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        {['New Arrivals', 'Collections'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase().replace(' ', '-')}`}
                                // UPDATED: Always White/70 -> White
                                className={cn(
                                    "relative text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 py-1 group",
                                    isScrolled ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black"
                                )}
                            >
                                {item}
                                {/* UPDATED: Underline */}
                                <span className={cn(
                                    "absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full",
                                    isScrolled ? "bg-white" : "bg-black"
                                )} />
                            </Link>
                        ))}
                    </nav>

                    {/* 3. RIGHT: TOOLS & ACTIONS */}
                    <div className="flex items-center gap-1 md:gap-4 z-20">

                        {/* Expandable Search Bar */}
                        <div className="flex items-center">
                            <AnimatePresence mode="wait">
                                {isSearchOpen ? (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 200, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="hidden md:flex items-center overflow-hidden mr-2"
                                    >
                                        <Input
                                            placeholder="Search..."
                                            // Dynamic Input Styles
                                            className={cn(
                                                "h-8 text-xs bg-transparent border-0 border-b rounded-none focus-visible:ring-0 px-0 placeholder:opacity-50 transition-colors",
                                                isScrolled
                                                    ? "text-white border-white/30 focus-visible:border-white placeholder:text-white/50"
                                                    : "text-black border-black/20 focus-visible:border-black placeholder:text-black/40"
                                            )}
                                            autoFocus
                                            onBlur={() => !isSearchOpen && setIsSearchOpen(false)}
                                        />
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                // UPDATED: Always White
                                className={cn(
                                    "rounded-full transition-colors duration-300",
                                    isScrolled
                                        ? "hover:bg-white/10 text-white"
                                        : "hover:bg-black/5 text-black"
                                )}
                            >
                                {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>

                        {/* User Profile */}
                        <div className={cn("hidden sm:block transition-colors duration-300", isScrolled ? "text-white" : "text-black")}>
                            <UserProfile />
                        </div>

                        {/* Cart Button */}
                        {!isLoading && isEcommerceActive && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCartOpen(true)}
                                // UPDATED: Always White
                                className={cn(
                                    "relative rounded-full transition-colors duration-300",
                                    isScrolled
                                        ? "hover:bg-white/10 text-white"
                                        : "hover:bg-black/5 text-black"
                                )}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            // UPDATED: Badge
                                            className={cn(
                                                "absolute -top-1 -right-1 text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm transition-colors",
                                                isScrolled ? "bg-white text-black" : "bg-black text-white"
                                            )}
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Button>
                        )}

                        {/* Inquire Button */}
                        {!isLoading && !isEcommerceActive && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleInquiry}
                                // UPDATED: White Button
                                className="hidden md:flex font-bold uppercase tracking-widest text-[10px] rounded-full px-6 bg-white text-black hover:bg-white/90"
                            >
                                Inquire
                            </Button>
                        )}

                        {/* Mobile Menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "lg:hidden rounded-full transition-colors duration-300",
                                isScrolled ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-black"
                            )}
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </motion.header>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </>
    );
}