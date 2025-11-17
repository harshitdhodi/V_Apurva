import React, { useState } from 'react';
import axios from 'axios';
import { X, User, Mail, Phone, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useClickTracking } from '@/lib/useClickTracking';

function SimpleInquiryModal({ productName, initialPhone = '', initialEmail = '', onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { trackEvent } = useClickTracking();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      setErrorMessage('Please fill name, email and phone');
      return;
    }

    setIsSubmitting(true);

    await trackEvent('button_click', {
      buttonName: 'simple_inquiry_submit',
      metadata: { productName, page: 'product_details' }
    });

    try {
      const response = await axios.post('/api/productInquiry/createproductinquiries', {
        name,
        email,
        phone,
        subject: `Inquiry about ${productName}`,
        message: '',
        productName,
        path: typeof window !== 'undefined' ? window.location.href : ''
      });

      if (response.data?.success) {
        router.push('/thankyou');
      } else {
        setErrorMessage('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Simple inquiry error', err);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    trackEvent('button_click', {
      buttonName: 'simple_inquiry_close',
      metadata: { productName }
    });
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/30 p-4">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-2xl w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg text-black/70 font-semibold mb-3">Request Document: <span className="text-black">{productName}</span></h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm block text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1 text-gray-700">Email <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1 text-gray-700">Phone <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {errorMessage && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border text-gray-700 border-gray-300 rounded-md bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-md bg-[#bf2e2e] text-white"
            >
              {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4 mr-2 inline" />Send</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SimpleInquiryModal;
