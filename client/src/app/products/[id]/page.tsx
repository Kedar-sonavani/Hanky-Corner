'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImageGallery } from '@/components/ImageGallery';
import { ProductCard } from '@/components/ProductCard';
import { getApiUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMasterSwitch } from '@/context/MasterSwitchContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ChevronLeft, Minus, Plus, ShoppingCart, Truck, ShieldCheck, Heart, Share2, Ruler, Lock, Star, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// --- Types ---
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
    material?: string;
    care_instructions?: string;
    origin?: string;
    manufacturer?: string;
    weight?: string;
}

// --- Sub-Component: Animated Accordion Item ---
function AccordionItem({ title, children, isOpen, onClick }: { title: string, children: React.ReactNode, isOpen: boolean, onClick: () => void }) {
    return (
        <div className="border-b border-border">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center py-4 text-left group"
            >
                <span className="font-heading font-bold text-sm uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                    {title}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-300",
                        isOpen ? "rotate-180" : "rotate-0"
                    )}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-sm text-muted-foreground leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Sub-Component: Size Guide Modal ---
function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-background rounded-2xl shadow-2xl z-[101] overflow-hidden"
                    >
                        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/10">
                            <h3 className="font-heading font-bold text-lg uppercase tracking-wider">Size Guide</h3>
                            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs font-bold uppercase text-muted-foreground bg-secondary/20">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Size</th>
                                        <th className="px-4 py-3">Length (cm)</th>
                                        <th className="px-4 py-3 rounded-r-lg">Width (cm)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr><td className="px-4 py-3 font-medium">Standard</td><td className="px-4 py-3">40</td><td className="px-4 py-3">40</td></tr>
                                    <tr><td className="px-4 py-3 font-medium">Large</td><td className="px-4 py-3">45</td><td className="px-4 py-3">45</td></tr>
                                </tbody>
                            </table>
                            <p className="mt-4 text-xs text-muted-foreground">
                                * All measurements are in centimeters. Allow for a 0.5cm variance due to the handmade nature of the product.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isEcommerceActive, whatsappNumber } = useMasterSwitch();
    const { addItem, cartItems, updateQuantity } = useCart();
    const { showToast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    // UI States
    const [showMobileBar, setShowMobileBar] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>("description"); // Default open
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const apiUrl = getApiUrl();
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

        if (params.id) fetchProductData();
    }, [params.id, router]);

    useEffect(() => {
        const handleScroll = () => setShowMobileBar(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    const handleAddToCart = () => {
        if (!product) return;
        const existingItem = cartItems.find(item => item.product_id === product.id);

        if (existingItem) {
            if ((product.stock ?? 0) > 0 && (existingItem.quantity + quantity) <= product.stock) {
                updateQuantity(existingItem.id, existingItem.quantity + quantity);
                showToast(`Updated ${product.title} quantity in bag!`);
            } else {
                showToast(`Cannot add more. Max stock reached.`, 'error');
            }
        } else {
            const result = addItem({
                id: Math.random().toString(36).substr(2, 9),
                product_id: product.id,
                title: product.title,
                price: product.discount_price ?? product.price,
                quantity: quantity,
                image: product.images[0],
                stock: product.stock ?? 0
            });
            if (result.success) showToast(`${product.title} added to bag!`);
            else showToast(result.message || 'Error adding to cart', 'error');
        }
    };

    const handleInquire = () => {
        const message = `I am interested in ${product?.title}.`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const parseDescription = (desc: string) => {
        if (!desc) return [];
        return desc.split('\n').map(line => line.trim().replace(/^[-*•]\s/, '')).filter(line => line.length > 0);
    };

    const toggleAccordion = (key: string) => {
        setOpenAccordion(openAccordion === key ? null : key);
    };

    if (loading) return (
        <div className="container py-24">
            <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-4"><Skeleton className="aspect-[4/5] w-full rounded-[2.5rem]" /></div>
                <div className="lg:col-span-5 space-y-8"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-32 w-full" /></div>
            </div>
        </div>
    );

    if (!product) return null;

    const descriptionPoints = parseDescription(product.description || '');
    const isOutOfStock = (product.stock ?? 0) <= 0;
    const isLowStock = (product.stock ?? 0) <= 5 && !isOutOfStock;
    const currentPrice = product.discount_price ?? product.price;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-12 relative">
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

            {/* Breadcrumb */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <nav className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span className="text-muted-foreground/30">/</span>
                    <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
                </nav>
                <Link href="/" className="group flex items-center text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] hover:text-primary transition-colors">
                    <ChevronLeft className="h-3 w-3 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Gallery
                </Link>
            </div>

            {/* Main Layout */}
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-24 lg:pb-0">

                {/* 1. Gallery */}
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-5 lg:sticky lg:top-28">
                    <div className="bg-card rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 border border-border/50">
                        <ImageGallery images={product.images} productName={product.title} />
                    </div>
                </motion.div>

                {/* 2. Details (Accordions) */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="lg:col-span-3 space-y-8 py-2">

                    {/* Title Block for Mobile (Hidden on Desktop usually, but good to keep structure consistent) */}
                    <div className="lg:hidden space-y-2">
                        <h1 className="font-heading text-3xl font-black tracking-tight text-foreground">{product.title}</h1>
                        <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold">
                            <div className="flex"><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current" /><Star className="h-3 w-3 fill-current opacity-50" /></div>
                            <span className="text-muted-foreground">(4.8 Reviews)</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">₹{currentPrice}</p>
                    </div>

                    <div className="space-y-1">
                        <AccordionItem
                            title="Description & Craftsmanship"
                            isOpen={openAccordion === 'description'}
                            onClick={() => toggleAccordion('description')}
                        >
                            <ul className="space-y-3 mt-2">
                                {descriptionPoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                                {descriptionPoints.length === 0 && <li className="italic">Premium handcrafted quality.</li>}
                            </ul>
                        </AccordionItem>

                        <AccordionItem
                            title="Material & Specifications"
                            isOpen={openAccordion === 'specs'}
                            onClick={() => toggleAccordion('specs')}
                        >
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div><span className="block font-bold text-foreground text-xs uppercase">Material</span> {product.material || '100% Cotton'}</div>
                                <div><span className="block font-bold text-foreground text-xs uppercase">Origin</span> {product.origin || 'India'}</div>
                                <div><span className="block font-bold text-foreground text-xs uppercase">Weight</span> {product.weight || '50g'}</div>
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="Care Instructions"
                            isOpen={openAccordion === 'care'}
                            onClick={() => toggleAccordion('care')}
                        >
                            <p className="mt-2">{product.care_instructions || 'Machine wash warm with like colors. Tumble dry low. Iron on medium heat if needed.'}</p>
                        </AccordionItem>

                        <AccordionItem
                            title="Shipping & Returns"
                            isOpen={openAccordion === 'shipping'}
                            onClick={() => toggleAccordion('shipping')}
                        >
                            <p className="mt-2">Free shipping on all orders over ₹999. We offer a 7-day hassle-free return policy for all unused items in original packaging.</p>
                        </AccordionItem>
                    </div>
                </motion.div>

                {/* 3. Purchase Card */}
                <div className="lg:col-span-4 hidden lg:block">
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="sticky top-28 space-y-6">
                        <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm rounded-[2rem] shadow-xl shadow-black/5 overflow-hidden">
                            <div className="space-y-8">
                                <div>
                                    <h1 className="font-heading text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-none mb-3">{product.title}</h1>

                                    {/* Review Stars UI */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current opacity-50" />
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground underline decoration-dotted cursor-pointer">Read 12 Reviews</span>
                                    </div>

                                    <div className="flex flex-wrap items-baseline gap-3">
                                        <span className="text-3xl font-bold text-foreground">₹{currentPrice}</span>
                                        {product.discount_price && (
                                            <>
                                                <span className="text-base text-muted-foreground line-through decoration-destructive/50">₹{product.price}</span>
                                                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">SAVE {Math.round(((product.price - product.discount_price) / product.price) * 100)}%</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <div className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? 'bg-destructive' : 'bg-green-500 animate-pulse'}`} />
                                        <span className={`text-sm font-bold uppercase tracking-wide ${isOutOfStock ? 'text-destructive' : 'text-green-600'}`}>{isOutOfStock ? 'Out of Stock' : 'In Stock'}</span>
                                        {isLowStock && <span className="text-xs text-destructive font-medium ml-auto bg-destructive/10 px-2 py-1 rounded-md">Only {product.stock} left</span>}
                                    </div>
                                </div>

                                <div className="h-px bg-border" />

                                {isEcommerceActive ? (
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quantity</label>
                                                <Button onClick={() => setIsSizeGuideOpen(true)} variant="link" className="h-auto p-0 text-xs font-bold uppercase tracking-widest text-primary gap-1">
                                                    <Ruler className="h-3.5 w-3.5" /> Size Guide
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between bg-secondary/30 rounded-2xl p-1.5 border border-border">
                                                <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1 || isOutOfStock} className="h-12 w-12 rounded-xl hover:bg-background shadow-sm"><Minus className="h-5 w-5" /></Button>
                                                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                                                <Button variant="ghost" size="icon" onClick={() => setQuantity(prev => (product.stock && prev >= product.stock) ? prev : prev + 1)} disabled={isOutOfStock || quantity >= (product.stock ?? 0)} className="h-12 w-12 rounded-xl hover:bg-background shadow-sm"><Plus className="h-5 w-5" /></Button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Button size="lg" className="w-full h-16 rounded-2xl text-base font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]" onClick={handleAddToCart} disabled={isOutOfStock}>
                                                <ShoppingCart className="h-5 w-5 mr-3" /> {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                                            </Button>
                                            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                                                <Lock className="h-3 w-3" /> <span>Secure Checkout Guaranteed</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <Button size="lg" className="w-full h-16 rounded-2xl text-base font-bold uppercase tracking-widest bg-[#25D366] hover:bg-[#128C7E] text-white shadow-xl" onClick={handleInquire}>WhatsApp Inquiry</Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 pt-16 border-t border-border">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Curated For You</h2>
                            <h3 className="text-3xl font-heading font-bold text-foreground">You May Also Like</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} />)}
                    </div>
                </div>
            )}

            {/* Mobile Sticky Bottom Bar */}
            <AnimatePresence>
                {showMobileBar && isEcommerceActive && !isOutOfStock && (
                    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] lg:hidden pb-safe">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase">{product.title}</p>
                                <p className="text-lg font-black text-foreground">₹{currentPrice}</p>
                            </div>
                            <Button size="lg" onClick={handleAddToCart} className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">Add to Bag</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}