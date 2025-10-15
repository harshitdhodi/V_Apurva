"use client"

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, AlertCircle } from 'lucide-react';

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

    // Validation errors state
    const [validationErrors, setValidationErrors] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const DEFAULT_MAP_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.390259169117!2d77.22702231508336!3d28.61275098242474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin';

    // Validation functions
    const validateName = (value) => {
        const trimmedValue = value.trim();
        
        if (!trimmedValue) {
            return 'Name is required.';
        }
        
        // Check for only alphabets and spaces
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(trimmedValue)) {
            return 'Please enter a valid name using letters only.';
        }
        
        if (trimmedValue.length > 50) {
            return 'Name is too long. Please limit to 50 characters.';
        }
        
        if (trimmedValue.length < 2) {
            return 'Name must be at least 2 characters.';
        }
        
        return '';
    };

    const validateEmail = (value) => {
        const trimmedValue = value.trim();
        
        if (!trimmedValue) {
            return 'Email is required.';
        }
        
        // RFC 5322 compliant email regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(trimmedValue)) {
            return 'Please enter a valid email address.';
        }
        
        return '';
    };

    const validatePhone = (value) => {
        const trimmedValue = value.trim();
        
        if (!trimmedValue) {
            return 'Phone number is required.';
        }
        
        // Remove common phone number characters for validation
        const cleanedPhone = trimmedValue.replace(/[\s\-\(\)]/g, '');
        
        // Check if it contains only digits and optional + at the start
        const phoneRegex = /^\+?\d+$/;
        if (!phoneRegex.test(cleanedPhone)) {
            return 'Phone number must contain digits only.';
        }
        
        // Check length (10-13 digits)
        const digitsOnly = cleanedPhone.replace(/\+/g, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 13) {
            return 'Please enter a valid phone number (10-13 digits).';
        }
        
        return '';
    };

    const validateMessage = (value) => {
        const trimmedValue = value.trim();
        
        if (!trimmedValue) {
            return 'Message is required.';
        }
        
        if (trimmedValue.length < 10) {
            return 'Message must be at least 10 characters.';
        }
        
        if (trimmedValue.length > 500) {
            return 'Message is too long. Please limit to 500 characters.';
        }
        
        // Check for script tags and potentially malicious code
        const dangerousPattern = /<script|javascript:|onerror=|onclick=|<iframe/i;
        if (dangerousPattern.test(trimmedValue)) {
            return 'Invalid characters detected. Please remove any HTML or script tags.';
        }
        
        return '';
    };

    // Real-time validation handlers
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setValidationErrors(prev => ({ ...prev, name: '' }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setValidationErrors(prev => ({ ...prev, email: '' }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);
        setValidationErrors(prev => ({ ...prev, phone: '' }));
    };

    const handleMessageChange = (e) => {
        const value = e.target.value;
        setMessage(value);
        setValidationErrors(prev => ({ ...prev, message: '' }));
    };

    // Validate all fields before submission
    const validateForm = () => {
        const errors = {
            name: validateName(name),
            email: validateEmail(email),
            phone: validatePhone(phone),
            message: validateMessage(message)
        };

        setValidationErrors(errors);

        // Return true if no errors
        return !Object.values(errors).some(error => error !== '');
    };

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
        setErrorMessage('');

        // Validate all fields
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await axios.post('https://admin.apurvachemicals.com/api/inquiries/createInquiry', {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                message: message.trim(),
                ipaddress: clientIp,
                ...utmParams,
            });

            await axios.post('https://leads.rndtechnosoft.com/api/contactform/message', {
                API_KEY: "791A8DCFBD042D46",
                API_ID: "1QED",
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                message: message.trim(),
                path: window.location.href || "https://leads.rndtechnosoft.com"
            });

            setModalIsOpen(true);
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
            setValidationErrors({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const InputError = ({ error }) => {
        if (!error) return null;
        return (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row justify-center lg:items-start items-center p-4 gap-8">
            {/* Left Column - Contact Info */}
            <div className="w-full md:w-1/3 lg:w-[25%] lg:mt-20 flex flex-col gap-8">
                <div className="border shadow border-[#ECEEF3] hover:border-[#bf2e2e] rounded-lg p-12 transition-colors">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-[#bf2e2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
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

                <div className="border shadow border-[#ECEEF3] hover:border-[#bf2e2e] rounded-lg p-12 transition-colors">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-[#bf2e2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
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

                <div className="border shadow border-[#ECEEF3] hover:border-[#bf2e2e] rounded-lg p-12 transition-colors">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-[#bf2e2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
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
                    <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-8">
                        <div>
                            <input
                                type="text"
                                placeholder="Enter your Name"
                                className={`w-full p-4 border rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] focus:outline-none focus:ring-2 transition-colors text-gray-800 placeholder-gray-400 ${
                                    validationErrors.name 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-200 hover:border-[#bf2e2e] focus:ring-[#bf2e2e] focus:border-transparent'
                                }`}
                                value={name}
                                onChange={handleNameChange}
                            />
                            <InputError error={validationErrors.name} />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your Email address"
                                className={`w-full p-4 border rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] focus:outline-none focus:ring-2 transition-colors text-gray-800 placeholder-gray-400 ${
                                    validationErrors.email 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-200 hover:border-[#bf2e2e] focus:ring-[#bf2e2e] focus:border-transparent'
                                }`}
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <InputError error={validationErrors.email} />
                        </div>
                    </div>

                    <div>
                        <input
                            type="tel"
                            placeholder="Enter your Phone number"
                            className={`w-full p-4 border rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] focus:outline-none focus:ring-2 transition-colors text-gray-800 placeholder-gray-400 ${
                                validationErrors.phone 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-200 hover:border-[#bf2e2e] focus:ring-[#bf2e2e] focus:border-transparent'
                            }`}
                            value={phone}
                            onChange={handlePhoneChange}
                            minLength={10}
                            maxLength={10}
                        />
                        <InputError error={validationErrors.phone} />
                    </div>

                    <div>
                        <textarea
                            placeholder="Type your message"
                            rows="5"
                            className={`w-full p-4 border rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] focus:outline-none focus:ring-2 transition-colors text-gray-800 placeholder-gray-400 ${
                                validationErrors.message 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-200 hover:border-[#bf2e2e] focus:ring-[#bf2e2e] focus:border-transparent'
                            }`}
                            value={message}
                            onChange={handleMessageChange}
                        ></textarea>
                        <InputError error={validationErrors.message} />
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
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-gray-500/30  ">
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