"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Grip ,ArrowDown } from 'lucide-react';
import Link from 'next/link';

function DesktopMenu({ menuItems, handleMenuItemClick, colorlogo, phoneNo, setShowInquiryForm, productCategories = [], isLoading = false }) {
console.log(menuItems)
    const logoUrl = colorlogo?.photo ? `/api/logo/download/${colorlogo.photo}` : '';


    // Ensure productCategories is always an array
    const safeProductCategories = Array.isArray(productCategories) ? productCategories : [];

    if (isLoading) {
        return (
            <div className="hidden lg:block">
                <div className="flex items-center w-full bg-white font-semibold">
                    <div className="w-[20%] h-24 flex justify-center items-center px-4">
                        <div className="w-32 h-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="w-[80%] flex flex-col border-l">
                        <div className="border-b">
                            <div className="flex justify-end items-center gap-6 px-8 py-4">
                                <div className="h-5 w-36 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                        </div>
                        <div className="lg:flex justify-between -mb-[2px] items-center hidden">
                            <div className="hidden lg:flex items-center justify-center space-x-8 pl-8 uppercase font-bold">
                                {Array(5).fill().map((_, index) => (
                                    <div key={index} className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                                ))}
                            </div>
                            <div className="flex items-center border-t-1 border-gray-400 -mt-[2px] h-full">
                                <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='hidden lg:block w-full'>
            <div className='flex items-center w-full bg-white font-semibold'>
                <a href="/" className='w-[20%] h-24 flex justify-center items-center px-4'>
                    {logoUrl && (
                        <div className="relative w-56 h-24">
                            <Image
                                src={logoUrl}
                                alt={colorlogo?.alt || 'Company Logo'}
                                title={colorlogo?.imgTitle || 'Company Logo'}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 150px, 192px"
                                priority={true}
                                quality={100}
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo="
                            />
                        </div>
                    )}
                </a>

                <div className='w-[80%] flex flex-col border-l'>
                    <div className='border-b'>
                        <div className='flex justify-end items-center gap-6 px-8 py-4'>
                            <div className='flex gap-2 justify-center items-center'>
                                <Grip className='text-[#bf2e2e] w-5 h-5' />
                                <p className='uppercase text-gray-500 font-bold'>
                                    Help Desk :
                                    <a href={`tel:${phoneNo}`} className='ml-1 text-black hover:text-blue-500'>{phoneNo}</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-between items-center'>
                        <div className='flex items-center space-x-8 pl-8 py-2'>
                            {menuItems.map((item, index) => (
                                <DesktopMenuItem
                                    key={index}
                                    item={item}
                                    productCategories={safeProductCategories}
                                />
                            ))}
                        </div>

                        <div className='flex items-center h-full'>
                            {/* <Link href="/contact-us"> */}
                            <button
                                onClick={() => setShowInquiryForm(true)}
                                className='border cursor-pointer border-gray-400 px-8 bg-[#bf2e2e] text-white h-full py-4 uppercase hover:bg-[#cd1d1d] transition-colors duration-300'
                            >
                                Inquiry Now
                            </button>
                            {/* </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DesktopMenuItem({ item, productCategories = [] }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hoverTimeoutRef = useRef(null);

    // Ensure productCategories is always an array
    const safeProductCategories = Array.isArray(productCategories) ? productCategories : [];
    const isProductsMenu = item.pagename?.toLowerCase().includes('product');
    const hasSubItems = (item.subItems && item.subItems.length > 0) || (isProductsMenu && safeProductCategories.length > 0);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        if (hasSubItems) {
            hoverTimeoutRef.current = setTimeout(() => {
                setIsDropdownOpen(true);
            }, 200);
        }
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200);
    };

    // Handle click on menu item
    const handleClick = (e) => {
        if (hasSubItems) {
            e.preventDefault();
            e.stopPropagation();
            
            // If it's the Products menu, redirect to dye-intermediate
            if (isProductsMenu) {
                window.location.href = '/dye-intermediate';
            } else {
                // For other menus with sub-items, toggle the dropdown
                setIsDropdownOpen(!isDropdownOpen);
            }
        }
    };

    return (
        <div 
            ref={dropdownRef}
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center">
                <Link
                    href={hasSubItems ? '' : (item.path || '')}
                    onClick={handleClick}
                    className={`px-4 py-2 text-md uppercase font-bold text-black hover:text-secondary flex items-center ${
                        isDropdownOpen ? 'text-secondary' : ''
                    }`}
                >
                    {item.pagename}
                    {hasSubItems && (
                        <ArrowDown 
                            className={`ml-1 transition-transform duration-200 ${
                                isDropdownOpen ? 'transform rotate-180' : ''
                            }`} 
                            size={16} 
                        />
                    )}
                </Link>
            </div>

            {isDropdownOpen && (isProductsMenu ? (
                <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                        {safeProductCategories.map((category, index) => (
                            <Link
                                key={index}
                                href={`/${category.slug || ''}`}
                                className="block px-4 py-2 text-md text-[#a31010] hover:bg-gray-100 hover:text-secondary uppercase"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                {category.category || 'Unnamed Category'}
                            </Link>
                        ))}
                    </div>
                </div>
            ) : item.subItems && item.subItems.length > 0 ? (
                <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                        {item.subItems.map((subItem, index) => (
                            <Link
                                key={index}
                                href={subItem.path || '#'}
                                className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-secondary"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                {subItem.pagename}
                            </Link>
                        ))}
                    </div>
                </div>
            ) : null)}
        </div>
    );
}

export default DesktopMenu;