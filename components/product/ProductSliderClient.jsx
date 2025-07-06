"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProductSliderClient({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [itemsPerView, setItemsPerView] = useState(4)

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 768) {
        setItemsPerView(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }

    updateItemsPerView()
    window.addEventListener("resize", updateItemsPerView)
    return () => window.removeEventListener("resize", updateItemsPerView)
  }, [])

  // Reset currentIndex when itemsPerView changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [itemsPerView])

  // Auto play functionality
  useEffect(() => {
    if (!isPlaying || products.length <= itemsPerView) return
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex >= products.length - itemsPerView ? 0 : prevIndex + 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [isPlaying, products.length, itemsPerView])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, products.length - itemsPerView) : Math.max(0, prevIndex - 1),
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= products.length - itemsPerView ? 0 : prevIndex + 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index * itemsPerView)
  }

  return (
    <div className="relative" onMouseEnter={() => setIsPlaying(false)} onMouseLeave={() => setIsPlaying(true)}>
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product, index) => (
            <div
              key={product._id || index}
              className={`flex-shrink-0 px-2 sm:px-3 ${
                itemsPerView === 1 ? "w-full" : itemsPerView === 2 ? "w-1/2" : itemsPerView === 3 ? "w-1/3" : "w-1/4"
              }`}
            >
              <div className="bg-white shadow-lg rounded-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300 h-full">
                {/* Product Image */}
                <div className="h-40 sm:h-48 md:h-52 overflow-hidden relative">
                  <Link href={`/${product.slug || "#"}`}>
                    <Image
                      src={product.photo?.[0] ? `/api/image/download/${product.photo[0]}` : "/placeholder-image.jpg"}
                      alt={product.alt || product.title || "Product"}
                      title={product.imgTitle || product.title || "Product"}
                      width={500}
                      height={500}
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                {/* Product Info */}
                <div className="p-3 sm:p-4 flex flex-col min-h-[80px] sm:min-h-[100px]">
                  <Link href={`/${product.slug || "#"}`} className="block flex-grow">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 hover:text-[#cd1d1d] transition-colors duration-200 line-clamp-2 leading-tight">
                      {product.title || "Untitled Product"}
                    </h3>
                  </Link>

                  <div className="mt-2 sm:mt-3 flex justify-end">
                    <Link
                      href={`/${product.slug || "#"}`}
                      className="text-[#bf2e2e] font-medium text-xs sm:text-sm hover:text-[#cd1d1d] transition-colors duration-200 flex items-center gap-1"
                    >
                      READ MORE <ArrowRight size={12} className="sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {products.length > itemsPerView && (
        <>
          <button
            onClick={goToPrevious}
            className="hidden sm:block absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 sm:p-2 shadow-md transition-all duration-200 z-10"
            aria-label="Previous products"
          >
            <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={goToNext}
            className="hidden sm:block absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 sm:p-2 shadow-md transition-all duration-200 z-10"
            aria-label="Next products"
          >
            <ChevronRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {products.length > itemsPerView && (
        <div className="flex justify-center mt-4 sm:mt-6 space-x-1 sm:space-x-2">
          {Array.from({ length: Math.ceil(products.length / itemsPerView) }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                Math.floor(currentIndex / itemsPerView) === index
                  ? "bg-blue-600 scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
