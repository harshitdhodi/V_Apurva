import { Suspense } from "react"
import Carousel from "@/components/home/Carousel"
import Video from "@/components/Video"
import ProductsGrid from "@/components/product/ProductsGrid"
import BlogPage from "@/components/blog/BlogPage"

import LoadingSpinner from "@/components/home/LoadingSpinner"
import { getMetadataBySlug } from '@/lib/getMetadata';
import WhyChooseUs from "@/components/WhyChooseus"

// Adding metadata to the page
export async function generateMetadata() {
  return await getMetadataBySlug('/');
}

// Server-side data fetching functions
async function getBanners() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner/getBannersBySectionHome`, {
      
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error("Failed to fetch banners")
    const data = await response.json()
    console.log("banner",data)
    return data.data || []
  } catch (error) {
    console.error("Error fetching banners:", error)
    return []
  }
}

export default async function Home() {
  // Fetch all data in parallel on the server
  const [ banners ] = await Promise.all([
    getBanners(),
  ])

  return (
    <div className="min-h-screen">
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Carousel banners={banners} />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Video />
        </Suspense>
        <Suspense fallback={<LoadingSpinner/>}>
          <WhyChooseUs/>
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ProductsGrid />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <BlogPage />
        </Suspense>
      </main>
    </div>
  )
}
