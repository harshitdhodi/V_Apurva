import React from 'react';
import ContactusImg from '@/components/contactus/ContactusImg';
import ContactForm from '@/components/contactus/ContactForm';
import { getMetadataBySlug } from '@/lib/getMetadata';

// Server-side data fetching functions
async function fetchBannerData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3023';
    const url = `https://admin.apurvachemicals.com/api/banner/getBannersBySectionContactus`;
    console.log("Fetching banners from:", url);
    const response = await fetch(url, {
      cache: 'no-store', // Ensure fresh data for dynamic content
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch banner data:', response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

async function fetchContactData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3023';
    const headerUrl = `${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/api/header/getPhoneAndHours`;
    const footerUrl = `${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/api/footer/getAddressAndLocation`;
    
    const [headerResponse, footerResponse] = await Promise.all([
      fetch(headerUrl, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
      }),
      fetch(footerUrl, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
      })
    ]);

    let headerData = { phoneNo: "", openingHours: "" };
    let footerData = { 
      address: "", 
      addresslink: "", 
      location: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.390259169117!2d77.22702231508336!3d28.61275098242474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
    };

    if (headerResponse.ok) {
      const header = await headerResponse.json();
      headerData = {
        phoneNo: header.phoneNo || "",
        openingHours: header.openingHours || ""
      };
    }

    if (footerResponse.ok) {
      const footer = await footerResponse.json();
      footerData = {
        address: footer.address || "",
        addresslink: footer.addresslink || "",
        location: footer.location || footerData.location
      };
    }

    return { headerData, footerData };
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return {
      headerData: { phoneNo: "", openingHours: "" },
      footerData: { 
        address: "", 
        addresslink: "", 
        location: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.390259169117!2d77.22702231508336!3d28.61275098242474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
      }
    };
  }
}

// Adding metadata to the page - this is crucial for SEO
export async function generateMetadata() {
  try {
    const metadata = await getMetadataBySlug('contact-us', true);
    return {
      ...metadata,
      // Ensure these are always present for SEO
      title: metadata?.title || 'Contact Us - Get in Touch',
      description: metadata?.description || 'Get in touch with us. Contact our team for any inquiries, support, or business opportunities.',
      openGraph: {
        title: metadata?.title || 'Contact Us - Get in Touch',
        description: metadata?.description || 'Get in touch with us. Contact our team for any inquiries, support, or business opportunities.',
        type: 'website',
        ...metadata?.openGraph,
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata?.title || 'Contact Us - Get in Touch',
        description: metadata?.description || 'Get in touch with us. Contact our team for any inquiries, support, or business opportunities.',
        ...metadata?.twitter,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Contact Us - Get in Touch',
      description: 'Get in touch with us. Contact our team for any inquiries, support, or business opportunities.',
    };
  }
}

// Main Server Component - This ensures SEO-friendly rendering
const ContactPage = async () => {
  // Fetch all data on the server side
  const [banners, { headerData, footerData }] = await Promise.all([
    fetchBannerData(),
    fetchContactData()
  ]);

  return (
    <>
      {/* This structure will be rendered as proper HTML in view-source */}
      <div className="bg-white min-h-screen flex flex-col">
        <main className="flex-grow">
          {/* Server-rendered banner section */}
          <ContactusImg banners={banners} />
          
          {/* Server-rendered contact form with initial data */}
          <ContactForm 
            initialHeaderData={headerData}
            initialFooterData={footerData}
          />
        </main>
      </div>
    </>
  );
};

export default ContactPage;