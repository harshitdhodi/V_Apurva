'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/layout/Footer';

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6 bg-white my-6 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-[#bf2e2e] font-montserrat">Terms and Conditions</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">1. Introduction</h2>
            <p className="text-gray-600 font-nunito">
              Welcome to Apurva Chemicals Private Limited. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">2. Company Overview</h2>
            <p className="text-gray-600 font-nunito">
              Established in 1988, Apurva Chemicals is an ISO 9001:2015 certified company specializing in high-quality intermediates and industrial chemicals. We are committed to reliability, innovation, and customer satisfaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">3. Quality Assurance</h2>
            <p className="text-gray-600 font-nunito">
              Our specialized quality control laboratory ensures that our products meet stringent quality standards. Our R&D team continuously strives to improve product formulations and manufacturing processes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">4. Packaging and Shipping</h2>
            <p className="text-gray-600 font-nunito">
              We prioritize safe and contamination-free packaging using high-quality materials such as HDPE bags and durable plastic wraps to protect products from air and moisture.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">5. Intellectual Property</h2>
            <p className="text-gray-600 font-nunito">
              All content, trademarks, logos, and materials on our website are the intellectual property of Apurva Chemicals Private Limited. Unauthorized use is strictly prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">6. Limitation of Liability</h2>
            <p className="text-gray-600 font-nunito">
              Apurva Chemicals shall not be held liable for any direct, indirect, or consequential damages resulting from the use of our products beyond the intended industrial applications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">7. Governing Law</h2>
            <p className="text-gray-600 font-nunito">
              These terms and conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the jurisdiction of Indian courts.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">8. Contact Information</h2>
            <p className="text-gray-600 font-nunito">
              For any questions regarding these terms, please contact us at:
            </p>
            <p className="text-[#bf2e2e] font-semibold font-nunito mt-2">Email: sales@apurvachem.in</p>
            <p className="text-[#bf2e2e] font-semibold font-nunito">Phone: +91 99137 89309</p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
