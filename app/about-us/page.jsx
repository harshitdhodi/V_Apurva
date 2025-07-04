'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';

// Client-only wrapper
const ClientOnly = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

// Error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600">Please refresh the page or try again later.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Dynamic imports
const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: false });
const AboutImg = dynamic(() => import('../../components/AboutImg'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse"></div>,
});
const Video = dynamic(() => import('../../components/Video'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse"></div>,
});
const OurPeople = dynamic(() => import('../../components/OurPeople'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse"></div>,
});
const PackagingType = dynamic(() => import('../../components/PackagingType'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse"></div>,
});
const Partners = dynamic(() => import('../../components/Partners'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse"></div>,
});
const OurProcess = dynamic(() => import('../../components/ourprocess/OurProcess'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-100 animate-pulse"></div>,
});
const Footer = dynamic(() => import('../../components/layout/Footer'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-100"></div>,
});

const AboutUsPage = () => {
  return (
    <ErrorBoundary>
      <ClientOnly>
        <div className="flex flex-col min-h-screen">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            }
          >
            <Navbar />
            <main className="flex-grow">
              <AboutImg />
              <div className="pt-20">
                <Video />
              </div>
              <OurPeople />
              <PackagingType />
              <OurProcess />
              <Partners />
            </main>
            <Footer />
          </Suspense>
        </div>
      </ClientOnly>
    </ErrorBoundary>
  );
};

export default AboutUsPage;