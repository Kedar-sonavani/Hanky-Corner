/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    // In production, NOT setting NEXT_PUBLIC_API_URL often leads to 'localhost:5000' which fails.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    if (isProd && apiUrl.includes('localhost')) {
      console.warn('⚠️ WARNING: NEXT_PUBLIC_API_URL is defaulting to localhost in production. API calls will likely fail.');
    }
    
    console.log(`[Next.js Rewrite]: Proxying /api to ${apiUrl}/api`);
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};


module.exports = nextConfig;
