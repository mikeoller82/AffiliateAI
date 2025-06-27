/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.leonardo.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd1yjjnpx0p53s8.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-platform.99static.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  allowedDevOrigins: ['https://3003-firebase-studio-1750492820777.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev'],
  
  // Add headers to prevent timeout issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Keep-Alive',
            value: 'timeout=30, max=1000'
          },
          {
            key: 'Connection',
            value: 'keep-alive'
          },
        ],
      },
    ];
  },
  
  webpack(config, { isServer }) {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        "firebase-admin": false,
        "crypto": false,
        "genkit": false,
        "@genkit-ai/googleai": false,
        "@genkit-ai/next": false,
        // Add network-related fallbacks for timeout issues
        "net": false,
        "tls": false,
        "fs": false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
