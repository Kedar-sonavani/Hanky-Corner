'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImageGallery } from '@/components/ImageGallery';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMasterSwitch } from '@/context/MasterSwitchContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ChevronLeft, Minus, Plus, ShoppingCart, Truck, ShieldCheck, Heart, Share2, Ruler } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton'; // Added Skeleton import

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    discount_price?: number;
    images: string[];
    is_new?: boolean;
    is_featured?: boolean;
    stock: number;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isEcommerceActive, whatsappNumber } = useMasterSwitch();
    const { addItem } = useCart();
    const { showToast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

                // Fetch current product
                const productRes = await fetch(`${apiUrl}/api/products/${params.id}`);
                if (!productRes.ok) {
                    if (productRes.status === 404) {
                        router.push('/404');
                        return;
                    }
                    throw new Error('Failed to fetch product');
                }
                const productData = await productRes.json();
                setProduct(productData);

                // Fetch related products
                const relatedRes = await fetch(`${apiUrl}/api/products/${params.id}/related?limit=4`);
                if (relatedRes.ok) {
                    const relatedData = await relatedRes.json();
                    setRelatedProducts(relatedData);
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProductData();
        }
    }, [params.id, router]);

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: Math.random().toString(36).substr(2, 9),
            product_id: product.id,
            title: product.title,
            price: product.discount_price ?? product.price,
            quantity: quantity,
            image: product.images[0],
            stock: product.stock ?? 0
        });
        showToast(`${product.title} added to bag!`);
    };

    const handleInquire = () => {
        const message = `I am interested in ${product?.title}. Please provide more details.`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const parseDescription = (desc: string) => {
        if (!desc) return [];
        return desc.split('\n').map(line => line.trim().replace(/^[-*•]\s/, '')).filter(line => line.length > 0);
    };

    if (loading) {
        return (
            <div className="container py-24">
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-4">
                        <Skeleton className="aspect-square w-full rounded-3xl" />
                    </div>
                    <div className="lg:col-span-5 space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-20 text-center space-y-4">
                <h1 className="text-3xl font-black">Something went wrong.</h1>
                <p className="text-zinc-500">The product you are looking for might have been moved or sold out.</p>
                <Link href="/">
                    <Button variant="outline" className="font-bold border-2 px-8">Return to Shop</Button>
                </Link>
            </div>
        );
    }

    const descriptionPoints = parseDescription(product.description || '');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container py-12"
        >
            {/* Nav & Breadcrumb */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
                <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="text-zinc-300">/</span>
                    <span className="text-zinc-900">{product.title}</span>
                </nav>
                <Link href="/" className="group flex items-center text-xs font-black uppercase tracking-[0.2em] hover:text-primary transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Gallery
                </Link>
            </div>

            {/* Product Grid - 3 Column Layout */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* 1. Left: Gallery (Sticky) */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 lg:sticky lg:top-24"
                >
                    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.05)]">
                        <ImageGallery images={product.images} productName={product.title} />
                    </div>
                </motion.div>

                {/* 2. Middle: Description (Scrollable) */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="lg:col-span-4 space-y-12 py-4"
                >
                    <div className="space-y-4">
                        <h2 className="text-4xl font-extrabold tracking-tighter">Product Highlights</h2>
                        <p className="text-zinc-500 text-sm font-medium">Bespoke details and artisanal quality.</p>
                    </div>

                    <div className="grid gap-4">
                        {descriptionPoints.map((point, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.05 * index }}
                                className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-primary/20 transition-all group"
                            >
                                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">
                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                </div>
                                <span className="text-zinc-700 text-sm font-bold leading-relaxed">{point}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Story Element for height */}
                    <div className="pt-20 space-y-6">
                        <div className="h-px bg-zinc-100 w-12" />
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-300">The Craft</h4>
                        <p className="text-zinc-400 text-xs italic leading-relaxed">
                            Every Hanky Corner piece undergoes a rigorous quality check to ensure it meets our heritage standards. Designed for the discerning individual.
                        </p>
                    </div>
                </motion.div>

                {/* 3. Right: Purchase Card (Sticky) */}
                <div className="lg:col-span-6 lg:col-start-10 flex justify-end">
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="sticky top-24 space-y-6 w-full max-w-sm"
                    >
                        <Card className="p-7 border-none bg-white rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.06)] relative overflow-hidden group">

                            {/* Decorative Background Element - Scaled down */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] -translate-y-6 translate-x-6 group-hover:scale-110 transition-transform duration-700" />

                            <div className="space-y-4 relative z-10">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-0.5">
                                            {/* Decreased title from text-4xl to text-2xl */}
                                            <h1 className="text-2xl font-black tracking-tight leading-tight">{product.title}</h1>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-primary" />
                                                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-zinc-400">Curated Masterpiece</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-2">
                                    <div className="flex items-baseline gap-3 flex-wrap">
                                        {product.discount_price ? (
                                            <>
                                                <span className="text-3xl font-black tracking-tighter text-zinc-900 italic">
                                                    ₹{product.discount_price}
                                                </span>
                                                <span className="text-sm font-bold text-zinc-400 line-through">
                                                    ₹{product.price}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full">
                                                    {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-3xl font-black tracking-tighter text-zinc-900 italic">
                                                ₹{product.price}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {(product.stock ?? 0) > 0 ? (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                    In Stock ({product.stock})
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                                    Sold Out
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {(product.stock ?? 0) <= 5 && (product.stock ?? 0) > 0 && (
                                        <p className="text-[10px] font-black uppercase tracking-wider text-red-500 mt-2">
                                            Only {product.stock} pieces left
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Reduced margin from my-10 to my-6 */}
                            <div className="h-px bg-zinc-100 my-6" />

                            {isEcommerceActive ? (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Select Quantity</label>
                                            <Button variant="ghost" className="h-auto p-0 text-[9px] font-bold uppercase tracking-widest text-zinc-500 gap-1 hover:text-primary">
                                                <Ruler className="h-3 w-3" /> Size Guide
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {/* Scaled down quantity selector */}
                                            <div className="flex items-center border-2 border-zinc-100 rounded-2xl bg-zinc-50 p-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={decrementQuantity}
                                                    disabled={quantity <= 1 || (product.stock ?? 0) <= 0}
                                                    className="h-10 w-10 hover:bg-white rounded-xl shadow-sm"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-lg font-black w-10 text-center">{quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setQuantity(prev => {
                                                        if (product?.stock && prev >= product.stock) return prev;
                                                        return prev + 1;
                                                    })}
                                                    disabled={(product.stock ?? 0) <= 0 || quantity >= (product.stock ?? 0)}
                                                    className="h-10 w-10 hover:bg-white rounded-xl shadow-sm"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        {/* Decreased button height from h-20 to h-16 */}
                                        <Button
                                            size="lg"
                                            className="w-full h-16 rounded-2xl text-base font-black uppercase tracking-[0.15em] shadow-xl shadow-primary/10 group/add"
                                            onClick={handleAddToCart}
                                            disabled={(product.stock ?? 0) <= 0}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-3 group-hover/add:animate-bounce" />
                                            {(product.stock ?? 0) > 0 ? 'Add to Bag' : 'Out of Stock'}
                                        </Button>

                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Decreased button height from h-14 to h-11 */}
                                            <Button variant="outline" className="h-11 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest gap-2">
                                                <Heart className="h-3.5 w-3.5" /> Save
                                            </Button>
                                            <Button variant="outline" className="h-11 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest gap-2">
                                                <Share2 className="h-3.5 w-3.5" /> Share
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Reduced bottom icons padding */}
                                    <div className="grid grid-cols-3 gap-2 pt-6 border-t border-zinc-100">
                                        <div className="flex flex-col items-center gap-1 text-[8px] font-black uppercase tracking-wider text-zinc-400 text-center">
                                            <Truck className="h-4 w-4 text-primary mb-1" />
                                            Express
                                        </div>
                                        <div className="flex flex-col items-center gap-1 text-[8px] font-black uppercase tracking-wider text-zinc-400 text-center">
                                            <ShieldCheck className="h-4 w-4 text-primary mb-1" />
                                            Verified
                                        </div>
                                        <div className="flex flex-col items-center gap-1 text-[8px] font-black uppercase tracking-wider text-zinc-400 text-center">
                                            <Heart className="h-4 w-4 text-primary mb-1" />
                                            Ethical
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Decreased button height from h-20 to h-16 */}
                                    <Button size="lg" variant="premium" className="w-full h-16 rounded-2xl text-base font-black uppercase tracking-[0.15em]" onClick={handleInquire}>
                                        WhatsApp Us
                                    </Button>
                                    <div className="bg-zinc-50 p-6 rounded-2xl border border-dashed border-zinc-300 space-y-3">
                                        <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Premium Quality Assured
                                        </p>
                                        <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Bespoke tailoring
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 pt-20 border-t"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-12">
                        <div className="space-y-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Discovery</h2>
                            <h3 className="text-4xl font-extrabold tracking-tighter">You May Also Seek</h3>
                        </div>
                        <Link href="/" className="text-xs font-black uppercase tracking-widest border-b-2 border-primary pb-1">View Entire Archive</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((p, idx) => (
                            <ProductCard key={p.id} product={p} index={idx} />
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
