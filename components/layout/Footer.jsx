'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

// Skeleton component for loading states
const Skeleton = ({ className }) => {
  return <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>;
};

const Footer = () => {
    const [footerData, setFooterData] = useState({});
    const [headerData, setHeaderData] = useState({});
    const [whitelogo, setWhiteLogo] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [footerResponse, headerResponse, logoResponse] = await Promise.all([
                    axios.get('/api/footer/getFooter'),
                    axios.get('/api/header/getHeader'),
                    axios.get('/api/logo/footerwhite')
                ]);

                setFooterData(footerResponse.data || {});
                setHeaderData(headerResponse.data || {});
                setWhiteLogo(logoResponse.data);
            } catch (error) {
                console.error("Error fetching footer or header data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <footer className="bg-gray-100 text-gray-800 pt-12 pb-8 lg:px-5 xl:px-10">
            <div className="px-4 md:px-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div>
                        <Link href="/">
                            {loading ? (
                                <Skeleton className="h-16 w-24 md:w-32" />
                            ) : whitelogo ? (
                                <div className="relative w-1/2 md:w-[6cm] h-16">
                                    <Image
                                        src={`/api/logo/download/${whitelogo.photo}`}
                                        alt={whitelogo.alt || "Logo"}
                                        title={whitelogo.imgTitle || "Company Logo"}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 50vw, 150px"
                                        priority
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-500">Logo unavailable</p>
                            )}
                        </Link>
                        {loading ? (
                            <div className="mt-6 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ) : (
                            <p className='mt-6 text-sm text-[#bf2e2e] font-semibold'>"{footerData.description || "Company description goes here."}"</p>
                        )}
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h5 className="text-lg font-bold mb-4">Useful Links</h5>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                <li><Link href='/about-us' className="hover:text-blue-600">About us</Link></li>
                                <li><Link href="/blogs" className="hover:text-blue-600">Blogs</Link></li>
                                <li><Link href="/contact-us" className="hover:text-blue-600">Contact us</Link></li>
                            </ul>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h5 className="text-lg font-bold mb-4">Contact Info</h5>
                        {loading ? (
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="mr-2 h-4 w-4 bg-gray-300 rounded-full"></div>
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-2 h-4 w-4 bg-gray-300 rounded-full"></div>
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-2 h-4 w-4 bg-gray-300 rounded-full"></div>
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                <li>
                                    <a href={footerData.addresslink} target='_blank' rel="noopener noreferrer" className="hover:text-blue-600 flex items-start">
                                        <MapPin className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <span>{footerData.address || "Company Address"}</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={`tel:${footerData.phoneNo}`} className="hover:text-blue-600 flex items-center">
                                        <Phone className="mr-2 h-4 w-4" />
                                        <span>{footerData.phoneNo || "N/A"}</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:${footerData.email}`} className="hover:text-blue-600 flex items-center">
                                        <Mail className="mr-2 h-4 w-4" />
                                        <span>{footerData.email || "N/A"}</span>
                                    </a>
                                </li>
                                {footerData.email2 && (
                                    <li>
                                        <a href={`mailto:${footerData.email2}`} className="hover:text-blue-600 flex items-center">
                                            <Mail className="mr-2 h-4 w-4" />
                                            <span>{footerData.email2}</span>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Location Map */}
                    <div>
                        <h5 className="text-lg font-bold mb-4">Location</h5>
                        {loading ? (
                            <Skeleton className="h-40 w-full rounded-md" />
                        ) : (
                            <div className="aspect-video">
                                <iframe
                                    src={footerData.location || ""}
                                    className='border-0 w-full h-full rounded-md'
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Company Location"
                                ></iframe>
                            </div>
                        )}
                        <div className='flex justify-between items-center space-x-4 float-end max-w-5xl text-gray-500 mt-6 text-sm space-y-2'>
                            <Link href="/privacy-policy" className='hover:text-gray-700'>Privacy Policy</Link>
                            <Link href="/terms-and-conditions" className='hover:text-gray-700'>Terms & Conditions</Link>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="flex justify-end space-x-4 mt-8 pr-5">
                    {loading ? (
                        <div className="flex space-x-4">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            {headerData.facebooklink && (
                                <a href={headerData.facebooklink} target='_blank' rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {headerData.twitterlink && (
                                <a href={headerData.twitterlink} target='_blank' rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                            )}
                            {headerData.linkedinlink && (
                                <a href={headerData.linkedinlink} target='_blank' rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {headerData.youtubelink && (
                                <a href={headerData.youtubelink} target='_blank' rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">
                                    <Youtube className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Copyright */}
                <div className="text-gray-500 font-semibold mt-8 text-center pt-10">
                    <p>
                        Copyright {currentYear} © Apurva Chemicals Pvt. Ltd. All Rights Reserved.
                        <br className="sm:hidden" />
                        <span className="hidden sm:inline"> </span>
                        Designed & Developed by{' '}
                        <a 
                            href="https://rndtechnosoft.com/" 
                            target='_blank' 
                            rel="noopener noreferrer"
                            className="text-blue-600 font-bold hover:underline"
                        >
                            RnD Technosoft
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
