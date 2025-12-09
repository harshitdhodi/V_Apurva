// app/about-us/page.js (Server Component)
import { Suspense } from 'react'
import AboutImgClient from "@/components/AboutImgClient"
import VideoClient from "@/components/VideoClient"
import OurPeopleClient from "@/components/OurPeopleClient"
import PackagingTypeClient from "@/components/PackagingTypeClient"
import Partners from "@/components/Partners"
import OurProcess from "@/components/ourprocess/OurProcess"
import LoadingSpinner from "@/components/home/LoadingSpinner"
import { getMetadataBySlug } from '@/lib/getMetadata';

// Adding metadata to the page
export async function generateMetadata() {
  try {
    const metadata = await getMetadataBySlug('about-us', true);
    return {
      ...metadata,
      // Ensure these are always present for SEO
      title: metadata?.title || 'About Us - Apurva Chemicals',
      description: metadata?.description || 'Learn more about Apurva Chemicals - a leading manufacturer and exporter of specialty chemicals.',
      openGraph: {
        title: metadata?.title || 'About Us - Apurva Chemicals',
        description: metadata?.description || 'Learn more about Apurva Chemicals - a leading manufacturer and exporter of specialty chemicals.',
        type: 'website',
        ...metadata?.openGraph,
      },
      ...metadata
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'About Us - Apurva Chemicals',
      description: 'Learn more about Apurva Chemicals - a leading manufacturer and exporter of specialty chemicals.',
    };
  }
}

// --- Data fetching functions (copied from components) ---
async function getBanners() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/banner/getBannersBySectionAboutus`, { next: { revalidate: 60 } })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching banners:", error)
    return []
  }
}

async function getAboutUsData() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/aboutus/active`, { next: { revalidate: 60 } })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching about us data:", error)
    return null
  }
}

async function getHeadings() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/pageHeading/heading?pageType=ourpeople`, { next: { revalidate: 60 } })
    if (!response.ok) throw new Error("Failed to fetch headings")
    return await response.json()
  } catch (error) {
    console.error("Error fetching headings:", error)
    return {}
  }
}
async function getOurPeopleData() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/ourpeople/getOurPeople`, { next: { revalidate: 60 } })
    if (!response.ok) throw new Error("Failed to fetch our people data")
    const data = await response.json()
    return data.success && data.data.length > 0 ? data.data[0] : null
  } catch (error) {
    console.error("Error fetching our people data:", error)
    return null
  }
}

async function getPackagingDetail() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/packagingdetail/getPackagingDetail`, { next: { revalidate: 60 } })
    if (!response.ok) throw new Error("Failed to fetch packaging detail")
    return await response.json()
  } catch (error) {
    console.error("Error fetching packaging detail:", error)
    return {}
  }
}
async function getPackagingPageHeadings() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/pageHeading/heading?pageType=packagingType`, { next: { revalidate: 60 } })
    if (!response.ok) throw new Error("Failed to fetch page headings")
    return await response.json()
  } catch (error) {
    console.error("Error fetching page headings:", error)
    return {}
  }
}
async function getPackagingTypes() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/packaging-types`, { next: { revalidate: 60 } })
    if (!response.ok) throw new Error("Failed to fetch packaging types")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching packaging types:", error)
    return []
  }
}

async function getPartners() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/partners/getActivePartners`, { next: { revalidate: 60 } })
    if (!response.ok) throw new Error("Failed to fetch partners")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching partners:", error)
    return []
  }
}

// app/about-us/page.jsx
async function getMissionData() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/mission/getAllActiveMissions`, { 
      next: { revalidate: 60 },
      // Add timeout and error handling
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response?.ok) {
      console.warn('Failed to fetch mission data, using fallback');
      return { video: null, title: '', description: '' }; // Return safe defaults
    }
    
    const data = await response.json();
    return data.data || { video: null, title: '', description: '' };
  } catch (error) {
    console.error('Error fetching mission data:', error);
    return { video: null, title: '', description: '' }; // Return safe defaults
  }
}

async function getVisionData() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  try {
    const response = await fetch(`${apiUrl}/api/vision/getAllActiveVisions`, { next: { revalidate: 60 } })
    if (!response.ok) throw new Error("Failed to fetch vision data")
    const data = await response.json()
    return data.data || {}
  } catch (error) {
    console.error("Error fetching vision data:", error)
    return {}
  }
}

export default async function AboutUsPage() {
  // Fetch all data in parallel
  const [banners, pageContent, headings, ourPeopleData, packagingDetail, packagingPageHeadings, packagingTypes, partners, missionData, visionData] = await Promise.all([
    getBanners(),
    getAboutUsData(),
    getHeadings(),
    getOurPeopleData(),
    getPackagingDetail(),
    getPackagingPageHeadings(),
    getPackagingTypes(),
    getPartners(),
    getMissionData(),
    getVisionData(),
  ])

  // Prepare props for OurPeopleClient
  const ourPeopleProps = {
    heading: headings.heading || '',
    subheading: headings.subheading || '',
    description: ourPeopleData?.description || '',
    currentPhoto: ourPeopleData?.photo || '',
    altText: ourPeopleData?.alt || '',
    imgTitle: ourPeopleData?.imgTitle || '',
  }

  // Prepare props for PackagingTypeClient
  const packagingProps = {
    description: packagingDetail?.description || '',
    heading: packagingPageHeadings.heading || '',
    subheading: packagingPageHeadings.subheading || '',
    heading2: packagingPageHeadings.heading2 || '',
    subheading2: packagingPageHeadings.subheading2 || '',
    packagingTypes: packagingTypes || [],
  }

  return (
    <div className="min-h-screen">
      <main>
        <AboutImgClient banners={banners} />
        <VideoClient data={pageContent} />
        <OurPeopleClient data={ourPeopleProps} />
        <PackagingTypeClient data={packagingProps} />
        <OurProcess missionData={missionData} visionData={visionData} />
        <Partners partners={partners} />
      </main>
    </div>
  )
}
