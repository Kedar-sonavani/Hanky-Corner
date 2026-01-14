const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchProducts() {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}
