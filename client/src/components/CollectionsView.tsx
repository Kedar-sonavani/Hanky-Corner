'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts, getApiUrl } from '@/lib/api';
import { PriceFilter } from '@/components/PriceFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { SlidersHorizontal, ChevronDown, LayoutGrid, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';
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
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

interface CollectionsViewProps {
    title?: string;
    description?: string;
    initialSort?: SortOption;
    initialCategorySlug?: string;
    showFilters?: boolean;
}

export function CollectionsView({
    title = "The Archive",
    description = "Explore our curated selection of premium handcrafted linens, designed for those who appreciate the finer details.",
    initialSort = 'newest',
    initialCategorySlug,
    showFilters = true
}: CollectionsViewProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>(initialSort);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const apiUrl = getApiUrl();

    useEffect(() => {
        const initData = async () => {
            try {
                const [pData, cRes] = await Promise.all([
                    fetchProducts(),
                    fetch(`${apiUrl}/api/categories`)
                ]);

                setProducts(pData);

                if (cRes.ok) {
                    const fetchedCategories = await cRes.json();
                    setCategories(fetchedCategories);

                    // If we have an initial category slug, find its ID and select it
                    if (initialCategorySlug) {
                        const targetCat = fetchedCategories.find((c: Category) => c.slug === initialCategorySlug);
                        if (targetCat) {
                            setSelectedCategories([targetCat.id]);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, [apiUrl, initialCategorySlug]);

    const handleCategoryChange = (catId: string) => {
        setSelectedCategories(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const handleAvailabilityChange = (id: string) => {
        setSelectedAvailability(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const availabilityCounts = useMemo(() => {
        return {
            inStock: products.filter(p => (p.stock ?? 0) > 0).length,
            outOfStock: products.filter(p => (p.stock ?? 0) <= 0).length
        };
    }, [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = products.filter(product => {
            const effectivePrice = product.discount_price ?? product.price;
            const matchesPrice = effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
            const matchesCategory = selectedCategories.length === 0 ||
                (product.category_ids && product.category_ids.some(id => selectedCategories.includes(id)));

            const matchesAvailability = selectedAvailability.length === 0 ||
                (selectedAvailability.includes('in-stock') && (product.stock ?? 0) > 0) ||
                (selectedAvailability.includes('out-of-stock') && (product.stock ?? 0) <= 0);

            return matchesPrice && matchesCategory && matchesAvailability;
        });

        const sorted = [...result];
        switch (sortBy) {
            case 'price-asc':
                sorted.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
                break;
            case 'price-desc':
                sorted.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'newest':
            default:
                // Assuming newer products have higher IDs or we can add a created_at check if available
                // for now we trust the default API order or manually reverse if needed.
                break;
        }

        return sorted;
    }, [products, priceRange, selectedCategories, selectedAvailability, sortBy]);

    return (
        <section className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4">

                {/* PAGE HEADER */}
                <div className="mb-12 space-y-4">
                    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        <a href="/" className="hover:text-foreground transition-colors">Home</a>
                        <span>/</span>
                        <span className="text-foreground">{title}</span>
                    </nav>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground"
                    >
                        {title}
                    </motion.h1>
                    <p className="max-w-2xl text-muted-foreground text-lg font-sans leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* SIDEBAR FILTERS (Desktop) */}
                    {showFilters && (
                        <aside className="hidden lg:block w-64 shrink-0 space-y-10">
                            <PriceFilter
                                priceRange={priceRange}
                                onPriceChange={setPriceRange}
                                categories={categories}
                                selectedCategories={selectedCategories}
                                onCategoryChange={handleCategoryChange}
                                selectedAvailability={selectedAvailability}
                                onAvailabilityChange={handleAvailabilityChange}
                                availabilityCounts={availabilityCounts}
                            />
                        </aside>
                    )}

                    {/* MAIN CONTENT Area */}
                    <div className="flex-1">

                        {/* TOOLBAR */}
                        <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-6 border-b border-border">
                            <div className="flex items-center gap-4">
                                {showFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="lg:hidden rounded-full font-bold uppercase tracking-widest text-[10px]"
                                        onClick={() => setIsSidebarOpen(true)}
                                    >
                                        <SlidersHorizontal className="h-3 w-3 mr-2" />
                                        Filters
                                    </Button>
                                )}
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    {filteredAndSortedProducts.length} Results
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Sorting */}
                                <div className="flex items-center gap-3">
                                    <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Sort By</span>
                                    <div className="relative group">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="appearance-none bg-transparent pr-8 pl-0 border-0 font-bold uppercase tracking-widest text-xs focus:ring-0 cursor-pointer"
                                        >
                                            <option value="newest">Latest Releases</option>
                                            <option value="price-asc">Price: Low to High</option>
                                            <option value="price-desc">Price: High to Low</option>
                                            <option value="name-asc">Alphabetical</option>
                                        </select>
                                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center bg-secondary/20 p-1 rounded-lg border border-border">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* PRODUCT GRID / LIST */}
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
                        ) : filteredAndSortedProducts.length > 0 ? (
                            <div className={cn(
                                "grid gap-x-8 gap-y-12",
                                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                            )}>
                                {filteredAndSortedProducts.map((product, idx) => (
                                    <ProductCard key={product.id} product={product} index={idx} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-40 text-center space-y-6">
                                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 border border-border">
                                    <SlidersHorizontal className="h-8 w-8 text-muted-foreground/30" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading text-2xl font-bold uppercase tracking-tight">No Archive Found</h3>
                                    <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="rounded-full font-bold uppercase tracking-widest text-xs px-8"
                                    onClick={() => {
                                        setPriceRange([0, 10000]);
                                        setSelectedCategories([]);
                                        setSelectedAvailability([]);
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE FILTER SIDEBAR */}
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
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/20 text-foreground"
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
                                selectedAvailability={selectedAvailability}
                                onAvailabilityChange={handleAvailabilityChange}
                                availabilityCounts={availabilityCounts}
                            />
                            <div className="mt-12">
                                <Button
                                    className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
