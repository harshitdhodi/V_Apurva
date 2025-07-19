import React from 'react';
import ContactusImg from '../../components/contactus/contactImg';
import ContactUs from '../../components/contactus/ContactForm';
import { getMetadataBySlug } from '@/lib/getMetadata';

// Adding metadata to the page
export async function generateMetadata() {
  return await getMetadataBySlug('contact-us');
}

const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-grow">
        <ContactusImg />
        <ContactUs />
      </main>
    </div>
  );
};

export default ContactPage;
