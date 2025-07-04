// File: MobileMenu.jsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, X, Grip, Facebook, Instagram, Youtube, Twitter, ChevronDown, Plus, Minus } from 'lucide-react';

function MobileMenu({
    isMenuOpen,
    toggleMenu,
    menuItems = [],
    handleMenuItemClick,
    colorlogo = {},
    phoneNo = "",
    address = "",
    addresslink = "#",
    email = "",
    email2 = "",
    facebooklink = "#",
    twitterlink = "#",
    linkedinlink = "#",
    youtubelink = "#",
    productCategories = []
}) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openSubDropdown, setOpenSubDropdown] = useState(null);
    const menuItemsRef = useRef(menuItems);
    const productCategoriesRef = useRef(Array.isArray(productCategories) ? productCategories : []);

    // Update refs when props change
    useEffect(() => {
        menuItemsRef.current = Array.isArray(menuItems) ? menuItems : [];
        productCategoriesRef.current = Array.isArray(productCategories) ? productCategories : [];
    }, [menuItems, productCategories]);

    const toggleDropdown = useCallback((index) => {
        setOpenDropdown(prev => prev === index ? null : index);
        setOpenSubDropdown(null);
    }, []);

    const toggleSubDropdown = useCallback((index) => {
        setOpenSubDropdown(prev => prev === index ? null : index);
    }, []);

    const renderMenuItems = useCallback((items, level = 0) => {
        if (!Array.isArray(items) || items.length === 0) return null;
        
        return items.map((item, index) => {
            if (!item || typeof item !== 'object') return null;
            
            const hasChildren = (item.subItems && item.subItems.length > 0) || 
                              (item.pagename && typeof item.pagename === 'string' && 
                               item.pagename.toLowerCase().includes('product') && 
                               productCategoriesRef.current.length > 0);
                               
            const isOpen = openDropdown === index;
            const isSubOpen = openSubDropdown === index;
            const isProductMenu = item.pagename && typeof item.pagename === 'string' && 
                                item.pagename.toLowerCase().includes('product');

            return (
                <div key={`${level}-${index}`} className="w-full">
                    <div 
                        className={`flex items-center justify-between py-3 px-4 text-gray-700 hover:bg-gray-100 ${level > 0 ? 'pl-8' : ''}`}
                        onClick={() => {
                            if (hasChildren) {
                                toggleDropdown(index);
                            } else if (item.path) {
                                handleMenuItemClick(item.path);
                                toggleMenu();
                            }
                        }}
                    >
                        <span className="flex-1">{item.pagename || 'Untitled'}</span>
                        {hasChildren && (
                            <span className="ml-2">
                                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                            </span>
                        )}
                    </div>

                    {isOpen && hasChildren && (
                        <div className="bg-gray-50">
                            {isProductMenu ? (
                                productCategoriesRef.current.length > 0 ? (
                                    productCategoriesRef.current.map((category, catIndex) => (
                                        <a
                                            key={`cat-${catIndex}`}
                                            href={`/products/${category.slug || ''}`}
                                            className="block py-3 px-8 text-gray-600 hover:bg-gray-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMenu();
                                            }}
                                        >
                                            {category.category || 'Unnamed Category'}
                                        </a>
                                    ))
                                ) : (
                                    <div className="py-3 px-8 text-gray-500">No categories available</div>
                                )
                            ) : (
                                item.subItems && renderMenuItems(item.subItems, level + 1)
                            )}
                        </div>
                    )}
                </div>
            );
        });
    }, [openDropdown, openSubDropdown, toggleDropdown, toggleSubDropdown, toggleMenu, handleMenuItemClick]);

    return (
        <div className='flex items-center justify-between px-4 py-1 lg:px-6 lg:py-4 w-full lg:hidden'>
            <a href="/" className='flex items-center w-fit'>
                <img 
                    src={`/api/logo/download/${colorlogo.photo}`} 
                    alt={colorlogo.alt} 
                    title={colorlogo.imgTitle} 
                    className="w-auto object-contain max-w-[150px] min-w-[100px] max-h-[100px] min-h-[40px]"
                />
            </a>
            
            <div className='flex gap-8 justify-center items-center'>
                <div className='hidden md:flex xl:hidden gap-2 justify-center items-center  py-4 px-6'>
                    <Grip className='w-5 h-5 text-[#bf2e2e]' />
                    <p className='uppercase text-gray-500 font-bold'>
                        Help Desk :
                        <span className='font-bold text-black'>
                            <a href={`tel:${phoneNo}`} className='text-black'>{phoneNo}</a>
                        </span>
                    </p>
                </div>
                <div onClick={toggleMenu}>
                    {isMenuOpen ? (
                        <X className="w-6 h-6 text-gray-700" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-700" />
                    )}
                </div>
            </div>
            
            {/* Mobile menu content */}
            {isMenuOpen && (
                <div 
                    className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    style={{ top: '0', overflowY: 'auto' }}
                >
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <a href="/" className='flex items-center w-fit' onClick={toggleMenu}>
                                <img 
                                    src={`/api/logo/download/${colorlogo.photo}`} 
                                    alt={colorlogo.alt} 
                                    title={colorlogo.imgTitle} 
                                    className="w-auto object-contain max-w-[150px] min-w-[100px] max-h-[100px] min-h-[40px]"
                                />
                            </a>
                            <button 
                                onClick={toggleMenu}
                                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex-1 overflow-y-auto">
                            <nav className="py-2">
                                {renderMenuItems(menuItemsRef.current)}
                            </nav>
                        </div>

                        <div className='flex flex-col w-full space-y-5 lg:hidden'>
                            <div className='text-white space-y-3 pt-10'>
                                <p className='text-xl uppercase text-gray-400'>Contact Us</p>
                                <div className='flex gap-2 items-center'>
                                    <a href={addresslink} target='_blank' className='hover:text-blue-500 w-[90%]'>{address}</a>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <a href={`tel:${phoneNo}`} className='hover:text-blue-500 w-[90%]'>{phoneNo}</a>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <a href={`mailto:${email}`} className='hover:text-blue-500 w-[90%]'>{email}</a>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <a href={`mailto:${email2}`} className='hover:text-blue-500 w-[90%]'>{email2}</a>
                                </div>
                            </div>
                            
                            <div className='flex justify-center items-center space-x-5'>
                                <a href={facebooklink} target='_blank' className="text-gray-400 hover:text-blue-500"><Facebook /></a>
                                <a href={twitterlink} target='_blank' className="text-gray-400 hover:text-blue-500"><Twitter /></a>
                                <a href={linkedinlink} target='_blank' className="text-gray-400 hover:text-blue-500"><Instagram /></a>
                                <a href={youtubelink} target='_blank' className="text-gray-400 hover:text-blue-500"><Youtube /></a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MobileMenu;
