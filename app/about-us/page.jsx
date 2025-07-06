// This is a server component - no 'use client' directive
import Head from 'next/head';
import ClientAboutUs from './ClientAboutUs';

// This function runs on the server side
export async function generateMetadata() {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/meta?slug=about-us`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    const data = await response.json();
    
    if (!data.success || !data.data) {
      return {
        title: 'About Us',
        description: 'Learn more about our company and values',
      };
    }
    
    const meta = data.data;
    
    return {
      title: meta.metaTitle || 'About Us',
      description: meta.metaDescription || 'Learn more about our company and values',
      keywords: meta.metaKeyword || '',
      metadataBase: new URL('https://v-apurva-a8cl.vercel.app'),
      alternates: {
        canonical: '/about-us',
      },
      other: {
        'http-equiv': 'x-ua-compatible',
        content: 'ie=edge',
      },
      openGraph: {
        title: meta.metaTitle || 'About Us',
        description: meta.metaDescription || 'Learn more about our company and values',
        url: 'https://v-apurva-a8cl.vercel.app/about-us',
        siteName: 'V-Apurva',
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.metaTitle || 'About Us',
        description: meta.metaDescription || 'Learn more about our company and values',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'About Us',
      description: 'Learn more about our company and values',
    };
  }
}

export default function AboutUsPage() {
  return (
    <>
      <Head>
        <title>About Us</title>
      </Head>
      <ClientAboutUs />
    </>
  );
}