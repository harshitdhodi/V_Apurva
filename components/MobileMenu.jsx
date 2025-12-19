"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Grip, Menu, X, Plus, Minus, Facebook, Twitter, Instagram, Youtube, ChevronDown, ChevronUp } from 'lucide-react';
import { useClickTracking } from '@/lib/useClickTracking';

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
    
    // Click tracking hook
    const { trackEvent } = useClickTracking();

    // Update refs when props change
    useEffect(() => {
        menuItemsRef.current = Array.isArray(menuItems) ? menuItems : [];
        productCategoriesRef.current = Array.isArray(productCategories) ? productCategories : [];
    }, [menuItems, productCategories]);

    const toggleDropdown = useCallback((index, itemName) => {
        const isOpening = openDropdown !== index;
        
        // Track dropdown toggle
        trackEvent('button_click', {
            buttonName: `mobile_menu_dropdown_${itemName}`,
            metadata: {
                menuItem: itemName,
                device: 'mobile',
                action: isOpening ? 'open' : 'close',
                dropdownLevel: 'primary'
            }
        });
        
        setOpenDropdown(prev => prev === index ? null : index);
        setOpenSubDropdown(null);
    }, [openDropdown, trackEvent]);

    const toggleSubDropdown = useCallback((index, subItemName) => {
        const isOpening = openSubDropdown !== index;
        
        // Track sub-dropdown toggle
        trackEvent('button_click', {
            buttonName: `mobile_menu_subdropdown_${subItemName}`,
            metadata: {
                subMenuItem: subItemName,
                device: 'mobile',
                action: isOpening ? 'open' : 'close',
                dropdownLevel: 'secondary'
            }
        });
        
        setOpenSubDropdown(prev => prev === index ? null : index);
    }, [openSubDropdown, trackEvent]);

    const handleMenuItemClickWithTracking = (path, itemName, level) => {
        // Track menu item click
        trackEvent('button_click', {
            buttonName: `mobile_menu_item_${itemName}`,
            metadata: {
                menuItem: itemName,
                path: path,
                device: 'mobile',
                level: level
            }
        });
        
        handleMenuItemClick(path);
    };

    const handleAddressClick = () => {
        trackEvent('button_click', {
            buttonName: 'mobile_contact_address',
            metadata: {
                address: address,
                device: 'mobile',
                source: 'mobile_menu_contact'
            }
        });
    };

    const handlePhoneClick = () => {
        trackEvent('button_click', {
            buttonName: 'mobile_contact_phone',
            metadata: {
                phone: phoneNo,
                device: 'mobile',
                source: 'mobile_menu_contact'
            }
        });
    };

    const handleEmailClick = (emailAddress) => {
        trackEvent('button_click', {
            buttonName: 'mobile_contact_email',
            metadata: {
                email: emailAddress,
                device: 'mobile',
                source: 'mobile_menu_contact'
            }
        });
    };

    const handleSocialClick = (socialName) => {
        trackEvent('button_click', {
            buttonName: `mobile_social_${socialName}`,
            metadata: {
                social: socialName,
                device: 'mobile',
                source: 'mobile_menu_footer'
            }
        });
    };

    return (
        <div className='flex items-center justify-between px-4 py-1 lg:px-6 lg:py-4 w-full lg:hidden'>
            <a href="/" className='flex items-center'>
                <img 
                    src={`/api/logo/download/${colorlogo.photo}`} 
                    alt={colorlogo.alt} 
                    title={colorlogo.imgTitle} 
                    className='lg:w-1/2 w-[30%] lg:h-[70%] h-[50%]'
                />
            </a>
            <div className='flex gap-8 justify-center items-center'>
                <div className='hidden md:flex xl:hidden gap-2 justify-center items-center  py-4 px-6'>
                    <Grip className='text-[#BE2D2D]' size={20} />
                    <p className='uppercase text-gray-500 font-bold'>
                        Help Desk :
                        <span className='font-bold text-black'>
                            <a 
                                href={`tel:${phoneNo}`} 
                                className='text-black'
                                onClick={handlePhoneClick}
                            >
                                {phoneNo}
                            </a>
                        </span>
                    </p>
                </div>
                <div onClick={toggleMenu}>
                    <Menu size={32} className={`${isMenuOpen ? 'hidden' : 'block'} text-black` } />
                </div>
            </div>
            {/* Mobile Menu Content */}
            {isMenuOpen && (
                <div className='fixed top-0 right-0 h-full bg-gray-900 z-10 flex flex-col overflow-y-auto p-8 w-[90%]'>
                    <div className='flex justify-between h-[15%] mb-6'>
                        <a href="/" className=''>
                            <img 
                                src={`/api/logo/download/${colorlogo.photo}`} 
                                alt={colorlogo.alt} 
                                title={colorlogo.imgTitle} 
                                className='h-full object-contain'
                            />
                        </a>
                        <X 
                            size={32} 
                            className='text-white relative -top-5 cursor-pointer' 
                            onClick={() => {
                                trackEvent('button_click', {
                                    buttonName: 'mobile_menu_close',
                                    metadata: {
                                        device: 'mobile',
                                        action: 'close'
                                    }
                                });
                                toggleMenu();
                            }}
                        />
                    </div>
                    <ul className='flex flex-col w-full'>
                        {menuItemsRef.current.map((item, index) => (
                            <li 
                                key={index} 
                                className={`flex flex-col items-center ${index !== menuItemsRef.current.length - 1 ? 'border-b border-gray-700' : ''} w-full p-2`}
                            >
                                <div 
                                    className='flex justify-between items-center text-white w-full uppercase' 
                                >
                                    <div 
                                        onClick={() => {
                                            if (item.subItems && item.subItems.length > 0) {
                                                toggleDropdown(index, item.pagename);
                                            } else {
                                                handleMenuItemClickWithTracking(item.path, item.pagename, 'primary');
                                            }
                                        }}
                                        className='flex-1'
                                    >
                                        {item.pagename}
                                    </div>
                                    {item.subItems && (
                                        <div 
                                            className='cursor-pointer'
                                            onClick={() => toggleDropdown(index, item.pagename)}
                                        >
                                            {openDropdown === index ? (
                                                <ChevronUp size={25} className='text-primary transition-all duration-500' />
                                            ) : (
                                                <ChevronDown size={25} className='transition-all duration-500' />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {item.subItems && openDropdown === index && (
                                    <ul className='flex flex-col text-white items-center space-y-2 w-full pl-4'>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <li 
                                                key={subIndex} 
                                                className={`w-full py-2 ${subIndex !== item.subItems.length - 1 ? 'border-b border-gray-700' : ''}`}
                                            >
                                                <div 
                                                    className='flex justify-between items-center'
                                                >
                                                    <div 
                                                        onClick={() => {
                                                            if (subItem.subsubItems && subItem.subsubItems.length > 0) {
                                                                toggleSubDropdown(subIndex, subItem.title);
                                                            } else {
                                                                handleMenuItemClickWithTracking(subItem.path, subItem.title, 'secondary');
                                                            }
                                                        }}
                                                        className='flex-1'
                                                    >
                                                        {subItem.title}
                                                    </div>
                                                    {subItem.subsubItems && (
                                                        <div 
                                                            className='cursor-pointer'
                                                            onClick={() => toggleSubDropdown(subIndex, subItem.title)}
                                                        >
                                                            {openSubDropdown === subIndex ? (
                                                                <ChevronUp size={20} className='text-primary' />
                                                            ) : (
                                                                <ChevronDown size={20} />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {subItem.subsubItems && openSubDropdown === subIndex && (
                                                    <ul className='flex flex-col text-white items-center space-y-2 w-full pl-4 mt-2'>
                                                        {subItem.subsubItems.map((subsubItem, subsubIndex) => (
                                                            <li key={subsubIndex} className='w-full py-2'>
                                                                <div 
                                                                    onClick={() => handleMenuItemClickWithTracking(subsubItem.path, subsubItem.title, 'tertiary')}
                                                                >
                                                                    {subsubItem.title}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className='flex flex-col w-full space-y-5 lg:hidden'>
                        <div className='text-white space-y-3 pt-10'>
                            <p className='text-xl uppercase text-gray-400'>Contact Us</p>
                            <div className='flex gap-2 items-center'>
                                <a 
                                    href={addresslink} 
                                    target='_blank' 
                                    className='hover:text-blue-500 w-[90%]'
                                    onClick={handleAddressClick}
                                >
                                    {address}
                                </a>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <a 
                                    href={`tel:${phoneNo}`} 
                                    className='hover:text-blue-500 w-[90%]'
                                    onClick={handlePhoneClick}
                                >
                                    {phoneNo}
                                </a>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <a 
                                    href={`mailto:${email}`} 
                                    className='hover:text-blue-500 w-[90%]'
                                    onClick={() => handleEmailClick(email)}
                                >
                                    {email}
                                </a>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <a 
                                    href={`mailto:${email2}`} 
                                    className='hover:text-blue-500 w-[90%]'
                                    onClick={() => handleEmailClick(email2)}
                                >
                                    {email2}
                                </a>
                            </div>
                        </div>
                        <div className='flex justify-center items-center space-x-5'>
                            <a 
                                href={facebooklink} 
                                target='_blank' 
                                className="text-gray-400 hover:text-blue-500"
                                onClick={() => handleSocialClick('facebook')}
                            >
                                <Facebook />
                            </a>
                            <a 
                                href={twitterlink} 
                                target='_blank' 
                                className="text-gray-400 hover:text-blue-500"
                                onClick={() => handleSocialClick('twitter')}
                            >
                                <Twitter />
                            </a>
                            <a 
                                href={linkedinlink} 
                                target='_blank' 
                                className="text-gray-400 hover:text-blue-500"
                                onClick={() => handleSocialClick('linkedin')}
                            >
                                <Instagram />
                            </a>
                            <a 
                                href={youtubelink} 
                                target='_blank' 
                                className="text-gray-400 hover:text-blue-500"
                                onClick={() => handleSocialClick('youtube')}
                            >
                                <Youtube />
                            </a>
                        </div>
                    </div>  
                </div>
            )}
        </div>
    );
}

export default MobileMenu;