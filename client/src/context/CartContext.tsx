'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: string;
    product_id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    stock: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addItem: (item: CartItem) => { success: boolean; message?: string };
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('hanky_corner_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart:", e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('hanky_corner_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (item: CartItem): { success: boolean; message?: string } => {
        let status = { success: true, message: '' };

        setCartItems(prev => {
            const existing = prev.find(i => i.product_id === item.product_id);
            if (existing) {
                const newQuantity = existing.quantity + item.quantity;
                if (newQuantity > item.stock) {
                    status = { success: false, message: `Only ${item.stock} items available in stock.` };
                    return prev;
                }
                return prev.map(i =>
                    i.product_id === item.product_id
                        ? { ...i, quantity: newQuantity, stock: item.stock }
                        : i
                );
            }

            if (item.quantity > item.stock) {
                status = { success: false, message: `Only ${item.stock} items available in stock.` };
                return prev;
            }

            return [...prev, item];
        });

        return status;
    };

    const removeItem = (id: string) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems(prev => prev.map(i =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
