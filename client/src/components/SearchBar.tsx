'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

export function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Close on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [router]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const apiUrl = getApiUrl();
                const res = await fetch(`${apiUrl}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        const filtered = data.filter((p: any) => {
                            const titleMatch = p.title?.toLowerCase().includes(query.toLowerCase());
                            const descMatch = p.description?.toLowerCase().includes(query.toLowerCase());
                            return titleMatch || descMatch;
                        }).slice(0, 6);
                        setResults(filtered);
                    }
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Handle Esc key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <div className="relative flex-1 max-w-[600px] mx-4">
            {/* Search Input Bubble */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for products..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    suppressHydrationWarning
                    className="w-full bg-[#F0F0F0] hover:bg-[#E8E8E8] focus:bg-white focus:ring-2 focus:ring-black/5 transition-all duration-300 rounded-full h-11 pl-11 pr-4 text-sm font-normal text-black outline-none border border-transparent focus:border-black/10"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        <X className="h-3 w-3 text-zinc-500" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            <AnimatePresence>
                {isOpen && query.trim().length >= 2 && (
                    <>
                        {/* Invisible Click-off area */}
                        <div className="fixed inset-0 z-[40]" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-[50]"
                        >
                            <div className="p-2 space-y-1">
                                {loading && (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                                    </div>
                                )}

                                {!loading && results.length === 0 && (
                                    <div className="px-4 py-8 text-center">
                                        <p className="text-zinc-400 text-sm italic">No results found for "{query}"</p>
                                    </div>
                                )}

                                {!loading && results.map((product: any, idx: number) => (
                                    <Link
                                        key={product.id || idx}
                                        href={`/products/${product.id}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors group"
                                    >
                                        <div className="h-12 w-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-400 font-bold uppercase">No image</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="font-bold text-xs text-black truncate">{product.title}</p>
                                            <div className="flex items-center justify-between mt-0.5">
                                                <span className="text-[10px] font-medium text-zinc-500">₹{product.price}</span>
                                                <ArrowRight className="h-3 w-3 text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {results.length > 0 && (
                                    <div className="border-t border-zinc-100 mt-2 pt-2 px-3 pb-2">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            Found {results.length} matched items
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}