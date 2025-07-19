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
    <div
      className="bg-black py-16 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        <div
          ref={sliderRef}
          className="relative w-full overflow-hidden"
          style={{ height: "10rem" }}
        >
          <div
            className={`flex ${transitionClass}`}
            style={{
              width: `${(extendedPartners.length) * 15}%`,
              transform: `translateX(-${(currentIndex * 100) / extendedPartners.length}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedPartners.map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[10%] flex justify-center items-center h-40 rounded-lg p-4 transition-transform duration-300 hover:scale-105"
                style={{ minWidth: "15%" }}
              >
                <Link href={partner.url} className="block w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={`/api/image/download/${partner.photo[0]}`}
                      alt={partner.alt?.[0] || 'Partner logo'}
                      title={partner.imgTitle?.[0] || ''}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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