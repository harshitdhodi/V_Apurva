"use client"

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import img1 from './images/contact-01.svg';
import img2 from './images/contact-02.svg';
import img3 from './images/contact-03.svg';

const ContactForm = () => {
    const [phoneNo, setPhoneNo] = useState("");
    const [openingHours, setOpeningHours] = useState("");
    const [address, setAddress] = useState("");
    const [addresslink, setAddresslink] = useState("");
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [clientIp, setClientIp] = useState('');
    const [utmParams, setUtmParams] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isMapVisible, setIsMapVisible] = useState(false);
    const mapRef = useRef(null);

    // Default Google Maps embed URL - replace with your actual location
    const DEFAULT_MAP_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.390259169117!2d77.22702231508336!3d28.61275098242474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin';

    // Fetch client IP and UTM parameters
    useEffect(() => {
        const fetchClientIp = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setClientIp(response.data.ip);
            } catch (error) {
                console.error('Error fetching IP address', error);
            }
        };

        fetchClientIp();

        // Only run on client side
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setUtmParams({
                utm_source: params.get('utm_source') || '',
                utm_medium: params.get('utm_medium') || '',
                utm_campaign: params.get('utm_campaign') || '',
                utm_id: params.get('utm_id') || '',
                gclid: params.get('gclid') || '',
                gcid_source: params.get('gcid_source') || '',
                utm_content: params.get('utm_content') || '',
                utm_term: params.get('utm_term') || '',
            });
        }
    }, []);

    // Fetch header and footer data
    useEffect(() => {
        const fetchHeader = async () => {
            try {
                const response = await axios.get('/api/header/getPhoneAndHours', { withCredentials: true });
                const header = response.data;
                setPhoneNo(header.phoneNo || "");
                setOpeningHours(header.openingHours || "");
            } catch (error) {
                console.error('Error fetching header:', error);
            }
        };

        const fetchFooter = async () => {
            try {
                const response = await axios.get('/api/footer/getAddressAndLocation', { withCredentials: true });
                const footer = response.data;
                setAddress(footer.address || "");
                setAddresslink(footer.addresslink || "");
                setLocation(footer.location || DEFAULT_MAP_URL);
            } catch (error) {
                console.error('Error fetching footer:', error);
            }
        };

        fetchHeader();
        fetchFooter();
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsMapVisible(true);
              observer.disconnect();
            }
          },
          {
            root: null,
            rootMargin: '200px',
            threshold: 0.1,
          }
        );

        observer.observe(mapRef.current);
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await axios.post('/api/inquiries/createInquiry', {
                name,
                email,
                phone,
                message,
                ipaddress: clientIp,
                ...utmParams,
            });

            setModalIsOpen(true);
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-center lg:items-start items-center p-4 gap-8">
            {/* Left Column - Contact Info */}
            <div className="w-full md:w-1/3 lg:w-[25%] lg:mt-20 flex flex-col gap-8">
                {/* Address Card */}
                <div className="border shadow border-[#ECEEF3]  hover:border-[#bf2e2e] rounded-lg p-12 transition-colors">
                    <div className="flex flex-col items-center  mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                            <img src={img1.src} alt="Address" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center">Address</h3>
                    </div>
                    <p className="text-gray-700 text-center">
                        {addresslink ? (
                            <a 
                                href={addresslink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-[#bf2e2e] transition-colors"
                            >
                                {address}
                            </a>
                        ) : (
                            <span>{address || 'N/A'}</span>
                        )}
                    </p>
                </div>

                {/* Phone Card */}
                <div className="border shadow border-[#ECEEF3] hover:border-[#bf2e2e] rounded-lg p-12 transition-colors">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                            <img src={img2.src} alt="Phone" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center">Phone Number</h3>
                    </div>
                    <p className="text-gray-700 text-center">
                        {phoneNo ? (
                            <a 
                                href={`tel:${phoneNo}`} 
                                className="hover:text-[#bf2e2e] transition-colors"
                            >
                                {phoneNo}
                            </a>
                        ) : 'N/A'}
                    </p>
                </div>

                {/* Email Card */}
                <div className="border shadow border-[#ECEEF3] hover:border-[#bf2e2e] rounded-lg p-12 transition-colors">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                            <img src={img3.src} alt="Email" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center">Email Address</h3>
                    </div>
                    <p className="text-gray-700 text-center">
                        {openingHours || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="w-full md:w-2/3 bg-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                        <p>{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <input
                                type="text"
                                placeholder="Enter your Name"
                                className="w-full p-4 border border-gray-100 rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] hover:border-[#bf2e2e] focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent placeholder-gray-400"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your Email address"
                                className="w-full p-4 border border-gray-100 rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] hover:border-[#bf2e2e] focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent placeholder-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <input
                            type="tel"
                            placeholder="Enter your Phone number"
                            className="w-full p-4 border border-gray-100 rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] hover:border-[#bf2e2e] focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent placeholder-gray-400"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder="Type your message"
                            rows="5"
                            className="w-full p-4 border border-gray-100 rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] hover:border-[#bf2e2e] focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent placeholder-gray-400"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-4 bg-[#bf2e2e] text-white font-medium rounded-lg hover:bg-[#a82626] transition-colors ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? 'Sending...' : 'SEND MESSAGE'}
                    </button>
                </form>

                {/* Google Maps iframe */}
                <div 
                    ref={mapRef}
                    className="mt-12 rounded-lg overflow-hidden bg-gray-100 min-h-[300px] flex items-center justify-center"
                >
                    {isMapVisible && location ? (
                        <iframe
                            src={location}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Location Map"
                            className="aspect-video w-full"
                        />
                    ) : (
                        <div className="text-gray-500">Loading map...</div>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {modalIsOpen && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
                        <button
                            onClick={() => setModalIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
                            aria-label="Close"
                        >
                            <X size={24} className="stroke-2" />
                        </button>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Thank You!</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Your message has been successfully sent. Our team will get back to you soon.
                            </p>
                            <button
                                onClick={() => setModalIsOpen(false)}
                                className="px-6 py-3 bg-[#bf2e2e] text-white rounded-lg hover:bg-[#a82626] transition-colors font-medium focus:ring-2 focus:ring-[#bf2e2e] focus:ring-offset-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactForm;