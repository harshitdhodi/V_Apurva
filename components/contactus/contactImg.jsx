"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

function ContactusImg() {
    const [banners, setBanners] = useState([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/banner/getBannersBySectionContactus');
            setBanners(response.data.data || []);
        } catch (error) {
            console.error("Error fetching banners:", error);
        }
    };

    if (!isClient) {
        return <div className="h-[40vh] md:h-[30vh] bg-gray-200 animate-pulse"></div>;
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
                                    {banner.title}
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