'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import img from '@/public/thankyou.png';
import { useClickTracking } from '@/lib/useClickTracking';

const ThankYouPage = () => {

    const { trackEvent } = useClickTracking();

    // Track page view on component mount
    useEffect(() => {
        trackEvent('page_view', {
            page: '/thank-you',
            metadata: {
                section: 'thankyou',
                action: 'page_loaded'
            }
        });
    }, [trackEvent]);

    return (
        <div className="min-h-screen  flex items-start mt-12 justify-center ">
            <div className="bg-white  rounded-lg   max-w-2xl text-center">
                <div className="mb-4">
                    <Image
                        src={img}
                        alt="Thank You"
                        width={300}  // specify width
                        height={300} // specify height
                        className="mx-auto object-contain  w-auto mb-4 "
                        priority
                    />
                </div>
                <p className="text-gray-600 font-semibold mb-6">
                    Your message has been successfully received. We appreciate your interest and will get back to you shortly.
                </p>
                <Link
                    href="/"
                    onClick={() => trackEvent('button_click', {
                        buttonName: 'return_to_homepage',
                        page: '/thank-you',
                        metadata: {
                            section: 'thankyou',
                            action: 'navigate_home'
                        }
                    })}
                    className="bg-[#bf2e2e] text-white cursor-pointer font-semibold py-2 px-4 rounded hover:bg-[#bf2e2e] transition duration-300"
                >
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
};

export default ThankYouPage;