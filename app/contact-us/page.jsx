import React from 'react';
import ContactusImg from '../../components/contactus/contactImg';
import ContactUs from '../../components/contactus/ContactForm';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/Navbar';

const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ContactusImg />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
