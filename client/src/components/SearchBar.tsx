'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

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
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await fetch(`${apiUrl}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    // Basic client-side filtering
                    const filtered = data.filter((p: any) =>
                        p.title.toLowerCase().includes(query.toLowerCase()) ||
                        p.description?.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 6);
                    setResults(filtered);
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
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors group"
                aria-label="Search"
            >
                <Search className="h-5 w-5 text-zinc-600 group-hover:scale-110 transition-transform" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />

                        {/* Search Panel */}
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-full bg-white z-[101] shadow-2xl overflow-hidden"
                        >
                            <div className="container max-w-4xl mx-auto">
                                <div className="h-24 flex items-center gap-6">
                                    <Search className="h-6 w-6 text-zinc-400 shrink-0" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search for pure silk, floral patterns, or collections..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-xl font-light tracking-tight text-zinc-900 placeholder:text-zinc-300"
                                    />
                                    <div className="flex items-center gap-2">
                                        {loading && <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />}
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Results Area */}
                                <AnimatePresence>
                                    {query.trim().length >= 2 && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-zinc-100 overflow-hidden"
                                        >
                                            <div className="py-8 space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                                        {results.length > 0 ? `found ${results.length} results` : 'no results found'}
                                                    </h3>
                                                </div>

                                                <div className="grid sm:grid-cols-2 gap-4 pb-12">
                                                    {results.map((product: any) => (
                                                        <Link
                                                            key={product.id}
                                                            href={`/products/${product.id}`}
                                                            onClick={() => setIsOpen(false)}
                                                            className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-zinc-50 transition-all group"
                                                        >
                                                            <div className="h-20 w-16 rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 shrink-0">
                                                                <img
                                                                    src={product.images[0]}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-zinc-900 line-clamp-1">{product.title}</p>
                                                                <p className="text-xs text-zinc-500 font-medium mb-1 line-clamp-1">{product.description}</p>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-light tracking-tight text-zinc-900">₹{product.price}</span>
                                                                    <ArrowRight className="h-3 w-3 text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
