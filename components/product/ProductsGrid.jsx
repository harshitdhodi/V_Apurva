'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setItemsPerView(1);
      } else if (window.innerWidth < 768) { // md breakpoint
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) { // lg breakpoint
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Reset currentIndex when itemsPerView changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerView]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch headings and products simultaneously
        const [headingResponse, productsResponse] = await Promise.all([
          fetch('/api/pageHeading/heading?pageType=product'),
          fetch('/api/product/getActiveProducts')
        ]);

        if (headingResponse.ok) {
          const headingData = await headingResponse.json();
          setHeading(headingData.heading || '');
          setSubheading(headingData.subheading || '');
        }

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const productList = productsData.data || productsData || [];
          setProducts(Array.isArray(productList) ? productList : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto play functionality
  useEffect(() => {
    if (!isPlaying || products.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= products.length - itemsPerView ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, products.length, itemsPerView]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? Math.max(0, products.length - itemsPerView) : Math.max(0, prevIndex - 1)
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex >= products.length - itemsPerView ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index * itemsPerView);
  };

  // Loading skeleton with responsive grid
  if (loading) {
    return (
      <div className="bg-white mt-[-10%] py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-32 sm:w-48 mb-2 sm:mb-4 animate-pulse mx-auto sm:mx-0"></div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 animate-pulse mx-auto sm:mx-0"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: itemsPerView }, (_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
                <div className="h-40 sm:h-48 bg-gray-200"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white mt-[-10%] py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500 text-sm sm:text-base">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white lg:mt-[-10%] md:mt-[-15%] mt-[-20%]  py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          {heading && (
            <p className="text-blue-600 text-sm sm:text-base md:text-lg font-bold uppercase text-center sm:text-left mb-2">
              {heading}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            {subheading && (
              <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-800 font-bold text-center sm:text-left">
                {subheading}
              </h2>
            )}
            <Link 
              href="/products" 
              className="flex items-center justify-center sm:justify-start gap-1 text-blue-600 font-medium py-2 hover:text-blue-700 transition-colors text-sm sm:text-base"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Slider Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <div className="overflow-hidden rounded-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {products.map((product, index) => (
                <div 
                  key={product._id || index} 
                  className={`flex-shrink-0 px-2 sm:px-3 ${
                    itemsPerView === 1 ? 'w-full' :
                    itemsPerView === 2 ? 'w-1/2' :
                    itemsPerView === 3 ? 'w-1/3' :
                    'w-1/4'
                  }`}
                >
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300 h-full">
                    {/* Product Image */}
                    <div className=" h-40 sm:h-48 md:h-52 overflow-hidden relative">
                      <Link href={`/${product.slug || '#'}`}>
                        <Image
                          src={product.photo?.[0] ? `/api/image/download/${product.photo[0]}` : '/placeholder-image.jpg'}
                          alt={product.alt || product.title || 'Product'}
                          title={product.imgTitle || product.title || 'Product'}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </Link>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4 flex flex-col min-h-[80px] sm:min-h-[100px]">
                      <Link 
                        href={`/${product.slug || '#'}`}
                        className="block flex-grow"
                      >
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
                          {product.title || 'Untitled Product'}
                        </h3>
                      </Link>
                      
                      <div className="mt-2 sm:mt-3 flex justify-end">
                        <Link 
                          href={`/${product.slug || '#'}`}
                          className="text-blue-600 font-medium text-xs sm:text-sm hover:text-blue-700 transition-colors duration-200 flex items-center gap-1"
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

          {/* Navigation Arrows - Hide on very small screens */}
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
        </div>

        {/* Dots Indicator */}
        {products.length > itemsPerView && (
          <div className="flex justify-center mt-4 sm:mt-6 space-x-1 sm:space-x-2">
            {Array.from({ length: Math.ceil(products.length / itemsPerView) }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / itemsPerView) === index
                    ? 'bg-blue-600 scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        

        {/* Play/Pause Control - Hidden on mobile for cleaner UI */}
        {/* {products.length > itemsPerView && (
          <div className="hidden sm:flex justify-center mt-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ProductSlider;