/** @type {import('next').NextConfig} */
import TerserPlugin from 'terser-webpack-plugin';

// Conditionally require the bundle analyzer plugin
const withBundleAnalyzer = process.env.ANALYZE
  ? (await import('@next/bundle-analyzer'))({
      enabled: process.env.ANALYZE === 'true' || process.env.ANALYZE === 'browser',
      openAnalyzer: false,
    })
  : (config) => config;

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.admin.apurvachemicals.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3059',
        pathname: '/api/image/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3059',
        pathname: '/api/logo/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },

  // Enable compression for production
  compress: true,
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Enable React's experimental features
  experimental: {
    // Enable modularize imports for better tree shaking
    modularizeImports: {
      'react-icons': {
        transform: 'react-icons/{{member}}',
      },
    },
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', 'react-icons'],
    // Enable server components
    serverComponents: true,
  },

  // Webpack configuration
  webpack: (config, { isServer, dev, isEdge }) => {
    // Only optimize in production
    if (!dev && !isServer && !isEdge) {
      // Enable Terser minification with custom options
      config.optimization.minimizer = [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_console: !dev, // Remove console.* in production
              drop_debugger: !dev, // Remove debugger statements
              pure_funcs: ['console.log'], // Remove console.log
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
      ];
      
      // Enable chunk splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1];
              return `npm.${packageName?.replace('@', '')}`;
            },
          },
          commons: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|scheduler|camelcase|date-fns|next)[\\/]/,
            name: 'commons',
            chunks: 'all',
            priority: 20,
          },
        },
      };
      
      // Enable runtime chunk
      config.optimization.runtimeChunk = 'single';
    }

    // Handle binary files
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Add bundle analyzer plugin if enabled
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } =  import('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: `./analyze/${process.env.ANALYZE}.html`,
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // API routes configuration
  async rewrites() {
    return [
      // Your existing rewrite rules
      {
        source: '/api/image/download/:path*',
        destination: '/api/image/download/:path*',
      },
      {
        source: '/api/image/video/:path*',
        destination: '/api/image/video/:path*',
      },
      {
        source: '/api/logo/:path*',
        destination: '/api/logo/:path*',
      },
      {
        source: '/api/image/msds/view/:path*',
        destination: '/api/image/msds/view/:path*',
      },
      {
        source: '/api/:path*',
<<<<<<< HEAD
        destination:
          process.env.NODE_ENV === 'production'
            ? 'https://www.apurvachemicals.com/api/:path*'
            : 'http://localhost:3000/api/:path*',
=======
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://www.apurvachemicals.com/api/:path*' 
          : 'http://localhost:3059/api/:path*',
>>>>>>> prod
      },
    ];
  },
  
  // Set the default port for development
  env: {
    PORT: '3059',
  },
};

export default withBundleAnalyzer(nextConfig);