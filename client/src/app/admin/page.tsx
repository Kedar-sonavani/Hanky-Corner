'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useMasterSwitch } from '@/context/MasterSwitchContext';
import { X, Plus, Minus, Trash2, LayoutDashboard, PackagePlus, Layers, Zap, Image as ImageIcon, Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function AdminPage() {
    const { user, session, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const { isEcommerceActive, whatsappNumber, updateSettings, refreshConfig } = useMasterSwitch();

    // Client-side Guard
    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) {
            router.push('/');
        }
    }, [user, isAdmin, authLoading, router]);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempWhatsapp, setTempWhatsapp] = useState(whatsappNumber);

    useEffect(() => {
        setTempWhatsapp(whatsappNumber);
    }, [whatsappNumber]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        discount_price: '',
        stock: '0',
        images: [] as string[],
        is_featured: false,
        category_ids: [] as string[],
        material: '',
        care_instructions: '',
        origin: '',
        manufacturer: '',
        weight: ''
    });

    const [catForm, setCatForm] = useState({ name: '', slug: '', description: '' });
    const apiUrl = getApiUrl();

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;
            setUploading(true);
            const { supabase } = await import('@/lib/supabaseClient');
            const uploadedUrls: string[] = [];

            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-assets')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('product-assets')
                    .getPublicUrl(filePath);

                uploadedUrls.push(data.publicUrl);
            }

            setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
        } catch (error: any) {
            alert('Error uploading images');
        } finally {
            setUploading(false);
        }
    };

    const toggleSwitch = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ is_ecommerce_active: !isEcommerceActive }),
            });
            if (!res.ok) throw new Error('Failed to update settings');
            await refreshConfig();
        } catch (err) {
            alert('Failed to toggle settings');
        } finally {
            setLoading(false);
        }
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `${apiUrl}/api/products/${editingId}`
                : `${apiUrl}/api/products`;

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
                    stock: parseInt(formData.stock)
                }),
            });

            if (!res.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} product`);

            alert(`Product ${editingId ? 'updated' : 'created'}!`);
            setFormData({ title: '', description: '', price: '', discount_price: '', stock: '0', images: [], is_featured: false, category_ids: [], material: '', care_instructions: '', origin: '', manufacturer: '', weight: '' });
            setEditingId(null);
            fetchProducts();
        } catch (err) {
            alert(`Error ${editingId ? 'updating' : 'creating'} product`);
        }
    };

    const startEdit = (product: any) => {
        setEditingId(product.id);
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            discount_price: product.discount_price ? product.discount_price.toString() : '',
            stock: (product.stock || 0).toString(),
            images: product.images,
            is_featured: product.is_featured,
            category_ids: product.category_ids || [],
            material: product.material || '',
            care_instructions: product.care_instructions || '',
            origin: product.origin || '',
            manufacturer: product.manufacturer || '',
            weight: product.weight || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`${apiUrl}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                },
            });
            if (res.ok) {
                fetchProducts();
            } else {
                alert('Failed to delete product');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleStockAdjustment = async (id: string, adjustment: number) => {
        try {
            const res = await fetch(`${apiUrl}/api/products/${id}/stock`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ adjustment }),
            });
            if (res.ok) {
                fetchProducts();
            } else {
                alert('Failed to adjust stock');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (authLoading || !user || !isAdmin) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-zinc-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-6">
            <div className="container max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-heading font-light tracking-tight text-foreground flex items-center gap-3">
                            <LayoutDashboard className="h-8 w-8 text-muted-foreground stroke-[1.5px]" />
                            Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium">Manage your collection and platform settings.</p>
                    </div>
                    <Link href="/admin/orders">
                        <Button className="rounded-2xl border-border bg-card text-foreground border hover:bg-muted font-bold text-xs uppercase tracking-widest px-6 h-12 shadow-sm transition-all flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Manage Orders
                        </Button>
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* LEFT: Main Creation Form */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="border-border rounded-[2rem] shadow-sm bg-card overflow-hidden">
                            <CardHeader className="border-b border-border p-8 bg-muted/20">
                                <CardTitle className="text-lg font-heading font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                                    <PackagePlus className="h-5 w-5 text-muted-foreground" />
                                    {editingId ? 'Edit Product' : 'New Product'}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {editingId ? `Updating: ${formData.title}` : 'Define the details of your new handkerchief listing.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleProductSubmit} className="space-y-10">
                                    {/* Basic Info */}
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Title</label>
                                            <input
                                                className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 text-sm font-medium text-foreground"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Pure Silk Handkerchief"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price (INR)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 text-sm font-medium text-foreground"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                placeholder="999.00"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock</label>
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 text-sm font-medium text-foreground"
                                                value={formData.stock}
                                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                                placeholder="50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-primary">Discount Price (Optional)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-b border-primary/30 py-2 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 text-sm font-medium text-foreground"
                                                value={formData.discount_price}
                                                onChange={e => setFormData({ ...formData, discount_price: e.target.value })}
                                                placeholder="799.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                                        <textarea
                                            className="w-full bg-muted/30 rounded-2xl border border-border p-4 min-h-[120px] outline-none focus:border-input transition-all text-sm resize-none placeholder:text-muted-foreground/50 text-foreground leading-relaxed"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the fabric, weave, and dimensions..."
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Zap className="h-4 w-4" />
                                            Technical Specifications
                                        </label>
                                        <div className="grid sm:grid-cols-2 gap-8 p-6 bg-muted/20 rounded-2xl border border-border">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Material composition</label>
                                                <input
                                                    className="w-full bg-transparent border-b border-border py-1.5 outline-none focus:border-primary transition-colors text-sm font-medium"
                                                    value={formData.material}
                                                    onChange={e => setFormData({ ...formData, material: e.target.value })}
                                                    placeholder="100% Cotton"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Care instructions</label>
                                                <input
                                                    className="w-full bg-transparent border-b border-border py-1.5 outline-none focus:border-primary transition-colors text-sm font-medium"
                                                    value={formData.care_instructions}
                                                    onChange={e => setFormData({ ...formData, care_instructions: e.target.value })}
                                                    placeholder="Machine wash, iron at medium..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Country of Origin</label>
                                                <input
                                                    className="w-full bg-transparent border-b border-border py-1.5 outline-none focus:border-primary transition-colors text-sm font-medium"
                                                    value={formData.origin}
                                                    onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                                    placeholder="India"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Item Weight</label>
                                                <input
                                                    className="w-full bg-transparent border-b border-border py-1.5 outline-none focus:border-primary transition-colors text-sm font-medium"
                                                    value={formData.weight}
                                                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                                    placeholder="50 g"
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Manufacturer Details</label>
                                                <input
                                                    className="w-full bg-transparent border-b border-border py-1.5 outline-none focus:border-primary transition-colors text-sm font-medium"
                                                    value={formData.manufacturer}
                                                    onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                                                    placeholder="B-7/G, Asmeeta Textile Park..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Layers className="h-4 w-4" />
                                            Collection
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const id = cat.id;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            category_ids: prev.category_ids.includes(id)
                                                                ? prev.category_ids.filter(c => c !== id)
                                                                : [...prev.category_ids, id]
                                                        }));
                                                    }}
                                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${formData.category_ids.includes(cat.id)
                                                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                                                        : 'bg-card border-border text-muted-foreground hover:border-primary/50'
                                                        }`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Media Upload */}
                                    <div className="space-y-6 pt-4 border-t border-border">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4" />
                                                Product Media
                                            </label>
                                            {uploading && (
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse flex items-center gap-2">
                                                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                            {formData.images.map((url, index) => (
                                                <div key={index} className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-border bg-muted/20 shadow-sm">
                                                    <img src={url} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="cursor-pointer aspect-[3/4] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-muted/50 hover:border-muted-foreground/30 transition-all text-muted-foreground hover:text-foreground">
                                                <Plus className="h-6 w-6" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                                                <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" />
                                            </label>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full py-8 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20" disabled={uploading}>
                                        {editingId ? 'Update Product' : 'Create Product Listing'}
                                    </Button>
                                    {editingId && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                setEditingId(null);
                                                setFormData({ title: '', description: '', price: '', discount_price: '', stock: '0', images: [], is_featured: false, category_ids: [], material: '', care_instructions: '', origin: '', manufacturer: '', weight: '' });
                                            }}
                                            className="w-full py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
                                        >
                                            Cancel Editing
                                        </Button>
                                    )}
                                </form>
                            </CardContent>
                        </Card>

                        {/* Product List Table */}
                        <Card className="border-border rounded-[2rem] shadow-sm bg-card overflow-hidden">
                            <CardHeader className="border-b border-border p-8 bg-muted/20">
                                <CardTitle className="text-lg font-heading font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                                    <Layers className="h-5 w-5 text-muted-foreground" />
                                    Existing Inventory
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">Review, edit, or remove products from your catalog.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-muted/30 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                                                <th className="px-8 py-4">Product</th>
                                                <th className="px-8 py-4">Price</th>
                                                <th className="px-8 py-4">Stock</th>
                                                <th className="px-8 py-4">Status</th>
                                                <th className="px-8 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {products.map((product) => (
                                                <tr key={product.id} className="group hover:bg-muted/20 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-10 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                                                                <img src={product.images[0]} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-sm text-foreground line-clamp-1">{product.title}</p>
                                                                <p className="text-[10px] text-muted-foreground font-medium">#{product.id.slice(0, 8)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            {product.discount_price ? (
                                                                <>
                                                                    <span className="text-sm font-bold text-foreground">₹{product.discount_price}</span>
                                                                    <span className="text-[10px] font-medium text-muted-foreground line-through">₹{product.price}</span>
                                                                </>
                                                            ) : (
                                                                <span className="text-sm font-bold text-foreground">₹{product.price}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <span className={`text-xs font-bold ${product.stock <= 2 ? 'text-red-600' : product.stock <= 5 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                                                                    {product.stock} Units
                                                                </span>
                                                                {product.stock <= 2 && (
                                                                    <span className="text-[8px] font-black uppercase tracking-tighter text-red-500 animate-pulse">Low Stock</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleStockAdjustment(product.id, 1)}
                                                                    className="h-6 w-6 rounded-md bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                                                                    title="Add 1"
                                                                >
                                                                    <Plus size={10} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStockAdjustment(product.id, -1)}
                                                                    className="h-6 w-6 rounded-md bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                                                                    title="Subtract 1"
                                                                >
                                                                    <Minus size={10} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        {product.is_featured && (
                                                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest border border-primary/20">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => startEdit(product)}
                                                                className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                                                            >
                                                                <Plus size={14} className="rotate-45" /> {/* Use Plus as edit icon for now or just text */}
                                                            </button>
                                                            <button
                                                                onClick={() => deleteProduct(product.id)}
                                                                className="p-2 rounded-lg bg-muted text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {products.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-medium text-sm">
                                                        No products in inventory yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: Sidebar Controls */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Master Switch & Global Settings */}
                        <Card className="border-border rounded-[2rem] shadow-sm bg-card">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    Global Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-6 rounded-2xl border border-border bg-muted/20 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-foreground">{isEcommerceActive ? 'E-Commerce' : 'Showcase Only'}</span>
                                        <div className={`h-2.5 w-2.5 rounded-full ${isEcommerceActive ? 'bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.6)]' : 'bg-muted-foreground'}`} />
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                        Current mode affects price visibility and cart availability.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={toggleSwitch}
                                        disabled={loading}
                                        className="w-full h-10 rounded-xl border-border hover:bg-muted font-bold text-[10px] uppercase tracking-widest transition-all text-foreground"
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Switch to ${isEcommerceActive ? 'Showcase' : 'E-Commerce'}`}
                                    </Button>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">WhatsApp Number</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary transition-all font-medium text-foreground"
                                            value={tempWhatsapp}
                                            onChange={(e) => setTempWhatsapp(e.target.value)}
                                            onBlur={async () => {
                                                if (tempWhatsapp && tempWhatsapp !== whatsappNumber) {
                                                    setLoading(true);
                                                    try {
                                                        await updateSettings({ whatsapp_number: tempWhatsapp });
                                                        alert('WhatsApp number updated!');
                                                    } catch (err) {
                                                        alert('Failed to update WhatsApp number');
                                                        setTempWhatsapp(whatsappNumber);
                                                    }
                                                    setLoading(false);
                                                }
                                            }}
                                            placeholder="917822832788"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground ml-1 italic">Enter number with country code (e.g. 91...)</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Category Manager */}
                        <Card className="border-border rounded-[2rem] shadow-sm bg-card">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Collections</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        const res = await fetch(`${apiUrl}/api/categories`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${session?.access_token}`
                                            },
                                            body: JSON.stringify(catForm),
                                        });
                                        if (res.ok) { setCatForm({ name: '', slug: '', description: '' }); fetchCategories(); }
                                    } catch (err) { alert('Error'); }
                                }} className="flex gap-2">
                                    <input
                                        className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50 text-foreground font-medium"
                                        placeholder="New collection..."
                                        value={catForm.name}
                                        onChange={e => setCatForm({ ...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                        required
                                    />
                                    <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-xl">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </form>

                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 group hover:bg-card hover:border-primary/30 hover:shadow-sm transition-all">
                                            <span className="text-xs font-bold text-foreground">{cat.name}</span>
                                            <button
                                                onClick={async () => {
                                                    if (!confirm('Delete?')) return;
                                                    const res = await fetch(`${apiUrl}/api/categories/${cat.id}`, { method: 'DELETE', headers: { 'x-admin-secret': 'AdminPASS' } });
                                                    if (res.ok) fetchCategories();
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}