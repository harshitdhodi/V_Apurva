'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, MessageSquare } from "lucide-react";
import InquiryForm from './InquiryForm';

const MSDSSection = ({ msds, specs, name }) => {
  const [isInquiryFormVisible, setIsInquiryFormVisible] = useState(false);
  const [headerNumber, setHeaderNumber] = useState(null);

  useEffect(() => {
    const fetchHeaderNumber = async () => {
      try {
        const response = await axios.get('/api/header/getHeader');
        setHeaderNumber(response.data.phoneNo);
      } catch (error) {
        console.error("Error fetching header number:", error);
      }
    };

    fetchHeaderNumber();
  }, []);

  const openPdf = (type) => {
    const baseUrl = type === 'msds' 
      ? `/api/image/msds/view/${encodeURIComponent(msds)}`
      : `/api/image/spec/view/${encodeURIComponent(specs)}`;
    window.open(baseUrl, '_blank');
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = headerNumber || "+919913789309";
    const message = `Hi, I'm interested in ${name}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInquiryClick = () => {
    setIsInquiryFormVisible(true);
  };

  const handleCloseInquiryForm = () => {
    setIsInquiryFormVisible(false);
  };

  return (
    <div className="mt-12 bg-gradient-to-r from-gray-100 to-gray-100 p-5 shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-black border-b border-red-600 pb-3">
        {name} MSDS (Material Safety Data Sheet) or SDS, COA and Specs
      </h2>
      <div className="flex flex-wrap gap-4 mb-3">
       
          <button 
            className="flex items-center cursor-pointer px-4 py-2 bg-white text-black shadow-md hover:bg-red-700 hover:text-white transition-colors duration-200"
            onClick={() => openPdf('specs')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Specs
          </button>
       
       
          <button 
            className="flex items-center cursor-pointer  px-4 py-2 text-black bg-white hover:text-white shadow-md hover:bg-red-700 transition-colors duration-200"
            onClick={() => openPdf('msds')}
          >
            <FileText className="w-4 h-4 mr-2" />
            MSDS
          </button>
       
        <button
          onClick={handleInquiryClick}
          className="px-4 py-2 bg-red-700 cursor-pointer  text-white transition-colors duration-200 flex items-center justify-center hover:bg-red-800"
        >
          Inquiry Now
        </button>
        <button
          onClick={handleWhatsAppClick}
          className="inline-flex items-center cursor-pointer  text-green-500 hover:opacity-80 transition-opacity p-2"
          aria-label="Contact via WhatsApp"
        >
          <MessageSquare className="w-8 h-8" />
        </button>
      </div>
      {isInquiryFormVisible && (
        <InquiryForm 
          productName={name} 
          onClose={handleCloseInquiryForm} 
        />
      )}
    </div>
  );
};

export default MSDSSection;
