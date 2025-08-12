import React from 'react';
import ContactFormClient from './ContactFormClient'; // Client-side interactive form
import img1 from './images/contact-01.svg';
import img2 from './images/contact-02.svg';
import img3 from './images/contact-03.svg';

// This is now a Server Component that renders SEO-friendly HTML
const ContactForm = ({ initialHeaderData = {}, initialFooterData = {} }) => {
    // Extract data with fallbacks
    const { phoneNo = "", openingHours = "" } = initialHeaderData;
    const { 
        address = "", 
        addresslink = "", 
        location = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.390259169117!2d77.22702231508336!3d28.61275098242474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
    } = initialFooterData;

    return (
        <div className="flex flex-col md:flex-row justify-center lg:items-start items-center p-4 gap-8">
            {/* Left Column - Contact Info - Server Rendered for SEO */}
            <div className="w-full md:w-1/3 lg:w-[25%] lg:mt-20 flex flex-col gap-8">
                {/* Address Card */}
                <div className="border shadow border-[#ECEEF3] hover:border-[#bf2e2e] rounded-lg p-12 transition-colors">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                            <img 
                                src={img1.src} 
                                alt="Address icon" 
                                className="w-full h-full object-contain"
                                width="64"
                                height="64"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center">Address</h3>
                    </div>
                    <div className="text-gray-700 text-center">
                        {addresslink ? (
                            <a 
                                href={addresslink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-[#bf2e2e] transition-colors"
                                aria-label="View our address on map"
                            >
                                {address || 'N/A'}
                            </a>
                        ) : (
                            <span>{address || 'N/A'}</span>
                        )}
                    </div>
                </div>

                {/* Phone Card */}
                <div className="border shadow border-[#ECEEF3] hover:border-[#bf2e2e] rounded-lg p-12 transition-colors">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                            <img 
                                src={img2.src} 
                                alt="Phone icon" 
                                className="w-full h-full object-contain"
                                width="64"
                                height="64"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center">Phone Number</h3>
                    </div>
                    <div className="text-gray-700 text-center">
                        {phoneNo ? (
                            <a 
                                href={`tel:${phoneNo}`} 
                                className="hover:text-[#bf2e2e] transition-colors"
                                aria-label={`Call us at ${phoneNo}`}
                            >
                                {phoneNo}
                            </a>
                        ) : (
                            <span>N/A</span>
                        )}
                    </div>
                </div>

                {/* Opening Hours Card */}
                <div className="border shadow border-[#ECEEF3] hover:border-[#bf2e2e] rounded-lg p-12 transition-colors">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                            <img 
                                src={img3.src} 
                                alt="Opening hours icon" 
                                className="w-full h-full object-contain"
                                width="64"
                                height="64"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center">Opening Hours</h3>
                    </div>
                    <div className="text-gray-700 text-center">
                        {openingHours || 'N/A'}
                    </div>
                </div>
            </div>

            {/* Right Column - Contact Form and Map */}
            <div className="w-full md:w-2/3 bg-white p-6 rounded-lg">
                {/* SEO-friendly heading */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                
                {/* Server-rendered form structure for SEO */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="contact-name" className="sr-only">Name</label>
                            <input
                                id="contact-name"
                                type="text"
                                placeholder="Enter your Name"
                                className="w-full p-4 border border-gray-100 rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] hover:border-[#bf2e2e] focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent placeholder-gray-400"
                                required
                                aria-required="true"
                                name="name"
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="sr-only">Email</label>
                            <input
                                id="contact-email"
                                type="email"
                                placeholder="Enter your Email address"
                                className="w-full p-4 border border-gray-100 rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] hover:border-[#bf2e2e] focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent placeholder-gray-400"
                                required
                                aria-required="true"
                                name="email"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="contact-phone" className="sr-only">Phone</label>
                        <input
                            id="contact-phone"
                            type="tel"
                            placeholder="Enter your Phone number"
                            className="w-full p-4 border border-gray-100 rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] hover:border-[#bf2e2e] focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent placeholder-gray-400"
                            required
                            aria-required="true"
                            name="phone"
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-message" className="sr-only">Message</label>
                        <textarea
                            id="contact-message"
                            placeholder="Type your message"
                            rows="5"
                            className="w-full p-4 border border-gray-100 rounded-lg shadow-[0px_16px_24px_rgba(189,196,205,0.13)] hover:border-[#bf2e2e] focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent placeholder-gray-400"
                            required
                            aria-required="true"
                            name="message"
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-8 py-4 bg-[#bf2e2e] text-white font-medium rounded-lg hover:bg-[#a82626] transition-colors focus:ring-2 focus:ring-[#bf2e2e] focus:ring-offset-2"
                        aria-label="Send your message"
                    >
                        SEND MESSAGE
                    </button>
                </div>

                {/* Server-rendered map placeholder for SEO */}
                <div className="mt-12 rounded-lg overflow-hidden bg-gray-100 min-h-[300px] flex items-center justify-center">
                    <div className="text-gray-500">Our Location Map</div>
                </div>

                {/* Structured Data for SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ContactPage",
                            "mainEntity": {
                                "@type": "Organization",
                                "contactPoint": {
                                    "@type": "ContactPoint",
                                    "telephone": phoneNo,
                                    "contactType": "customer service"
                                },
                                "address": {
                                    "@type": "PostalAddress",
                                    "streetAddress": address
                                }
                            }
                        })
                    }}
                />
            </div>

            {/* Client-side interactive form overlay */}
            <ContactFormClient 
                initialHeaderData={initialHeaderData}
                initialFooterData={initialFooterData}
            />
        </div>
    );
};

export default ContactForm;