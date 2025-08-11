import React from 'react';
import ContactusImg from '@/components/contactus/contactImg';
import ContactUs from '@/components/contactus/ContactForm';
import { getMetadataBySlug } from '@/lib/getMetadata';

// Server-side data fetching functions
async function fetchBannerData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/banner/getBannersBySectionContactus`, {
      cache: 'no-store' // or 'force-cache' depending on your needs
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch banner data');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

async function fetchHeaderData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/header/getPhoneAndHours`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch header data');
    }
    
    const data = await response.json();
    return {
      phoneNo: data.phoneNo || "",
      openingHours: data.openingHours || ""
    };
  } catch (error) {
    console.error('Error fetching header:', error);
    return {
      phoneNo: "",
      openingHours: ""
    };
  }
}

async function fetchFooterData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/footer/getAddressAndLocation`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch footer data');
    }
    
    const data = await response.json();
    return {
      address: data.address || "",
      addresslink: data.addresslink || "",
      location: data.location || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.390259169117!2d77.22702231508336!3d28.61275098242474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
    };
  } catch (error) {
    console.error('Error fetching footer:', error);
    return {
      address: "",
      addresslink: "",
      location: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.390259169117!2d77.22702231508336!3d28.61275098242474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
    };
  }
}

// Adding metadata to the page
export async function generateMetadata() {
  return await getMetadataBySlug('contact-us');
}

const ContactPage = async () => {
  // Fetch all data in parallel on the server
  const [banners, headerData, footerData] = await Promise.all([
    fetchBannerData(),
    fetchHeaderData(),
    fetchFooterData()
  ]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-grow">
        <ContactusImg banners={banners} />
        <ContactUs 
          headerData={headerData}
          footerData={footerData}
        />
      </main>
    </div>
  );
};

export default ContactPage;