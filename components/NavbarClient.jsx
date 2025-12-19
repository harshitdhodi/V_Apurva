// app/components/ClientNavbar.jsx (Client Component with Click Tracking)
"use client";

import React, { useState, useEffect, useRef } from 'react';
// Import components
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import ContactUsInquiryForm from './ContactUsInquiryForm';
import ScrollToTopButton from './ScrollToTopButton';
import { useClickTracking } from '@/lib/useClickTracking';

function ClientNavbar({
phoneNo,
openingHours,
facebooklink,
twitterlink,
youtubelink,
linkedinlink,
address,
addresslink,
email,
email2,
menuItems,
blogCategories,
productCategories,
colorLogo
}) {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [showInquiryForm, setShowInquiryForm] = useState(false);
const [showUpIcon, setShowUpIcon] = useState(false);
const [isClient, setIsClient] = useState(false);
const upIconRef = useRef(null);

// Click tracking hook
const { trackEvent } = useClickTracking();

// Helper functions
const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    // Track menu toggle
    trackEvent('button_click', {
      buttonName: isMenuOpen ? 'mobile_menu_close' : 'mobile_menu_open',
      metadata: {
        device: 'mobile',
        action: isMenuOpen ? 'close' : 'open'
      }
    });
};

const handleMenuItemClick = (path, itemName) => {
    // Track menu item click
    trackEvent('button_click', {
      buttonName: `menu_item_${itemName}`,
      metadata: {
        menuItem: itemName,
        path: path,
        device: isClient ? 'desktop' : 'mobile'
      }
    });
    
    window.location.href = path;
    setIsMenuOpen(false);
};

const handleInquiryFormOpen = () => {
    // Track inquiry form open from navbar
    trackEvent('button_click', {
      buttonName: 'navbar_inquiry_button',
      metadata: {
        source: 'navbar',
        device: 'desktop'
      }
    });
    
    setShowInquiryForm(true);
};

const handleInquiryFormClose = () => {
    // Track inquiry form close
    trackEvent('button_click', {
      buttonName: 'inquiry_form_close',
      metadata: {
        source: 'navbar',
        action: 'modal_closed'
      }
    });
    
    setShowInquiryForm(false);
};

const scrollToTop = () => {
    // Track scroll to top button click
    trackEvent('button_click', {
      buttonName: 'scroll_to_top',
      metadata: {
        action: 'scrolled_to_top'
      }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Initialize client-side functionality
useEffect(() => {
    setIsClient(true);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Initialize scroll event listener
    const handleScroll = () => {
    if (window.scrollY > 300) {
        setShowUpIcon(true);
    } else {
        setShowUpIcon(false);
    }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Handle inquiry form modal scroll behavior
useEffect(() => {
    if (showInquiryForm) {
    document.body.style.overflow = 'hidden';
    } else {
    document.body.style.overflow = '';
    }

    return () => {
    document.body.style.overflow = '';
    };
}, [showInquiryForm]);

// Handle mobile menu scroll behavior
useEffect(() => {
    if (isMenuOpen) {
    document.body.style.overflow = 'hidden';
    } else {
    document.body.style.overflow = 'auto';
    }

    return () => {
    document.body.style.overflow = 'auto';
    };
}, [isMenuOpen]);

// Show loading state during hydration
if (!isClient) {
    return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="h-12 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="hidden md:flex space-x-8">
            {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
            ))}
        </div>
        <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full md:hidden"></div>
        </div>
    </div>
    );
}

return (
    <>
    <div className='sticky top-0 z-50 bg-white w-full border-b-2'>
        {showInquiryForm && (
        <ContactUsInquiryForm onClose={handleInquiryFormClose} />
        )}
        
        {/* Mobile Menu */}
        <MobileMenu 
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        menuItems={menuItems}
        handleMenuItemClick={handleMenuItemClick}
        colorlogo={colorLogo}
        phoneNo={phoneNo}
        address={address}
        addresslink={addresslink}
        email={email}
        email2={email2}
        facebooklink={facebooklink}
        twitterlink={twitterlink}
        linkedinlink={linkedinlink}
        youtubelink={youtubelink}
        productCategories={productCategories}
        trackEvent={trackEvent}
        />

        {/* Desktop Menu */}
        <DesktopMenu 
        menuItems={menuItems}
        handleMenuItemClick={handleMenuItemClick}
        colorlogo={colorLogo}
        phoneNo={phoneNo}
        setShowInquiryForm={handleInquiryFormOpen}
        productCategories={productCategories}
        trackEvent={trackEvent}
        />
    </div>

    {/* Scroll-to-top icon */}
    {showUpIcon && (
        <ScrollToTopButton ref={upIconRef} onClick={scrollToTop} />
    )}
    </>
);
}

export default ClientNavbar;