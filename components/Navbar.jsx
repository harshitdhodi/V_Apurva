"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// Import components
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import ContactUsInquiryForm from './ContactUsInquiryForm';
import ScrollToTopButton from './ScrollToTopButton';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [menuListings, setMenuListings] = useState([]);
    const [productcategories, setProductCategories] = useState([]);
    const [blogcategories, setBlogCategories] = useState([]);
    const [colorlogo, setColorLogo] = useState([]);
    
    // Header/Footer state
    const [phoneNo, setPhoneNo] = useState("");
    const [openingHours, setOpeningHours] = useState("");
    const [address, setAddress] = useState("");
    const [addresslink, setAddresslink] = useState("");
    const [email, setEmail] = useState("");
    const [email2, setEmail2] = useState("");
    const [facebooklink, setFacebooklink] = useState("");
    const [twitterlink, setTwitterlink] = useState("");
    const [youtubelink, setYoutubelink] = useState("");
    const [linkedinlink, setLinkedinlink] = useState("");

    // Scroll to top functionality
    const [showUpIcon, setShowUpIcon] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const upIconRef = useRef(null);

    // Data fetching functions
    const fetchHeader = async () => {
        try {
            const response = await axios.get('/api/header');
            const data = response.data;
            setPhoneNo(data.phoneNo || "");
            setOpeningHours(data.openingHours || "");
            setFacebooklink(data.facebooklink || "");
            setTwitterlink(data.twitterlink || "");
            setYoutubelink(data.youtubelink || "");
            setLinkedinlink(data.linkedinlink || "");
        } catch (error) {
            console.error('Error fetching header data:', error);
        }
    };

    const fetchFooterData = async () => {
        try {
            const response = await axios.get('/api/footer');
            const data = response.data;
            setAddress(data.address || "");
            setAddresslink(data.addresslink || "");
            setEmail(data.email || "");
            setEmail2(data.email2 || "");
        } catch (error) {
            console.error('Error fetching footer data:', error);
        }
    };

    const fetchMenuListings = async () => {
        try {
            const response = await axios.get('/api/menu/getMenulisting');
            console.log(response.data);
            if (response.data && typeof response.data === 'object') {
                setMenuListings(response.data.menuListings || []);
            } else {
                console.warn('Invalid menu listings data format');
                setMenuListings([]);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                console.warn('Menu listings endpoint not found');
            } else {
                console.error('Error fetching menu listings:', error);
            }
            setMenuListings([]);
        }
    };

    const fetchBlogCategories = async () => {
        try {
            const response = await axios.get('/api/news/getCategoryAndPhoto');
            setBlogCategories(response.data || []);
        } catch (error) {
            console.error('Error fetching blog categories:', error);
        }
    };

    const fetchProductCategories = async () => {
        try {
            const response = await axios.get('/api/product/getCategoryAndPhoto');
            console.log(response.data.data);
            setProductCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching product categories:', error);
        }
    };

    const fetchHeaderColorLogo = async () => {
        try {
            const response = await axios.get('/api/logo/header-color');
            setColorLogo(response.data || []);
        } catch (error) {
            console.error('Error fetching header color logo:', error);
        }
    };

    // Helper functions
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuItemClick = (path) => {
        window.location.href = path;
        setIsMenuOpen(false);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Process menu items
    const menuPaths = {
        about: "/about-us",
        contact: "/contact-us",
        blog: "/blogs"
    };

    const menuItems = (menuListings || []).map((item) => {
        if (!item || !item.pagename) return null;

        const pagenameLower = item.pagename.toLowerCase();
        let path = item.path || '';

        // Check the page name and set the path accordingly
        if (pagenameLower.includes('about')) {
            path = menuPaths.about;
        } else if (pagenameLower.includes('blog')) {
            path = menuPaths.blog;
        } else if (pagenameLower.includes('products')) {
            path = menuPaths.product;
        } else if (pagenameLower.includes('contact')) {
            path = menuPaths.contact;
        }

        // Add subItems for 'Product' if categories and subcategories are available
        if ((item.pagename === 'Product' || item.pagename === 'Products') && productcategories.length > 0) {
            return {
                ...item,
                path,
                subItems: productcategories.map(category => ({
                    title: category.category || '',
                    path: `/${category.slug || ''}`,
                }))
            };
        }

        return {
            ...item,
            path
        };
    }).filter(Boolean);

    // Fetch data on component mount
    useEffect(() => {
        setIsClient(true);
        
        const initialize = () => {
            fetchHeader();
            fetchFooterData();
            fetchMenuListings();
            fetchBlogCategories();
            fetchProductCategories();
            fetchHeaderColorLogo();
            
            // Scroll to top when pathname changes
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
        };
        
        initialize();
        
        // Cleanup function
        return () => {
            // Any cleanup code if needed
        };
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

    // Show loading state on server
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
                    <ContactUsInquiryForm onClose={() => setShowInquiryForm(false)} />
                )}
                
                {/* Mobile Menu */}
                <MobileMenu 
                    isMenuOpen={isMenuOpen}
                    toggleMenu={toggleMenu}
                    menuItems={menuItems}
                    handleMenuItemClick={handleMenuItemClick}
                    colorlogo={colorlogo}
                    phoneNo={phoneNo}
                    address={address}
                    addresslink={addresslink}
                    email={email}
                    email2={email2}
                    facebooklink={facebooklink}
                    twitterlink={twitterlink}
                    linkedinlink={linkedinlink}
                    youtubelink={youtubelink}
                    productCategories={productcategories}
                />

                {/* Desktop Menu */}
                <DesktopMenu 
                    menuItems={menuItems}
                    handleMenuItemClick={handleMenuItemClick}
                    colorlogo={colorlogo}
                    phoneNo={phoneNo}
                    setShowInquiryForm={setShowInquiryForm}
                    productCategories={productcategories}
                />
            </div>

            {/* Scroll-to-top icon */}
            {showUpIcon && (
                <ScrollToTopButton ref={upIconRef} onClick={scrollToTop} />
            )}
        </>
    );
}

export default Navbar;
