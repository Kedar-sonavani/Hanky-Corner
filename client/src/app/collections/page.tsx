'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts, getApiUrl } from '@/lib/api';
import { PriceFilter } from '@/components/PriceFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { SlidersHorizontal, ChevronDown, LayoutGrid, List, X, Package, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

export default function CollectionsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // NEW: Availability State
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFloatingFilter, setShowFloatingFilter] = useState(false);

    const apiUrl = getApiUrl();

    useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true);
                const [pData, cRes] = await Promise.all([
                    fetchProducts(),
                    fetch(`${apiUrl}/api/categories`)
                ]);
                setProducts(pData);
                if (cRes.ok) setCategories(await cRes.json());
            } catch (err) {
                console.error('Failed to load data:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, [apiUrl]);

    // Show floating filter button on scroll
    useEffect(() => {
        const handleScroll = () => setShowFloatingFilter(window.scrollY > 200);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCategoryChange = (catId: string) => {
        setSelectedCategories(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    // NEW: Handle Availability Change
    const handleAvailabilityChange = (id: string) => {
        setSelectedAvailability(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const removeCategory = (catId: string) => {
        setSelectedCategories(prev => prev.filter(id => id !== catId));
    };

    // NEW: Remove Availability Filter
    const removeAvailability = (id: string) => {
        setSelectedAvailability(prev => prev.filter(item => item !== id));
    };

    const resetPrice = () => {
        setPriceRange([0, 10000]);
    };

    // NEW: Dynamic Counts
    const availabilityCounts = useMemo(() => {
        return {
            inStock: products.filter(p => (p.stock ?? 0) > 0).length,
            outOfStock: products.filter(p => (p.stock ?? 0) <= 0).length
        };
    }, [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = products.filter(product => {
            // Price Filter
            const effectivePrice = product.discount_price ?? product.price;
            const matchesPrice = effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];

            // Category Filter
            const matchesCategory = selectedCategories.length === 0 ||
                (product.category_ids && product.category_ids.some(id => selectedCategories.includes(id)));

            // NEW: Availability Filter
            const isItemInStock = (product.stock ?? 0) > 0;
            const matchesAvailability = selectedAvailability.length === 0 ||
                (selectedAvailability.includes('in-stock') && isItemInStock) ||
                (selectedAvailability.includes('out-of-stock') && !isItemInStock);

            return matchesPrice && matchesCategory && matchesAvailability;
        });

        const sorted = [...result];
        switch (sortBy) {
            case 'price-asc': sorted.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price)); break;
            case 'price-desc': sorted.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price)); break;
            case 'name-asc': sorted.sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'newest': default: break;
        }
        return sorted;
    }, [products, priceRange, selectedCategories, selectedAvailability, sortBy]);

    const hasActiveFilters = selectedCategories.length > 0 || selectedAvailability.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000;

    return (
        <main className="min-h-screen bg-background pt-24 pb-20 relative">
            <div className="container mx-auto px-4">

                {/* Breadcrumbs */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">Collections</span>
                    </nav>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* SIDEBAR FILTERS (Desktop) */}
                    <aside className="hidden lg:block w-64 shrink-0 space-y-10 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
                        <PriceFilter
                            priceRange={priceRange}
                            onPriceChange={setPriceRange}
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange}
                            // NEW PROPS PASSED
                            selectedAvailability={selectedAvailability}
                            onAvailabilityChange={handleAvailabilityChange}
                            availabilityCounts={availabilityCounts}
                        />
                    </aside>

                    {/* MAIN CONTENT */}
                    <div className="flex-1">

                        {/* TOOLBAR */}
                        <div className="mb-8 pb-6 border-b border-border">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="lg:hidden rounded-full font-bold uppercase tracking-widest text-[10px] h-9"
                                        onClick={() => setIsSidebarOpen(true)}
                                    >
                                        <SlidersHorizontal className="h-3 w-3 mr-2" />
                                        Filters {(selectedCategories.length > 0 || selectedAvailability.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />}
                                    </Button>
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        {filteredAndSortedProducts.length} Results
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Sort Dropdown */}
                                    <div className="relative group">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="appearance-none bg-transparent pr-7 pl-0 border-0 font-bold uppercase tracking-widest text-xs focus:ring-0 cursor-pointer text-right"
                                        >
                                            <option value="newest">Newest</option>
                                            <option value="price-asc">Price: Low</option>
                                            <option value="price-desc">Price: High</option>
                                            <option value="name-asc">Name</option>
                                        </select>
                                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-muted-foreground" />
                                    </div>

                                    {/* View Toggle */}
                                    <div className="hidden sm:flex items-center bg-secondary/30 p-1 rounded-lg border border-border/50">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                                        >
                                            <LayoutGrid className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                                        >
                                            <List className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ACTIVE FILTERS CHIPS */}
                            <AnimatePresence>
                                {hasActiveFilters && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="flex flex-wrap items-center gap-2 mt-4 overflow-hidden"
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">Active:</span>

                                        {/* Category Chips */}
                                        {selectedCategories.map(catId => {
                                            const catName = categories.find(c => c.id === catId)?.name;
                                            return (
                                                <motion.button
                                                    key={catId}
                                                    layout
                                                    onClick={() => removeCategory(catId)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 border border-border text-[10px] font-bold uppercase tracking-wider hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors group"
                                                >
                                                    {catName}
                                                    <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                </motion.button>
                                            );
                                        })}

                                        {/* Availability Chips */}
                                        {selectedAvailability.map(id => (
                                            <motion.button
                                                key={id}
                                                layout
                                                onClick={() => removeAvailability(id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 border border-border text-[10px] font-bold uppercase tracking-wider hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors group"
                                            >
                                                {id === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                                                <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                            </motion.button>
                                        ))}

                                        {/* Price Chip */}
                                        {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                                            <motion.button
                                                layout
                                                onClick={resetPrice}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 border border-border text-[10px] font-bold uppercase tracking-wider hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors group"
                                            >
                                                Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                                                <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                            </motion.button>
                                        )}

                                        {/* Clear All */}
                                        <button
                                            onClick={() => { setSelectedCategories([]); setSelectedAvailability([]); setPriceRange([0, 10000]); }}
                                            className="text-[10px] font-bold uppercase tracking-wider text-primary underline decoration-dotted underline-offset-4 ml-2 hover:text-primary/80"
                                        >
                                            Clear All
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* PRODUCT GRID */}
                        <div className="min-h-[50vh]">
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                                    {[...Array(6)].map((_, i) => (
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
                                <div className="py-40 text-center space-y-6">
                                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
                                        <Package className="h-8 w-8 text-destructive" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-heading text-2xl font-bold uppercase tracking-tight">Unable to Load</h3>
                                        <p className="text-muted-foreground">{error}</p>
                                    </div>
                                    <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full">
                                        Try Again
                                    </Button>
                                </div>
                            ) : filteredAndSortedProducts.length > 0 ? (
                                <motion.div
                                    layout
                                    className={cn(
                                        "grid gap-x-8 gap-y-12",
                                        viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                                    )}
                                >
                                    <AnimatePresence>
                                        {filteredAndSortedProducts.map((product, idx) => (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ProductCard product={product} index={idx} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <div className="py-40 text-center space-y-6">
                                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 border border-border">
                                        <SlidersHorizontal className="h-8 w-8 text-muted-foreground/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-heading text-2xl font-bold uppercase tracking-tight">No Products Found</h3>
                                        <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="rounded-full font-bold uppercase tracking-widest text-xs px-8"
                                        onClick={() => { setPriceRange([0, 10000]); setSelectedCategories([]); setSelectedAvailability([]); }}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* FLOATING MOBILE FILTER BUTTON */}
            <AnimatePresence>
                {showFloatingFilter && (
                    <motion.button
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-40 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
                    >
                        <Filter className="h-3.5 w-3.5" />
                        Filters
                        {(selectedCategories.length > 0 || selectedAvailability.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
                            <span className="bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center text-[9px] ml-1">
                                {selectedCategories.length + selectedAvailability.length + (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0)}
                            </span>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* MOBILE FILTER SIDEBAR DRAWER */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-background p-8 z-[70] lg:hidden overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="font-heading text-2xl font-black uppercase tracking-tighter">Filters</h2>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/20 text-foreground hover:bg-secondary transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <PriceFilter
                                priceRange={priceRange}
                                onPriceChange={setPriceRange}
                                categories={categories}
                                selectedCategories={selectedCategories}
                                onCategoryChange={handleCategoryChange}
                                // NEW PROPS PASSED TO MOBILE FILTER TOO
                                selectedAvailability={selectedAvailability}
                                onAvailabilityChange={handleAvailabilityChange}
                                availabilityCounts={availabilityCounts}
                            />
                            <div className="mt-12 sticky bottom-0 bg-background pt-4 pb-8 border-t border-border">
                                <Button
                                    className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    View {filteredAndSortedProducts.length} Items
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}