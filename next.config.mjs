/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['www.apurvachemicals.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.apurvachemicals.com',
        pathname: '/api/image/**',
      },
      {
        protocol: 'https',
        hostname: 'www.apurvachemicals.com',
        pathname: '/api/logo/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-nextjs-data',
          },
        ],
        destination: '/:path*',
      },
      {
        source: '/api/image/:path*',
        destination: 'https://www.apurvachemicals.com/api/image/:path*',
      },
      {
        source: '/api/logo/:path*',
        destination: 'https://www.apurvachemicals.com/api/logo/:path*',
      },
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'production'
            ? 'https://www.apurvachemicals.com/api/:path*'
            : 'http://localhost:3000/api/:path*',
      },
    ];
  },
}
export default nextConfig;
