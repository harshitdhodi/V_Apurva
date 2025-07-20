/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.apurvachemicals.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/image/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/logo/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },

  async rewrites() {
    return [
      // Handle image download requests
      {
        source: '/api/image/download/:path*',
        destination: '/api/image/download/:path*',
      },
      // Handle video requests
      {
        source: '/api/image/video/:path*',
        destination: '/api/image/video/:path*',
      },
      // Handle logo requests
      {
        source: '/api/logo/:path*',
        destination: '/api/logo/:path*',
      },
      // Fallback for other API routes
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://www.apurvachemicals.com/api/:path*' 
          : 'http://localhost:3000/api/:path*',
      },
    ];
  },
  
  // Add custom webpack config to handle binary files
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
