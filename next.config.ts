
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'cdn.leonardo.ai' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'd1yjjnpx0p53s8.cloudfront.net' },
      { protocol: 'https', hostname: 'cdn.prod.website-files.com' },
      { protocol: 'https', hostname: 'images-platform.99static.com' },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is needed for some packages that use node-loader
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // This is the safety net for client-side builds.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'firebase-admin': false,
        'process': false,
        'node:process': false,
      };
    }
    return config;
  },
  // This is the primary mechanism for handling server-only packages in Server Components
  serverComponentsExternalPackages: ['@genkit-ai/googleai', 'genkit', '@genkit-ai/next', 'firebase-admin'],
};

export default nextConfig;
