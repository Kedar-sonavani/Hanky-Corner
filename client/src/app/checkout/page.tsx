'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, CheckCircle2, Package, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Toast notification component (you can replace with your preferred library like sonner or react-hot-toast)
const useToast = () => {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' }>>([]);

    const toast = {
        success: (message: string) => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type: 'success' }]);
            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
        },
        error: (message: string) => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type: 'error' }]);
            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
        }
    };

    return { toast, toasts };
};

const ToastContainer = ({ toasts }: { toasts: Array<{ id: number; message: string; type: 'success' | 'error' }> }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: -20, x: 100 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px] ${toast.type === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                        }`}
                >
                    {toast.type === 'success' ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : (
                        <AlertCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">{toast.message}</span>
                </motion.div>
            ))}
        </div>
    );
};

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const { toast, toasts } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        // Accepts formats: +91 98765 43210, 9876543210, +919876543210, etc.
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,5}[)]?[-\s\.]?[0-9]{4,6}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return cleanPhone.length >= 10 && phoneRegex.test(phone);
    };

    const validatePincode = (pincode: string): boolean => {
        // Indian pincode format: 6 digits, first digit cannot be 0
        const pincodeRegex = /^[1-9][0-9]{5}$/;
        return pincodeRegex.test(pincode);
    };

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address';
                return '';
            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                if (!validatePhone(value)) return 'Please enter a valid phone number (10+ digits)';
                return '';
            case 'address':
                if (!value.trim()) return 'Address is required';
                if (value.trim().length < 10) return 'Please enter a detailed address';
                return '';
            case 'city':
                if (!value.trim()) return 'City is required';
                if (value.trim().length < 2) return 'Please enter a valid city name';
                return '';
            case 'pincode':
                if (!value.trim()) return 'Pincode is required';
                if (!validatePincode(value)) return 'Please enter a valid 6-digit pincode';
                return '';
            default:
                return '';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        const newTouched: Record<string, boolean> = {};

        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key as keyof typeof formData]);
            if (error) {
                newErrors[key] = error;
            }
            newTouched[key] = true;
        });

        setErrors(newErrors);
        setTouched(newTouched);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            customer_name: formData.name.trim(),
            customer_email: formData.email.trim().toLowerCase(),
            customer_phone: formData.phone.trim(),
            shipping_address: `${formData.address.trim()}, ${formData.city.trim()} - ${formData.pincode.trim()}`,
            total_price: cartTotal,
            items: cartItems.map(item => ({
                product_id: item.product_id,
                title: item.title,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                setOrderNumber(data.order_id || `HK${Date.now()}`);
                setIsSuccess(true);
                clearCart();
                toast.success('Order placed successfully!');
            } else {
                const errorMessage = data.message || 'Failed to place order. Please try again.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Connection error. Please check your internet and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container max-w-2xl py-24 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="flex justify-center">
                        <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full">
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Order Placed Successfully!</h1>

                    {orderNumber && (
                        <div className="inline-block bg-zinc-100 dark:bg-zinc-800 px-6 py-3 rounded-lg">
                            <p className="text-sm text-zinc-500 font-medium">Order Number</p>
                            <p className="text-2xl font-bold tracking-wider">{orderNumber}</p>
                        </div>
                    )}

                    <p className="text-zinc-500 text-lg max-w-md mx-auto">
                        Thank you for shopping with Hanky Corner. We've received your order and will contact you shortly for confirmation.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 max-w-md mx-auto">
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">What's Next?</h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 text-left">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>You'll receive a confirmation call within 24 hours</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Payment options will be discussed on the call</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Expected delivery: 5-7 business days</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button className="font-bold px-10 py-6 text-lg w-full sm:w-auto">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container py-24 text-center space-y-6">
                <ShoppingBag className="mx-auto h-16 w-16 text-zinc-300" />
                <h1 className="text-3xl font-bold">Your cart is empty</h1>
                <p className="text-zinc-500">Add some premium handkerchiefs to your cart to checkout.</p>
                <Link href="/">
                    <Button variant="outline" className="font-bold">Return to Shop</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <ToastContainer toasts={toasts} />

            <div className="container py-12 max-w-6xl">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-primary mb-8 transition-colors"
                    aria-label="Return to shopping page"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Shopping
                </Link>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tighter mb-2">Checkout</h1>
                            <p className="text-zinc-500">Complete your details to place your order.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-primary" />
                                    Shipping Information
                                </h2>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="name"
                                            className="text-xs font-bold uppercase tracking-widest text-zinc-500"
                                        >
                                            Full Name *
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full p-3 bg-zinc-50 dark:bg-gray-100 border rounded-lg focus:ring-2 ring-primary/20 outline-none transition-all ${errors.name && touched.name ? 'border-red-500' : ''
                                                }`}
                                            placeholder="John Doe"
                                            aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                                            aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                                        />
                                        {errors.name && touched.name && (
                                            <p id="name-error" className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="email"
                                            className="text-xs font-bold uppercase tracking-widest text-zinc-500"
                                        >
                                            Email Address *
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full p-3 bg-zinc-50 dark:bg-gray-100 border rounded-lg focus:ring-2 ring-primary/20 outline-none transition-all ${errors.email && touched.email ? 'border-red-500' : ''
                                                }`}
                                            placeholder="john@example.com"
                                            aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                                            aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                                        />
                                        {errors.email && touched.email && (
                                            <p id="email-error" className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2 sm:col-span-2">
                                        <label
                                            htmlFor="phone"
                                            className="text-xs font-bold uppercase tracking-widest text-zinc-500"
                                        >
                                            Phone Number *
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full p-3 bg-zinc-50 dark:bg-gray-100 border rounded-lg focus:ring-2 ring-primary/20 outline-none transition-all ${errors.phone && touched.phone ? 'border-red-500' : ''
                                                }`}
                                            placeholder="+91 98765 43210"
                                            aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
                                            aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
                                        />
                                        {errors.phone && touched.phone && (
                                            <p id="phone-error" className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2 sm:col-span-2">
                                        <label
                                            htmlFor="address"
                                            className="text-xs font-bold uppercase tracking-widest text-zinc-500"
                                        >
                                            Detailed Address *
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            rows={3}
                                            className={`w-full p-3 bg-zinc-50 dark:bg-gray-100 border rounded-lg focus:ring-2 ring-primary/20 outline-none transition-all ${errors.address && touched.address ? 'border-red-500' : ''
                                                }`}
                                            placeholder="House No, Street name, Landmark"
                                            aria-invalid={errors.address && touched.address ? 'true' : 'false'}
                                            aria-describedby={errors.address && touched.address ? 'address-error' : undefined}
                                        />
                                        {errors.address && touched.address && (
                                            <p id="address-error" className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    {/* City */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="city"
                                            className="text-xs font-bold uppercase tracking-widest text-zinc-500"
                                        >
                                            City *
                                        </label>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full p-3 bg-zinc-50 dark:bg-gray-100 border rounded-lg focus:ring-2 ring-primary/20 outline-none transition-all ${errors.city && touched.city ? 'border-red-500' : ''
                                                }`}
                                            placeholder="Mumbai"
                                            aria-invalid={errors.city && touched.city ? 'true' : 'false'}
                                            aria-describedby={errors.city && touched.city ? 'city-error' : undefined}
                                        />
                                        {errors.city && touched.city && (
                                            <p id="city-error" className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>

                                    {/* Pincode */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="pincode"
                                            className="text-xs font-bold uppercase tracking-widest text-zinc-500"
                                        >
                                            Pincode *
                                        </label>
                                        <input
                                            id="pincode"
                                            name="pincode"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full p-3 bg-zinc-50 dark:bg-gray-100 border rounded-lg focus:ring-2 ring-primary/20 outline-none transition-all ${errors.pincode && touched.pincode ? 'border-red-500' : ''
                                                }`}
                                            placeholder="400001"
                                            aria-invalid={errors.pincode && touched.pincode ? 'true' : 'false'}
                                            aria-describedby={errors.pincode && touched.pincode ? 'pincode-error' : undefined}
                                        />
                                        {errors.pincode && touched.pincode && (
                                            <p id="pincode-error" className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.pincode}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm">
                                <div className="flex gap-4">
                                    {/* Icon with a clean white circular background */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm">
                                        <ShieldCheck className="h-5 w-5 text-zinc-900" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
                                            Payment Verification
                                        </h4>
                                        <p className="text-sm leading-relaxed text-zinc-600">
                                            To ensure a secure transaction, our team will personally contact you via call within
                                            <span className="text-zinc-900 font-semibold"> 24 hours </span>
                                            to confirm your order and provide payment details for <span className="italic">Bank Transfer</span> or <span className="italic">COD</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-8 text-lg font-bold shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                                aria-busy={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    `Place Order • ₹${cartTotal.toLocaleString('en-IN')}`
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 border border-zinc-200 rounded-3xl p-8 bg-white shadow-sm space-y-8">
                            <header className="flex items-center justify-between border-b border-zinc-100 pb-6">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 flex items-center gap-3">
                                    <Package className="h-4 w-4 text-zinc-400" />
                                    Summary
                                </h2>
                                <span className="text-xs font-medium px-2 py-1 bg-zinc-100 rounded-md text-zinc-600">
                                    {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                                </span>
                            </header>

                            {/* Scrollable Product List */}
                            <div className="max-h-[380px] overflow-y-auto pr-3 space-y-6 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 group items-center">
                                        <div className="h-20 w-16 relative rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <h3 className="font-semibold text-sm text-zinc-900 line-clamp-1 group-hover:text-zinc-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-zinc-400 text-xs font-medium tracking-wide">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-zinc-900">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing Calculation */}
                            <div className="space-y-4 pt-8 border-t border-zinc-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Subtotal</span>
                                    <span className="font-medium text-zinc-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500">Shipping</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Calculated at call</span>
                                </div>

                                <div className="flex justify-between items-end pt-4">
                                    <div className="space-y-0.5">
                                        <span className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Total Amount</span>
                                        <span className="text-3xl font-light tracking-tighter text-zinc-900">
                                            ₹{cartTotal.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="pt-2">
                                <div className="flex items-center justify-center gap-3 py-4 bg-zinc-50 rounded-2xl border border-zinc-100/50 text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-bold">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Secure Checkout Guaranteed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}