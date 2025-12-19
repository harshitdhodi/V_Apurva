// src/app/not-found.jsx
import Link from 'next/link';
import { Home } from 'lucide-react';

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: 'Page Not Found - Apurva Chemicals',
    description: 'The page you are looking for does not exist or has been moved. Please return to the homepage.',
    robots: {
      index: false, // Prevent indexing
      follow: true, // Allow link crawling
    },
    openGraph: {
      title: '404 - Page Not Found | Apurva Chemicals',
      description: 'Oops! The page you are looking for could not be found.',
      type: 'website',
      images: [
        {
          url: '/images/404-og-image.jpg', // Optional preview image
          width: 1200,
          height: 630,
          alt: '404 Page Not Found',
        },
      ],
    },
    // twitter: {
    //   card: 'summary_large_image',
    //   title: '404 - Page Not Found | Apurva Chemicals',
    //   description: 'Oops! The page you are looking for could not be found.',
    //   images: ['/images/404-og-image.jpg'],
    // },
  };
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}