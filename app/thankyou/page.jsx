'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import img from '@/public/thank-you.webp';
const ThankYouPage = () => {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center">
                <div className="mb-4">
                    <Image
                        src={img}
                        alt="Thank You"
                        width={500}  // specify width
                        height={300} // specify height
                        className="mx-auto  w-auto mb-4"
                        priority
                    />
                </div>
                <p className="text-gray-600 mb-6">
                    Your message has been successfully received. We appreciate your interest and will get back to you shortly.
                </p>
                <Link
                    href="/"
                    className="bg-[#bf2e2e] text-white cursor-pointer font-semibold py-2 px-4 rounded hover:bg-[#bf2e2e] transition duration-300"
                >
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
};

export default ThankYouPage;