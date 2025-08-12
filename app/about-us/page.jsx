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
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner/getBannersBySectionAboutus`, { next: { revalidate: 0 } })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching banners:", error)
    return []
  }
}

async function getAboutUsData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/aboutus/active`, { next: { revalidate: 0 } })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching about us data:", error)
    return null
  }
}

async function getHeadings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pageHeading/heading?pageType=ourpeople`, { next: { revalidate: 0 } })
    if (!response.ok) throw new Error("Failed to fetch headings")
    return await response.json()
  } catch (error) {
    console.error("Error fetching headings:", error)
    return {}
  }
}
async function getOurPeopleData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ourpeople/getOurPeople`, { next: { revalidate: 0 } })
    if (!response.ok) throw new Error("Failed to fetch our people data")
    const data = await response.json()
    return data.success && data.data.length > 0 ? data.data[0] : null
  } catch (error) {
    console.error("Error fetching our people data:", error)
    return null
  }
}

async function getPackagingDetail() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packagingdetail/getPackagingDetail`, { next: { revalidate: 0 } })
    if (!response.ok) throw new Error("Failed to fetch packaging detail")
    return await response.json()
  } catch (error) {
    console.error("Error fetching packaging detail:", error)
    return {}
  }
}
async function getPackagingPageHeadings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pageHeading/heading?pageType=packagingType`, { next: { revalidate: 0 } })
    if (!response.ok) throw new Error("Failed to fetch page headings")
    return await response.json()
  } catch (error) {
    console.error("Error fetching page headings:", error)
    return {}
  }
}
async function getPackagingTypes() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packaging-types`, { next: { revalidate: 0 } })
    if (!response.ok) throw new Error("Failed to fetch packaging types")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching packaging types:", error)
    return []
  }
}

async function getPartners() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners/getActivePartners`, { next: { revalidate: 0 } })
    if (!response.ok) throw new Error("Failed to fetch partners")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching partners:", error)
    return []
  }
}

async function getMissionData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mission/getAllActiveMissions`, { next: { revalidate: 0 } })
    if (!response.ok) throw new Error("Failed to fetch mission data")
    const data = await response.json()
    return data.data || {}
  } catch (error) {
    console.error("Error fetching mission data:", error)
    return {}
  }
}
async function getVisionData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vision/getAllActiveVisions`, { next: { revalidate: 0 } })
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
