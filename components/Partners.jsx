"use client"

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

function Partners() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const sliderRef = useRef(null);
    const intervalRef = useRef(null);
    const itemsPerSlide = 4; // Number of items to show per slide

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/partners/getActivePartners');
            setPartners(response.data.data || []);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = useCallback(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % partners.length);
    }, [partners.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(prevIndex => 
            (prevIndex - 1 + partners.length) % partners.length
        );
    }, [partners.length]);

    // Handle auto-sliding
    useEffect(() => {
        if (partners.length === 0 || isPaused) return;

        intervalRef.current = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [partners.length, isPaused, nextSlide]);

    useEffect(() => {
        fetchData();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="bg-black h-[40vh] flex justify-center items-center">
                <div className="text-white">Loading partners...</div>
            </div>
        );
    }

    if (!partners || partners.length === 0) {
        return null;
    }

    // Create an array with the current partner and the next 3 partners (with wrap-around)
    const visiblePartners = Array.from({ length: 4 }).map((_, i) => {
        const index = (currentIndex + i) % partners.length;
        return partners[index];
    });

    return (
        <div 
            className="bg-black py-16 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-4">
                <h2 className="text-white text-3xl font-bold text-center mb-12">Our Partners</h2>
                
                <div className="relative">
                
                    
                    <div 
                        ref={sliderRef}
                        className="relative w-full overflow-hidden"
                    >
                        <div className="grid grid-cols-4 gap-4 mx-auto max-w-6xl transition-transform duration-500">
                            {visiblePartners.map((partner, index) => (
                                <div 
                                    key={index}
                                    className="flex justify-center items-center h-40 rounded-lg p-4 transition-transform duration-300 hover:scale-105"
                                >
                                    <Link href={partner.url} className="block w-full h-full">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={`/api/image/download/${partner.photo[0]}`}
                                                alt={partner.alt?.[0] || 'Partner logo'}
                                                title={partner.imgTitle?.[0] || ''}
                                                fill
                                                className="object-contain p-2"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Partners;