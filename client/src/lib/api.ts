export const getApiUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:5000';
    }
    return ''; // In production, use relative paths to leverage Next.js rewrites
};

const API_URL = getApiUrl();

export async function fetchProducts() {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}
