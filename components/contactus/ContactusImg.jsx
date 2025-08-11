import React from 'react';
import Link from 'next/link';
import ClientContactImg from './ClientContactImg'; // We'll create this for client-side features

// This is now a Server Component that renders proper HTML
function ContactusImg({ banners = [] }) {
    // Generate slug on server side
    const slug = 'Contact Us'; // Since this is contact page, we can hardcode or make it dynamic

    // If no banners, render fallback on server
    if (!banners.length) {
        return (
            <div className="relative bg-gray-200 h-[40vh] flex items-center justify-center">
                <div className='flex flex-col justify-center items-center h-full mb-10 relative z-10'>
                    <h1 className='font-bold text-gray-800 text-2xl md:text-4xl text-center px-4'>
                        Contact Us
                    </h1>
                    <div className="absolute bottom-16 flex items-center space-x-2">
                        <Link href="/" className="text-gray-800 hover:text-gray-600 text-sm md:text-base">
                            Home
                        </Link>
                        <span className="text-gray-800">/</span>
                        <span className="text-gray-800 text-sm md:text-base">
                            {slug}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Render banners with proper HTML structure for SEO
    return (
        <>
            {banners.map((banner, index) => (
                <div key={`banner-${index}`}>
                    <div
                        className="relative bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(/api/image/download/${banner.photo})`,
                            height: '40vh'
                        }}
                        title={banner.title || 'Contact Us Banner'}
                    >
                        {/* This content will be in proper HTML for SEO crawlers */}
                        <div className='flex flex-col justify-center items-center h-full mb-10 relative z-10'>
                            <h1 className='font-bold text-white text-2xl md:text-4xl text-center px-4'>
                                {banner.title || 'Contact Us'}
                            </h1>
                            <div className="absolute bottom-16 flex items-center space-x-2">
                                <Link 
                                    href="/" 
                                    className="text-white hover:text-gray-300 text-sm md:text-base"
                                    aria-label="Go to Home page"
                                >
                                    Home
                                </Link>
                                <span className="text-white" aria-hidden="true">/</span>
                                <span className="text-white text-sm md:text-base">
                                    {slug}
                                </span>
                            </div>
                        </div>
                        <div className='absolute inset-0 bg-black opacity-40' aria-hidden="true"></div>
                    </div>
                </div>
            ))}
            
            {/* Add client-side features without affecting SEO */}
            <ClientContactImg />
        </>
    );
}

export default ContactusImg;