'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts, getApiUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { HeroSection } from '@/components/HeroSection';
import { StorySection } from '@/components/StorySection';
import { ShoppingBag } from 'lucide-react';

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
    <main className="flex flex-col min-h-screen">
      <HeroSection />


      <div id="collection" className="container py-16 scroll-mt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-4 text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase">
            Curated Collection
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
            Explore our exclusive selection of premium items, handcrafted for elegance.
          </p>
        </motion.div>

        {/* Product Grid Section */}
        <div className="bg-white">
          {loading ? (
            <div className="container py-16">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-[20px]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* NEW ARRIVALS SECTION */}
              <section className="container py-16 border-b border-gray-100">
                <div className="mb-12 text-center">
                  <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight mb-2 text-black">
                    New Arrivals
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredProducts.slice(0, 4).map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <button className="px-14 py-4 border border-gray-200 rounded-full text-black font-medium transition-all hover:bg-gray-100 active:scale-95 text-sm sm:text-base">
                    View All
                  </button>
                </div>
              </section>

              {/* TOP SELLING SECTION */}
              <section className="container py-16">
                <div className="mb-12 text-center">
                  <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight mb-2 text-black">
                    Top Selling
                  </h2>
                </div>

                {/* Mocking 'Top Selling' by reversing or slicing differently for demo */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredProducts.length > 4
                    ? filteredProducts.slice(4, 8).map((product, index) => (
                      <ProductCard key={`top-${product.id}`} product={product} index={index} />
                    ))
                    : filteredProducts.slice(0, 4).map((product, index) => (
                      <ProductCard key={`top-${product.id}`} product={product} index={index} />
                    ))
                  }
                </div>

                <div className="mt-12 flex justify-center">
                  <button className="px-14 py-4 border border-gray-200 rounded-full text-black font-medium transition-all hover:bg-gray-100 active:scale-95 text-sm sm:text-base">
                    View All
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
