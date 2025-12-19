import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import { X, User, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useClickTracking } from '@/lib/useClickTracking';

function InquiryForm({ productName, onClose, initialName = '', initialEmail = '', initialPhone = '' }) {
   console.log("Initial Name:", productName);
   console.log("Initial Email:", initialEmail);
   console.log("Initial Phone:", initialPhone);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [clientIp, setClientIp] = useState('');
    const [utmParams, setUtmParams] = useState({});
    const router = useRouter();
    const { trackEvent } = useClickTracking();

    useEffect(() => {
        // initialize fields from props when provided
        if (initialName) setName(initialName);
        if (initialEmail) setEmail(initialEmail);
        if (initialPhone) setPhone(initialPhone);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaValue) {
            const errorMsg = 'Please complete the reCAPTCHA';
            setErrorMessage(errorMsg);
            
            // Track captcha validation error
            await trackEvent('form_validation_error', {
                formType: 'product_inquiry',
                field: 'captcha',
                error: errorMsg,
                productName,
                metadata: {
                    page: 'inquiry_form'
                }
            });
            return;
        }

        setIsSubmitting(true);

        // Track form submission start
        await trackEvent('button_click', {
            buttonName: 'inquiry_form_submit',
            metadata: {
                productName,
                formType: 'product_inquiry',
                action: 'submit_start'
            }
        });

        try {
            // First API call - Product Inquiry
            const response = await axios.post('/api/productInquiry/createproductinquiries', {
                name,
                email,
                phone,
                subject: subject || `Inquiry about ${productName}`,
                message,
                productName,
                ipaddress: clientIp,
                path: window.location.href,
                ...utmParams,
            });

            // Track form submission attempt
            await trackEvent('form_submit', {
                eventType: 'form_submit',
                buttonName: 'inquiry_form_submit',
                productName,
                metadata: {
                    formType: 'product_inquiry',
                    formFields: {
                        name: name ? 'filled' : 'empty',
                        email: email ? 'filled' : 'empty',
                        phone: phone ? 'filled' : 'empty',
                        message: message ? 'filled' : 'empty'
                    },
                    submissionStatus: 'attempted'
                }
            });

            // Second API call - Lead Management System
            try {
                await axios.post('https://leads.rndtechnosoft.com/api/contactform/message', {
                    API_KEY: "791A8DCFBD042D46",
                    API_ID: "1QED",
                    name,
                    email,
                    phone,
                    message: `Product: ${productName}\n${message}`,
                    path: window.location.href
                });

                // Track successful submission
                await trackEvent('form_submission_success', {
                    eventType: 'button_click',
                    buttonName: 'inquiry_form_submit_success',
                    productName,
                    metadata: {
                        formType: 'product_inquiry',
                        inquiryId: response.data._id,
                        submissionStatus: 'success'
                    }
                });
            } catch (leadError) {
                console.error('Error submitting to lead management system:', leadError);
                // Continue with the flow even if the second API fails
            }

            // Clear form fields
            setName('');
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');

            if (response.data.success) {
                router.push('/thankyou');
            }

        } catch (error) {
            const errorMsg = error.response?.data?.error || 'An error occurred. Please try again.';
            console.error('Error submitting form:', error);
            setErrorMessage(errorMsg);

            // Track form submission error
            await trackEvent('form_submission_error', {
                eventType: 'button_click',
                buttonName: 'inquiry_form_submit_error',
                productName,
                metadata: {
                    formType: 'product_inquiry',
                    error: errorMsg,
                    submissionStatus: 'failed'
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseForm = () => {
        // Track form close/cancel
        trackEvent('button_click', {
            buttonName: 'inquiry_form_close',
            metadata: {
                productName,
                formType: 'product_inquiry',
                action: 'close_form',
                formState: {
                    hasInput: name || email || phone || message ? true : false,
                    isSubmitting: isSubmitting
                }
            }
        });

        onClose();
    };

    const formatDate = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} | ${hours}:${minutes}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/30  p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleCloseForm}
                    className="absolute top-4 right-4 text-gray-500 hover:text-primary transition-colors"
                    aria-label="Close form"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                    New Inquiry for <span className='text-primary'>{productName}</span>
                    <span className="block text-sm text-gray-500 mt-1">{formatDate()}</span>
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    placeholder="Enter your name"
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                placeholder="Enter your phone number"
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                                maxLength={10}
                                minLength={10}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute top-3 left-3">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                            </div>
                            <textarea
                                id="message"
                                value={message}
                                placeholder="Enter your message"
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border text-gray-500  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                rows="4"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={(value) => setCaptchaValue(value)}
                        />
                    </div>

                    {errorMessage && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={handleCloseForm}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!captchaValue || isSubmitting}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#bf2e2e] hover:bg-[#bf2e2e]/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                                (!captchaValue || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? (
                                'Submitting...'
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Inquiry
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InquiryForm;