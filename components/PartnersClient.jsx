'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

function PartnersClient({ partners }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const sliderRef = useRef(null)
  const intervalRef = useRef(null)

  const visibleCount = 4
  const extendedPartners = [...partners, ...partners.slice(0, visibleCount)]

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex + 1)
    setIsTransitioning(true)
  }, [])

  // Auto-slide
  useEffect(() => {
    if (partners.length === 0 || isPaused) return

    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 3000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [partners.length, isPaused, nextSlide])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Handle seamless loop using onTransitionEnd
  const handleTransitionEnd = () => {
    if (currentIndex >= partners.length) {
      setIsTransitioning(false)
      setCurrentIndex(0)
    }

  }

  // Re-enable transition after jump
  useEffect(() => {
    if (!isTransitioning) {
      // Wait for the DOM to update before re-enabling transition
      const id = setTimeout(() => setIsTransitioning(true), 20)
      return () => clearTimeout(id)
    }
  }, [isTransitioning])

  const transitionClass = isTransitioning
    ? "transition-transform duration-700 ease-in-out"
    : ""

  return (
<div className="bg-black py-8 md:py-16 mb-10 md:mb-20 mt-10 overflow-hidden">
  <div className="container mx-auto px-2 sm:px-4">
    <div
      ref={sliderRef}
      className="relative w-full overflow-hidden"
      style={{ height: "8rem" }} // Reduced height for mobile
    >
      <div
        className={`flex ${transitionClass}`}
        style={{
          width: `${(extendedPartners.length) * 20}%`, // Adjusted width for better mobile display
          transform: `translateX(-${(currentIndex * 100) / extendedPartners.length}%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedPartners.map((partner, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[10%] flex justify-center items-center h-32 sm:h-40 rounded-lg p-2 sm:p-4 transition-transform duration-300 hover:scale-105"
          >
            <Link href={partner.url} className="block w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={`https://admin.apurvachemicals.com/api/image/download/${partner.photo[0]}`}
                  alt={partner.alt?.[0] || 'Partner logo'}
                  title={partner.imgTitle?.[0] || ''}
                  fill
                  className="object-contain p-1 sm:p-2"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33.33vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
  )
}

export default PartnersClient