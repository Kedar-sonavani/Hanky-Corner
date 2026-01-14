'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMasterSwitch } from '@/context/MasterSwitchContext';
import { useCart } from '@/context/CartContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import CartDrawer from './CartDrawer';
import { SearchBar } from './SearchBar';
import { cn } from '@/lib/utils';

export function Navbar() {
    const { isEcommerceActive, whatsappNumber, isLoading } = useMasterSwitch();
    const { cartCount } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { scrollY } = useScroll();

    const handleInquiry = () => {
        const message = "Hi! I'm interested in the hanky collection. Can you help me?";
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Smooth transition from transparent to glassmorphism on scroll
    const backgroundColor = useTransform(
        scrollY,
        [0, 50],
        ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)']
    );
    const borderBottom = useTransform(
        scrollY,
        [0, 50],
        ['1px solid rgba(0, 0, 0, 0)', '1px solid rgba(0, 0, 0, 0.1)']
    );

    return (
        <>
            <motion.header
                style={{ backgroundColor, borderBottom, backdropFilter: 'blur(12px)' }}
                className="sticky top-0 z-[50] w-full transition-all duration-300"
            >
                <div className="container flex h-20 items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <span className="font-extrabold tracking-tighter text-2xl uppercase italic">
                                Hanky <span className="text-primary not-italic">Corner</span>
                            </span>
                        </Link>

                        <nav className="hidden lg:flex items-center space-x-8">
                            {['Products', 'Collections', 'About'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Products' ? '/' : `/${item.toLowerCase()}`}
                                    className="relative text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors py-2 group"
                                >
                                    {item}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Action Icons */}
                        <div className="flex items-center bg-zinc-100/50 rounded-full p-1 border border-zinc-200/50 backdrop-blur-md">
                            <SearchBar />

                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hidden sm:flex">
                                <User className="h-5 w-5 text-zinc-600" />
                            </Button>

                            {!isLoading && isEcommerceActive && (
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsCartOpen(true)}
                                        className="h-10 w-10 rounded-full relative group"
                                    >
                                        <ShoppingCart className="h-5 w-5 text-zinc-600 group-hover:scale-110 transition-transform" />
                                        {cartCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white"
                                            >
                                                {cartCount}
                                            </motion.span>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {!isLoading && !isEcommerceActive && (
                            <Button
                                variant="premium"
                                onClick={handleInquiry}
                                className="font-bold px-8 rounded-full shadow-lg shadow-black/5"
                            >
                                Inquire Now
                            </Button>
                        )}

                        <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </motion.header>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
