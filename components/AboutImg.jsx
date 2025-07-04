"use client"

import { useEffect, useState, useCallback, memo } from "react"
import Link from "next/link"

const AboutImg = memo(() => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/banner/getBannersBySectionAboutus")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setBanners(data.data || [])
    } catch (error) {
      console.error("Error fetching banners:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Scroll to top
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
    fetchData()
  }, [fetchData])

  // Loading state
  if (loading) {
    return (
      <div className="h-[40vh] md:h-[30vh] bg-gray-200 animate-pulse">
        <div className="container mx-auto h-full flex items-center justify-center">
          <div className="h-12 w-96 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-[40vh] md:h-[30vh] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load banner</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // No banners state
  if (!banners.length) {
    return (
      <div className="h-[40vh] md:h-[30vh] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">No banners available</p>
      </div>
    )
  }

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
      <div className="flex justify-center items-center h-[40vh] md:h-[30vh] relative">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <h1 className="font-semibold text-white text-xl sm:text-2xl md:text-3xl mb-8">{banner.title}</h1>

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
AboutImg.displayName = "AboutImg"
BannerItem.displayName = "BannerItem"

export default AboutImg
