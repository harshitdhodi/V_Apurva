'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/layout/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6 bg-white my-6 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-[#bf2e2e] font-montserrat">Privacy Policy</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">1. Introduction</h2>
            <p className="text-gray-600 font-nunito">
              At Apurva Chemicals Private Limited, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">2. Information We Collect</h2>
            <p className="text-gray-600 font-nunito">
              We may collect personal information such as your name, email, phone number, and company details when you interact with our website or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">3. How We Use Your Information</h2>
            <p className="text-gray-600 font-nunito">
              We use the collected information to provide services, process orders, communicate with you, and improve our offerings. We do not sell or share your data with third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">4. Data Security</h2>
            <p className="text-gray-600 font-nunito">
              We implement strict security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">5. Cookies and Tracking</h2>
            <p className="text-gray-600 font-nunito">
              Our website may use cookies to enhance user experience and analyze website traffic. You can modify your browser settings to decline cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">6. Third-Party Links</h2>
            <p className="text-gray-600 font-nunito">
              Our website may contain links to third-party websites. We are not responsible for their privacy practices, so we recommend reviewing their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">7. Changes to This Policy</h2>
            <p className="text-gray-600 font-nunito">
              We reserve the right to update this privacy policy at any time. Changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 font-montserrat">8. Contact Us</h2>
            <p className="text-gray-600 font-nunito">
              If you have any questions about our privacy practices, please contact us at:
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

export default PrivacyPolicy;
