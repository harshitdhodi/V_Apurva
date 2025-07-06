'use client';

import { Suspense, useEffect, useState, Component, lazy } from 'react';
import dynamic from 'next/dynamic';

// Client-side only component
const ClientOnly = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return children;
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
      return <div className="p-4 text-center text-red-500">Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

// Create a safe dynamic import with error handling
const safeDynamic = (importFunc, options = {}) => {
  return dynamic(() => importFunc()
    .catch(err => {
      console.error('Error loading component:', err);
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

export default function HomeContent() {
  return (
    <ErrorBoundary>
      <ClientOnly>
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicNavbar />
          <DynamicCarousel />
          <DynamicVideo />
          <DynamicProductsGrid />
          <DynamicBlogPage />
          <DynamicFooter />
        </Suspense>
      </ClientOnly>
    </ErrorBoundary>
  );
}
