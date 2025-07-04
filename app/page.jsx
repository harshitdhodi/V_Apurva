'use client';

import { Suspense, useEffect, useState, Component, lazy } from 'react';
import dynamic from 'next/dynamic';

// Client-side only component
const ClientOnly = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []); // Empty dependency array ensures this runs only once on mount

  // On server or during initial render, return an empty div with the same structure
  if (!mounted) {
    return <div className="min-h-screen">{children}</div>;
  }

  return <>{children}</>;
};

// Error boundary component
class ErrorBoundary extends Component { 
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We're having trouble loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Create a safe dynamic import with error handling
const safeDynamic = (importFunc, options = {}) => {
  return dynamic(
    () => importFunc().catch(err => {
      console.error('Failed to load component:', err);
      return { default: () => <div className="p-4 text-center text-gray-500">Component failed to load</div> };
    }),
    { ssr: false, ...options }
  );
};

// Dynamically import client components with no SSR and error handling
const DynamicNavbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const DynamicCarousel = dynamic(() => import('@/components/Carousol'), { ssr: false });
const DynamicVideo = dynamic(() => import('@/components/Video'), { ssr: false });
const DynamicProductsGrid = dynamic(() => import('@/components/product/ProductsGrid'), { ssr: false });
const DynamicBlogPage = dynamic(() => import('@/components/blog/BlogPage'), { ssr: false });
const DynamicFooter = dynamic(() => import('@/components/layout/Footer'), { ssr: false });

export default function Home() {
  return (
    <ErrorBoundary>
      <ClientOnly>
        <div className="min-h-screen">
          <DynamicNavbar />
          <main>
            <Suspense fallback={
              <div className="flex-grow flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            }>
              <DynamicCarousel />
              <DynamicVideo />
              <DynamicProductsGrid />
              <DynamicBlogPage />
            </Suspense>
          </main>
          <DynamicFooter />
        </div>
      </ClientOnly>
    </ErrorBoundary>
  );
}
