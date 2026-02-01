'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-foreground text-background pt-24 pb-12 mt-auto overflow-hidden relative">
            <div className="container relative z-10">

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">

                    {/* 1. BRAND SECTION */}
                    <div className="lg:col-span-5 flex flex-col items-start">
                        <Link href="/" className="inline-block mb-6">
                            <span className="font-heading font-bold tracking-tighter text-3xl md:text-4xl uppercase">
                                {(process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner").split(' ')[0]} <span className="italic font-serif text-accent">{(process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner").split(' ').slice(1).join(' ')}</span>
                            </span>
                        </Link>
                        <p className="text-background/60 max-w-sm text-lg leading-relaxed font-light mb-8">
                            Timeless essentials for the modern wardrobe. <br />
                            Designed in New York, worn everywhere.
                        </p>

                        <div className="flex gap-4">
                            <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
                            <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} />
                            <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
                        </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-1" />

                    {/* 2. LINKS SECTION */}
                    <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            <h4 className="font-mono text-xs uppercase tracking-widest text-background/40">Shop</h4>
                            <ul className="space-y-4">
                                <FooterLink href="/collections">New Arrivals</FooterLink>
                                <FooterLink href="/collections">Best Sellers</FooterLink>
                                <FooterLink href="/collections">Accessories</FooterLink>
                                <FooterLink href="/collections">Gift Cards</FooterLink>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-mono text-xs uppercase tracking-widest text-background/40">Support</h4>
                            <ul className="space-y-4">
                                <FooterLink href="/shipping">Shipping</FooterLink>
                                <FooterLink href="/returns">Returns</FooterLink>
                                <FooterLink href="/size-guide">Size Guide</FooterLink>
                                <FooterLink href="/contact">Contact Us</FooterLink>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-mono text-xs uppercase tracking-widest text-background/40">Legal</h4>
                            <ul className="space-y-4">
                                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                                <FooterLink href="/terms">Terms of Use</FooterLink>
                                <FooterLink href="/cookies">Cookies</FooterLink>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 3. BOTTOM BAR */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center text-xs text-background/30 font-mono uppercase tracking-widest border-t border-background/10 pt-8">
                    <p>© {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner"} Inc.</p>
                    <p>Crafted with Soul</p>
                </div>
            </div>

            {/* 4. BACKGROUND WATERMARK - ADJUSTED */}
            {/* - flex justify-center: Centers the text horizontally
                - bottom-10: Moves it up slightly so descenders (like 'y') aren't cut off
                - text-[12vw]: Reduced size so it fits better
            */}
            <div className="pointer-events-none select-none absolute bottom-6 left-0 right-0 flex justify-center w-full z-0 overflow-hidden">
                <span className="font-black uppercase text-[12vw] leading-none text-background/[0.03] tracking-tight whitespace-nowrap">
                    {process.env.NEXT_PUBLIC_SITE_NAME || "Hanky Corner"}
                </span>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="h-10 w-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground hover:scale-110 transition-all duration-300"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="text-background/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
            >
                <span className="h-[1px] w-0 bg-accent group-hover:w-3 transition-all duration-300" />
                {children}
            </Link>
        </li>
    );
}