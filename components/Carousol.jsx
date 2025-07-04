"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import ParticleBackground from "./ParticleBackground"

// Simple HTML content renderer component
const HTMLContent = ({ html, className = "" }) => {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html || "" }} />
}

export default function OptimizedCarousel() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const slideRefs = useRef([])

  // Fetch banners
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/banner/getBannersBySectionHome", {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setBanners(result?.data || [])
      } catch (error) {
        console.error("Error fetching banners:", error)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Manage body overflow for inquiry form
  useEffect(() => {
    document.body.style.overflow = showInquiryForm ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [showInquiryForm])

  // Auto-slide interval
  useEffect(() => {
    if (banners.length === 0 || loading) return

    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length)
    }, 5000)

    return () => clearInterval(slideInterval)
  }, [banners.length, loading])

  // Trigger animation when slide changes
  useEffect(() => {
    if (banners.length > 0 && !loading) {
      setAnimationKey((prev) => prev + 1)
    }
  }, [currentSlide, banners.length, loading])

  if (loading) {
    return (
      <div className="relative flex bg-white justify-center items-center min-h-[600px]">
        <ParticleBackground />
        <div className="w-full max-w-8xl mx-auto p-4">
          <div className="flex flex-col items-center">
            <div className="w-[70%] h-[300px] sm:h-[400px] bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="w-[40%] h-[150px] sm:h-[200px] bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-4 py-5">
              <div className="h-16 bg-gray-200 animate-pulse rounded w-3/4 mx-auto"></div>
              <div className="h-24 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="flex gap-2 pt-4 justify-center">
                <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    return <div>No banners available</div>
  }

  return (
    <div className="relative flex bg-white justify-center items-center md:mb-16">
      <ParticleBackground />
      <div className="relative w-full max-w-8xl mx-auto p-4">
        {banners.map((slide, index) => (
          <div
            key={index}
            className={`transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 transform scale-100 z-10"
                : "opacity-0 transform scale-95 z-0 absolute"
            }`}
            ref={(el) => (slideRefs.current[index] = el)}
          >
            <div className="flex flex-col items-center lg:flex-row-reverse">
              {/* Primary Image */}
              <div className="w-full flex justify-center items-center mt-8 md:mt-0">
                <div className="flex flex-col items-center justify-center relative">
                  {slide?.photo?.[0] ? (
                    <div
                      className={`relative w-[90%] sm:w-[70%] lg:w-[450px] lg:h-[500px] xl:w-[500px] xl:h-[600px] ${
                        index === currentSlide ? "animate-slide-in-right" : ""
                      }`}
                      key={`img-${animationKey}`}
                    >
                      <Image
                        className="object-cover rounded-lg"
                        src={`/api/image/download/${slide.photo[0]}`}
                        alt={slide.alt?.[0] || "Banner image"}
                        title={slide.imgTitle?.[0] || ""}
                        fill
                        priority={index === currentSlide} // Prioritize current slide
                        loading={index === currentSlide ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, (max-width: 1280px) 450px, 500px"
                        quality={85} // Optimize quality vs file size
                      />
                    </div>
                  ) : (
                    <div className="w-[90%] sm:w-[70%] lg:w-[450px] lg:h-[500px] xl:w-[500px] xl:h-[600px] bg-gray-200 animate-pulse rounded-lg" />
                  )}

                  {/* Secondary Image - Optimized sizing */}
                  {slide?.photo?.[1] && (
                    <div
                      className={`relative mt-4 lg:mt-0 lg:absolute lg:-right-5 lg:top-10 xl:top-56 xl:left-[360px] w-[50%] sm:w-[40%] lg:w-[200px] lg:h-[200px] xl:w-[250px] xl:h-[250px] ${
                        index === currentSlide ? "animate-slide-in-right-delayed" : ""
                      }`}
                      key={`small-img-${animationKey}`}
                    >
                      <Image
                        src={`/api/image/download/${slide.photo[1]}`}
                        alt={slide.alt?.[1] || "Banner thumbnail"}
                        title={slide.imgTitle?.[1] || ""}
                        fill
                        loading="lazy"
                        className="object-cover rounded-lg"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 200px, 250px"
                        quality={80} // Slightly lower quality for secondary image
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-[70%] xl:flex xl:flex-col xl:justify-center p-4">
                <div
                  className={`space-y-4 py-5 pt-4 lg:pl-10 ${index === currentSlide ? "animate-fade-in-up" : ""}`}
                  key={`text-${animationKey}`}
                >
                  {index === 0 ? (
                    <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-[57px] font-['Days One',sans-serif] font-bold text-gray-800 text-center lg:text-left">
                      {slide.title}
                    </h1>
                  ) : (
                    <p className="text-2xl sm:text-3xl md:text-4xl xl:text-[57px] font-['Days One',sans-serif] font-bold text-gray-800 text-center lg:text-left">
                      {slide.title}
                    </p>
                  )}
                  <div className="font-semibold text-gray-800 text-lg sm:text-xl lg:text-2xl lg:py-7 xl:w-[80%] text-center lg:text-left">
                    <HTMLContent html={slide.details} className="sub-heading" />
                  </div>
                </div>

                <div
                  className={`flex gap-2 mb-12 md:mb-0 justify-start items-start py-4 lg:pl-10 flex-row md:gap-6 ${
                    index === currentSlide ? "animate-fade-in-up-delayed" : ""
                  }`}
                  key={`buttons-${animationKey}`}
                >
                  <button
                    className="bg-[#bf2e2e] hover:bg-[#cd1d1d] text-white text-base sm:text-lg font-medium p-3 sm:p-4 rounded lg:px-7 transition-colors duration-300"
                    onClick={() => setShowInquiryForm(true)}
                  >
                    INQUIRY NOW
                  </button>
                  <Link href="/about-us" passHref>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white text-base sm:text-lg font-medium p-3 sm:p-4 rounded lg:px-7 transition-colors duration-300">
                      ABOUT US
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(50px);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-fade-in-up-delayed {
          animation: fadeInUp 1s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slideInRight 1.2s ease-out forwards;
        }

        .animate-slide-in-right-delayed {
          animation: slideInRight 1s ease-out 0.2s forwards;
        }
      `}</style>
    </div>
  )
}
