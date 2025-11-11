/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error handling
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.medusajs.com',
      },
      // Add CDN domains as needed for Printful/Printify
      {
        protocol: 'https',
        hostname: '*.printful.com',
      },
      {
        protocol: 'https',
        hostname: '*.printify.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    NEXT_PUBLIC_POLYGON_RPC_URL: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
    NEXT_PUBLIC_POLYGON_CHAIN_ID: process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID,
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for Web3/Ethers.js in Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },

  // Enable experimental features if needed
  experimental: {
    // Optimize server-side rendering
    optimizePackageImports: ['@medusajs/js-sdk', 'ethers'],
  },

  // Internationalization for Brazilian market
  i18n: {
    locales: ['pt-BR', 'en'],
    defaultLocale: 'pt-BR',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Add redirects as needed
    ];
  },

  // Rewrites for API proxying if needed
  async rewrites() {
    return [
      // Proxy Medusa API calls to avoid CORS issues
      {
        source: '/api/medusa/:path*',
        destination: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
