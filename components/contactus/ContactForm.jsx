"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, CircleUserRound  } from 'lucide-react';
import Image from 'next/image';

// Import SVG files directly as React components
// import Contact1 from '../../../public/contact-01.svg';
// import Contact2 from '../../../public/contact-02.svg';
// import Contact3 from '../../../public/contact-03.svg';

function ContactUs({ initialData = {} }) {
    const { phoneNo = "", openingHours = "", address = "", addresslink = "", location = "" } = initialData;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [clientIp, setClientIp] = useState('');
    const [utmParams, setUtmParams] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Only execute on client side
        const fetchClientIp = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setClientIp(response.data.ip || '');
            } catch (error) {
                console.error('Error fetching IP address:', error);
                setClientIp('');
            }
        };

        // Get UTM parameters
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

        fetchClientIp();
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
            console.error('Error submitting form:', error);
            setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-center items-start gap-8">
                    {/* Left Column */}
                    <div className="w-full md:w-1/3 lg:w-[22%] flex flex-col gap-8">
                        <div className="border shadow border-gray-200 hover:border-[#bf2e2e] rounded-lg p-6 transition-colors">
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-16 h-16 flex items-center justify-center mb-4">
                                    <CircleUserRound className="w-16 h-16" />
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

                        <div className="border shadow border-gray-200 hover:border-[#bf2e2e] rounded-lg p-6 transition-colors">
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-16 h-16 flex items-center justify-center mb-4">
                                    <CircleUserRound className="w-16 h-16" />
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

                        <div className="border shadow border-gray-200 hover:border-[#bf2e2e] rounded-lg p-6 transition-colors">
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-16 h-16 flex items-center justify-center mb-4">
                                    <CircleUserRound className="w-16 h-16" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 text-center">Email Address</h3>
                            </div>
                            <p className="text-gray-700 text-center">
                                {openingHours || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                        
                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter your Name"
                                        className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent"
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
                                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <textarea
                                    placeholder="Type your message"
                                    rows="5"
                                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full md:w-auto px-8 py-4 bg-[#bf2e2e] text-white font-medium rounded-lg hover:bg-[#a82626] transition-colors ${
                                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? 'Sending...' : 'SEND MESSAGE'}
                            </button>
                        </form>

                        {location && (
                            <div className="mt-12 rounded-lg overflow-hidden">
                                <iframe 
                                    src={location}
                                    width="100%" 
                                    height="450" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="rounded-lg"
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {modalIsOpen && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative transform transition-all scale-100 hover:scale-[1.02] duration-300">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
                            aria-label="Close"
                        >
                            <X size={24} className="stroke-2" />
                        </button>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Thank You!</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">Your message has been successfully sent. Our team will get back to you soon.</p>
                            <button
                                onClick={closeModal}
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
}

export default ContactUs;