// app/about-us/page.js (Server Component)
import { Suspense } from 'react'
import AboutImg from "@/components/AboutImg"
import Video from "@/components/Video"
import OurPeople from "@/components/OurPeople"
import PackagingType from "@/components/PackagingType"
import Partners from "@/components/Partners"
import OurProcess from "@/components/ourprocess/OurProcess"
import LoadingSpinner from "@/components/home/LoadingSpinner"
import { getMetadataBySlug } from '@/lib/getMetadata';

// Adding metadata to the page
export async function generateMetadata() {
  return await getMetadataBySlug('about-us');
}

export default async function AboutUsPage() {
  return (
    <div className="min-h-screen">
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <AboutImg />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Video />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <OurPeople />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <PackagingType />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <OurProcess />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Partners />
        </Suspense>
      </main>
    </div>
  )
}
