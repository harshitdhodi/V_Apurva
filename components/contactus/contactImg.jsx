"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function ContactusImg({ banners = [] }) {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();
    
    const slug = pathname
        .split('/')
        .pop() // Get the last part after last slash
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    useEffect(() => {
        setIsClient(true);
        window.scrollTo(0, 0);
    }, []);

    if (!isClient) {
        return <div className="h-[40vh] md:h-[30vh] bg-gray-200 animate-pulse"></div>;
    }

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

    return (
        <div>
            {banners.map((banner, index) => (
                <div key={index}>
                    <div
                        className="relative bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(/api/image/download/${banner.photo})`,
                            height: '40vh'
                        }}
                        title={banner.title}
                    >
                        <div className='flex flex-col justify-center items-center h-full mb-10 relative z-10'>
                            <h1 className='font-bold text-white text-2xl md:text-4xl text-center px-4'>
                                {banner.title}
                            </h1>
                            <div className="absolute bottom-16 flex items-center space-x-2">
                                <Link href="/" className="text-white hover:text-gray-300 text-sm md:text-base">
                                    Home
                                </Link>
                                <span className="text-white">/</span>
                                <span className="text-white text-sm md:text-base">
                                    {slug}
                                </span>
                            </div>
                        </div>
                        <div className='absolute inset-0 bg-black opacity-40'></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ContactusImg;