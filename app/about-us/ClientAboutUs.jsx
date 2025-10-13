'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for client components
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
import OurProcess from '../../components/ourprocess/OurProcess';
const Footer = dynamic(() => import('../../components/layout/Footer'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-100"></div>,
});

export default function ClientAboutUs() {
  return (
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
  );
}
