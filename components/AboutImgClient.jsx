// components/AboutImgClient.js (Client Component)
"use client"

import { useEffect, memo } from "react"
import Link from "next/link"

const AboutImgClient = memo(({ banners }) => {
  useEffect(() => {
    // Scroll to top
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
  }, [])

  return (
    <div>
      {banners.map((banner, index) => (
        <BannerItem key={banner._id || index} banner={banner} />
      ))}
    </div>
  )
})

// Separate memoized component for individual banner items
const BannerItem = memo(({ banner }) => {
  const backgroundStyle = {
    backgroundImage: `url(/api/image/download/${banner.photo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }

  return (
    <div className="relative" style={backgroundStyle} title={banner.title}>
      <div className="flex justify-center items-center h-[30vh] md:h-[30vh] relative">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <h1 className="font-semibold text-white text-xl sm:text-2xl md:text-3xl mb-5">{banner.title}</h1>

          {/* Breadcrumb */}
          <div className="flex items-center justify-center space-x-2 text-white">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="cursor-default">{banner.title}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

// Set display names for better debugging
AboutImgClient.displayName = "AboutImgClient"
BannerItem.displayName = "BannerItem"

export default AboutImgClient