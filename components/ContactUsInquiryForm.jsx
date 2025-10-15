"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import ReCAPTCHA with no SSR
const ReCAPTCHA = dynamic(
  () => import('react-google-recaptcha'),
  { ssr: false }
);

// Replace 'YOUR_RECAPTCHA_SITE_KEY' with your actual reCAPTCHA site key
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LcUsyMqAAAAANcXPZrdN6HXoZR-t52V2PKWFlZt';

function ContactUsInquiryForm({ onClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const recaptchaRef = useRef(null);
    const [clientIp, setClientIp] = useState('');
    const [utmParams, setUtmParams] = useState({});

    useEffect(() => {
        // Fetch the client's IP address
        const fetchClientIp = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setClientIp(response.data.ip);
            } catch (error) {
                console.error('Error fetching IP address', error);
            }
        };

        fetchClientIp();

        // Get UTM parameters from the URL
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
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!recaptchaValue) {
            setErrorMessage('Please complete the reCAPTCHA verification');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        // Reset reCAPTCHA
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
            setRecaptchaValue(null);
        }

        try {
            // First API call
            await axios.post('https://admin.apurvachemicals.com/api/inquiries/createInquiry', {
                name,
                email,
                phone,
                message,
                ipaddress: clientIp,
                ...utmParams,
            });

            // Second API call with static and dynamic fields
            await axios.post('https://leads.rndtechnosoft.com/api/contactform/message', {
                API_KEY: "791A8DCFBD042D46",
                API_ID: "1QED",
                name,
                email,
                phone,
                message,
                path: window.location.href || "https://leads.rndtechnosoft.com"
            });

            // Show success message on successful submission of both APIs
            setSuccessMessage('Your message has been successfully sent. We will get back to you soon.');
            // Clear form fields
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
            
            // If you need to open a modal, uncomment the line below
            // setModalIsOpen && setModalIsOpen(true);
            // Close the modal after successful submission
            onClose();
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300">
            <div className="bg-white p-3 md:p-8 md:rounded-xl shadow-2xl w-full max-w-lg relative">
                {/* Close Icon at the Top-Right Corner */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-700 hover:text-[#bf2e2e]"
                >
                  <span className="text-2xl font-bold">X</span>
                </button>

                <h2 className="text-3xl mb-6 text-gray-800 font-bold text-center">Inquiry Now</h2>
                {successMessage ? (
                    <p className="text-green-600 font-medium mb-4">{successMessage}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="hidden" name="recaptchaResponse" value={recaptchaValue} />
                        <div className='flex gap-1'>
                            <div className="mb-2 w-full">
                                <label className="block text-gray-600 font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 p-2 text-black rounded-md focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="mb-2 w-full">
                                <label className="block text-gray-600 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 p-2 text-black rounded-md focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 font-medium mb-2">Phone No</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border border-gray-300 p-2 text-black rounded-md focus:outline-none focus:border-blue-500"
                                placeholder="Enter your phone number"
                                required
                                minLength={10}
                                maxLength={10}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 font-medium mb-2">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full border border-gray-300 p-2 text-black rounded-md focus:outline-none focus:border-blue-500"
                                rows="2"
                                placeholder="Write your message here"
                                required
                            />
                        </div>
                        <div className="mt-4 flex justify-start w-full">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={(value) => setRecaptchaValue(value)}
                                onExpired={() => setRecaptchaValue(null)}
                                onErrored={() => setRecaptchaValue(null)}
                            />
                        </div>
                        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                className={`bg-red-700 text-white py-2 px-6 rounded-lg hover:bg-red-700 cursor-pointer transition-all duration-200 w-full ${(!recaptchaValue || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!recaptchaValue || isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ContactUsInquiryForm;
