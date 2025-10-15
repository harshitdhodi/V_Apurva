// app/components/ClientCarousel.jsx (Client Component)
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from 'gsap'
import ContactUsInquiryForm from "../ContactUsInquiryForm"
import { X } from 'lucide-react'

// Simple HTML content renderer component
const HTMLContent = ({ html, className = "" }) => {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html || "" }} />
}

export default function ClientCarousel({ banners }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const slideRefs = useRef([])
  const textRefs = useRef([])
  const imgRefs = useRef([])
  const smallImgRefs = useRef([])
  const buttonRefs = useRef([])

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
    if (banners.length === 0) return

    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length)
    }, 5000)

    return () => clearInterval(slideInterval)
  }, [banners.length])

  // GSAP animations
  useEffect(() => {
    if (banners.length > 0) {
      // Animate text from below
      gsap.fromTo(
        textRefs.current[currentSlide],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      )
      
      // Animate main image from the right
      gsap.fromTo(
        imgRefs.current[currentSlide],
        { x: 50 },
        { x: 0, duration: 5, ease: 'power3.out' }
      )
      
      // Animate small image from the right
      gsap.fromTo(
        smallImgRefs.current[currentSlide],
        { x: 50 },
        { x: 0, duration: 4, ease: 'power3.out' }
      )
      
      // Animate buttons from below
      gsap.fromTo(
        buttonRefs.current[currentSlide],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, ease: 'power3.out', stagger: 0.2 }
      )
    }
  }, [currentSlide, banners.length])

  return (
    <>
      <div className="relative w-full max-w-8xl mx-auto p-4">
        {banners.map((slide, index) => (
          <div
            key={index}
            className={`transition-opacity duration-2000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 transform scale-100 z-10"
                : "opacity-0 transform scale-0 z-0 absolute"
            }`}
            ref={(el) => (slideRefs.current[index] = el)}
          >
            <div className="flex flex-col items-center lg:flex-row-reverse">
              {/* Primary Image */}
              <div className="w-full sm:flex justify-center hidden items-center mt-8 md:mt-0">
                <div className="flex flex-col items-center justify-center relative">
                  {slide?.photo?.[0] ? (
                    <div
                      className="relative w-[90%] sm:w-[70%] lg:w-[450px] lg:h-[500px] xl:w-[500px] xl:h-[600px]"
                      ref={(el) => (imgRefs.current[index] = el)}
                    >
                      <Image
                        className="object-cover rounded-lg"
                        src={`/api/image/download/${slide.photo[0]}`}
                        alt={slide.alt?.[0] || "Banner image"}
                        title={slide.imgTitle?.[0] || ""}
                        fill
                        priority={index === currentSlide}
                        loading={index === currentSlide ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, (max-width: 1280px) 450px, 500px"
                        quality={85}
                      />
                    </div>
                  ) : (
                    <div className="w-[90%] sm:w-[70%] lg:w-[450px] lg:h-[500px] xl:w-[500px] xl:h-[600px] bg-gray-200 animate-pulse rounded-lg" />
                  )}

                  {/* Secondary Image */}
                  {slide?.photo?.[1] && (
                    <div
                      className="relative mt-4 lg:mt-0 lg:absolute lg:-right-5 lg:top-10 xl:top-56 xl:left-[360px] w-[50%] sm:w-[40%] lg:w-[200px] lg:h-[200px] xl:w-[250px] xl:h-[250px]"
                      ref={(el) => (smallImgRefs.current[index] = el)}
                    >
                      <Image
                        src={`/api/image/download/${slide.photo[1]}`}
                        alt={slide.alt?.[1] || "Banner thumbnail"}
                        title={slide.imgTitle?.[1] || ""}
                        fill
                        loading="lazy"
                        className="object-cover rounded-lg"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 200px, 250px"
                        quality={80}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-[70%] xl:flex xl:flex-col xl:justify-center p-4">
                <div
                  className="sm:space-y-4 space-y-2 py-5 pt-4 lg:pl-10"
                  ref={(el) => (textRefs.current[index] = el)}
                >
                  {index === 0 ? (
                    <h1 className="text-2xl sm:text-3xl font-sans md:text-4xl xl:text-[57px] font-['Days One',sans-serif] font-bold text-gray-800 text-center lg:text-left">
                      {slide.title}
                    </h1>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-sans md:text-4xl xl:text-[57px] font-['Days One',sans-serif] font-bold text-gray-800 text-center lg:text-left">
                      {slide.title}
                    </p>
                  )}
                  <div className="font-semibold text-gray-800 text-lg sm:text-xl lg:text-2xl lg:py-7 xl:w-[80%] text-center lg:text-left">
                    <HTMLContent html={slide.details} className="sub-heading font-sans" />
                  </div>
                </div>

                <div
                  className="flex gap-2 mb-12 md:mb-0 sm:justify-start justify-center items-center py-4 lg:pl-10 flex-row md:gap-6"
                  ref={(el) => (buttonRefs.current[index] = el)}
                >
                  <button
                    className="bg-[#bf2e2e] hover:bg-[#cd1d1d] text-white text-base sm:text-lg font-medium cursor-pointer p-3 sm:p-4 rounded lg:px-7 transition-colors duration-300"
                    onClick={() => setShowInquiryForm(true)}
                  >
                    INQUIRY NOW
                  </button>
                  <Link href="/about-us" passHref>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white text-base sm:text-lg font-medium cursor-pointer p-3 sm:p-4 rounded lg:px-7 transition-colors duration-300">
                      ABOUT US
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50 p-4">
                     {/* Modal Content */}
            <div className="p-6 md:p-8">
              <ContactUsInquiryForm onClose={() => setShowInquiryForm(false)} />
            </div>
         
        </div>
      )}
    </>
  )
}