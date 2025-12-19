'use client';

import React, { useState } from 'react';
import ContactUsInquiryForm from './ContactUsInquiryForm';
import { BsWhatsapp } from 'react-icons/bs';

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
         <BsWhatsapp className="w-8 h-8" />
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
