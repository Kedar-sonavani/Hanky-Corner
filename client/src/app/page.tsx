'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { PriceFilter } from '@/components/PriceFilter';
import { fetchProducts } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, X, ShoppingBag } from 'lucide-react';

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
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const initData = async () => {
      try {
        const [pData, cRes] = await Promise.all([
          fetchProducts(),
          fetch(`${apiUrl}/api/categories`)
        ]);
        setProducts(pData);
        if (cRes.ok) {
          setCategories(await cRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Price Slider Filter
      const effectivePrice = product.discount_price ?? product.price;
      const matchesPrice = effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];

      // Category Filter
      const matchesCategory = selectedCategories.length === 0 ||
        (product.category_ids && product.category_ids.some(id => selectedCategories.includes(id)));

      return matchesPrice && matchesCategory;
    });
  }, [products, priceRange, selectedCategories]);

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 space-y-4 text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
          Curated Collection
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
          Explore our exclusive selection of premium items, handcrafted for elegance.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Combined Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <PriceFilter
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </aside>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-end mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-6 py-3 rounded-full font-bold shadow-sm"
          >
            <Filter className="h-4 w-4" />
            Filters {(selectedCategories.length) > 0 && `(${selectedCategories.length})`}
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-950 p-8 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold">Filters</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-12">
                <PriceFilter
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                />
                <Button
                  className="w-full py-6"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Show {filteredProducts.length} Results
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] rounded-[2rem]" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Showing {filteredProducts.length} premium pieces</span>
                {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000) && (
                  <button
                    onClick={() => { setPriceRange([0, 2000]); setSelectedCategories([]); }}
                    className="text-primary hover:underline font-bold"
                  >
                    Reset all filters
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                  <div className="bg-zinc-100 p-8 rounded-full">
                    <ShoppingBag className="h-10 w-10 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-bold">No products found</h3>
                  <p className="text-zinc-500">Try adjusting your filters to find what you're looking for.</p>
                  <Button
                    variant="outline"
                    onClick={() => { setPriceRange([0, 2000]); setSelectedCategories([]); }}
                    className="font-bold"
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
