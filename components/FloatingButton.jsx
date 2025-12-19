'use client';

import React, { useState } from 'react';
import ContactUsInquiryForm from './ContactUsInquiryForm';

const FloatingButtons = () => {
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const whatsappNumber = '919913789309'; // Without +
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hello,%20I%20have%20an%20inquiry%20about%20your%20products.`;

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col justify-center items-center gap-4">
        
        {/* Inquiry Button */}
        <button
          onClick={() => setShowInquiryForm(true)}
          className="fixed right-0 w-12 h-32 rounded-sm top-1/2 -translate-y-1/2 bg-[#cd1d1d] text-black text-lg font-medium flex items-center justify-center shadow-lg z-40 hover:text-white transition-transform hover:scale-105"
          aria-label="Open Inquiry Form"
        >
        
        <span className="writing-mode-vertical text-white uppercase"> Inquiry</span>  
        </button>

        {/* WhatsApp Button */}
      </div>
           <div className="fixed left-4 bottom-4 z-50 flex flex-col items-center gap-4">

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="h-8 w-8 fill-current"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 108.1 27h.1c122.3 0 222.1-99.6 222.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6z" />
          </svg>
        </a>
           </div>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <button
              onClick={() => setShowInquiryForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <ContactUsInquiryForm onClose={() => setShowInquiryForm(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingButtons;
