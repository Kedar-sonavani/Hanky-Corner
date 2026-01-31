'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    discount_price?: number;
    images: string[];
    is_new?: boolean;
    is_featured?: boolean;
    category_ids?: string[];
    stock?: number;
    created_at?: string;
}

export default function NewArrivalsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                console.error('Failed to load products:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    // Filter for new arrivals - products from last 30 days or marked as is_new
    const newArrivals = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return products
            .filter(product => {
                if (product.is_new) return true;
                if (product.created_at) {
                    return new Date(product.created_at) > thirtyDaysAgo;
                }
                return false;
            })
            .sort((a, b) => {
                // Sort by created_at if available, newest first
                if (a.created_at && b.created_at) {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
                return 0;
            });
    }, [products]);

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4">

                {/* HEADER */}
                <div className="mb-16 space-y-6">
                    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">New Arrivals</span>
                    </nav>

                    <div className="flex items-center gap-4 pt-4">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                            {newArrivals.length} New {newArrivals.length === 1 ? 'Item' : 'Items'}
                        </span>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-[3/4] rounded-2xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="py-32 text-center space-y-6">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
                            <Sparkles className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-heading text-2xl font-bold uppercase tracking-tight">Unable to Load</h3>
                            <p className="text-muted-foreground">{error}</p>
                        </div>
                        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full">
                            Try Again
                        </Button>
                    </div>
                ) : newArrivals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {newArrivals.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center space-y-6">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 border border-border">
                            <Sparkles className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-heading text-2xl font-bold uppercase tracking-tight">No New Arrivals Yet</h3>
                            <p className="text-muted-foreground">Check back soon for our latest additions.</p>
                        </div>
                        <Link href="/collections">
                            <Button variant="outline" className="rounded-full font-bold uppercase tracking-widest text-xs px-8">
                                Browse All Products
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}