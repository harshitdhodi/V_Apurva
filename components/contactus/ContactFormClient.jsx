"use client"

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useClickTracking } from '@/lib/useClickTracking';

// This component handles ONLY the interactive parts of the form
const ContactFormClient = ({ initialHeaderData = {}, initialFooterData = {} }) => {
    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    
    // Client-side data state
    const [clientIp, setClientIp] = useState('');
    const [utmParams, setUtmParams] = useState({});
    
    // UI state
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isMapVisible, setIsMapVisible] = useState(false);
    
    // Click tracking
    const { trackEvent } = useClickTracking();
    
    // Refs
    const mapRef = useRef(null);

    // Extract location for map
    const { location } = initialFooterData;

    // Fetch client IP and UTM parameters (client-side only)
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

        // Extract UTM parameters from URL
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

    // Enhanced form handling to sync with server-rendered form
    useEffect(() => {
        const form = document.querySelector('form');
        if (!form) return;

        const handleFormSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setErrorMessage('');

            const formData = new FormData(form);
            const formName = formData.get('name');
            const formEmail = formData.get('email');
            const formPhone = formData.get('phone');
            const formMessage = formData.get('message');

            try {
                // Track form submission
                await trackEvent('form_submission', {
                    formType: 'contact',
                    formData: { name: formName, email: formEmail, phone: formPhone }
                });

                const response = await axios.post('/api/inquiries/createInquiry', {
                    name: formName,
                    email: formEmail,
                    phone: formPhone,
                    message: formMessage,
                    ipaddress: clientIp,
                    ...utmParams,
                });

                // Track successful submission
                await trackEvent('form_submission_success', {
                    formType: 'contact',
                    inquiryId: response.data._id
                });

                setModalIsOpen(true);
                form.reset();
                setName('');
                setEmail('');
                setPhone('');
                setMessage('');
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'An error occurred. Please try again.';
                setErrorMessage(errorMsg);
                console.error('Error submitting form:', error);
                
                // Track form submission error
                await trackEvent('form_submission_error', {
                    formType: 'contact',
                    error: errorMsg
                });
            } finally {
                setIsSubmitting(false);
            }
        };

        form.addEventListener('submit', handleFormSubmit);
        return () => form.removeEventListener('submit', handleFormSubmit);
    }, [clientIp, utmParams]);

    // Intersection Observer for lazy loading map
    useEffect(() => {
        const mapContainer = document.querySelector('[data-map-container]') || 
                           document.querySelector('.mt-12.rounded-lg.overflow-hidden');
        
        if (!mapContainer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const toggleMap = () => {
                        const newState = !isMapVisible;
                        setIsMapVisible(newState);
                        
                        // Track map toggle
                        trackEvent(newState ? 'map_opened' : 'map_closed', {
                            component: 'contact_form',
                            location: 'contact_page'
                        });
                    };
                    toggleMap();
                    observer.disconnect();
                }
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0.1,
            }
        );

        observer.observe(mapContainer);
        return () => observer.disconnect();
    }, []);

    // Replace map content when ready
    useEffect(() => {
        if (isMapVisible && location) {
            const mapContainer = document.querySelector('[data-map-container]') || 
                               document.querySelector('.mt-12.rounded-lg.overflow-hidden');
            
            if (mapContainer) {
                mapContainer.innerHTML = `
                    <iframe
                        src="${location}"
                        width="100%"
                        height="450"
                        style="border: 0"
                        allowfullscreen
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        title="Location Map"
                        class="aspect-video w-full"
                    ></iframe>
                `;
            }
        }
    }, [isMapVisible, location]);

    // Update form submission state
    useEffect(() => {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = isSubmitting;
            submitButton.textContent = isSubmitting ? 'Sending...' : 'SEND MESSAGE';
            if (isSubmitting) {
                submitButton.classList.add('opacity-70', 'cursor-not-allowed');
            } else {
                submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        }
    }, [isSubmitting]);

    // Show error message
    useEffect(() => {
        if (errorMessage) {
            const form = document.querySelector('form') || document.querySelector('.space-y-6');
            if (form) {
                const existingError = form.querySelector('[data-error-message]');
                if (existingError) {
                    existingError.remove();
                }

                const errorDiv = document.createElement('div');
                errorDiv.setAttribute('data-error-message', 'true');
                errorDiv.className = 'mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700';
                errorDiv.innerHTML = `<p>${errorMessage}</p>`;
                form.insertBefore(errorDiv, form.firstChild);
            }
        }
    }, [errorMessage]);

    // This component renders only the modal and handles interactions
    return (
        <>
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
        </>
    );
};

export default ContactFormClient;