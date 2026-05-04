import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getURL = () => {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ?? // Set this in your .env.production
        process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set on Vercel
        'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to include a trailing slash.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
};

