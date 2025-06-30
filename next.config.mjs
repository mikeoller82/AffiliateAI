/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: [
      'canvas',
      'jsdom',
      'puppeteer',
      '@firebase/app',
      '@firebase/auth',
      '@firebase/firestore',
      'firebase-admin',
      'bcryptjs',
      'jsonwebtoken',
    ]
  },
  webpack: (config, { isServer, dev }) => {
    // Enhanced fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        tls: false,
        net: false,
        http2: false,
        dgram: false,
        dns: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        querystring: false,
        util: false,
        buffer: false,
        timers: false,
        console: false,
        vm: false,
        process: false,
        'child_process': false,
        'worker_threads': false,
        'perf_hooks': false,
        'async_hooks': false,
        events: false,
        constants: false,
        domain: false,
        punycode: false,
        _stream_duplex: false,
        _stream_passthrough: false,
        _stream_readable: false,
        _stream_transform: false,
        _stream_writable: false,
        'pg-native': false,
        'sqlite3': false,
        'tedious': false,
        'pg-query-stream': false,
        mysql: false,
        mysql2: false,
        'oracledb': false,
      };
    }

    // Ignore specific modules that commonly cause issues
    config.externals = config.externals || [];
    
    if (isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        'supports-color': 'commonjs supports-color',
        'canvas': 'commonjs canvas',
      });
    }

    // Handle dynamic imports and module resolution
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    // Ignore warnings for specific modules
    config.ignoreWarnings = [
      /Module not found: Error: Can't resolve/,
      /Critical dependency: the request of a dependency is an expression/,
      /Should not import the named export/,
    ];

    // Add alias for common problematic modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      '@mapbox/node-pre-gyp': false,
      'mock-aws-s3': false,
      'aws-sdk': false,
      'nock': false,
    };

    // Set resolve conditions
    config.resolve.conditionNames = [
      'import',
      'module',
      'browser',
      'default',
      'require',
    ];

    return config;
  },
  images: {
    dangerouslyAllowSVG: true,
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
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
