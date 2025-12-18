import type { NextConfig } from "next";

const nextConfig: NextConfig = {

   turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  experimental: {
    optimizeCss: true, // Inline critical Tailwind CSS
    optimizePackageImports: ["react-icons", "leaflet"],
  },

  compress: true, // Enable gzip/deflate

  images: {
    deviceSizes: [320, 640, 1080, 1600],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "udlwtcamuqfxdxhrniau.supabase.co",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    unoptimized: process.env.NODE_ENV === "development", // speeds up dev
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Tree shaking safe defaults
      config.optimization.usedExports = true;
    }
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
