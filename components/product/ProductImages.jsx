'use client';

import { useState } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} bg-white/80 hover:bg-white p-2 rounded-full shadow-lg`}
      style={{ ...style, display: 'flex', right: '10px', zIndex: 1 }}
      onClick={onClick}
    >
      <ChevronRight className="text-gray-800" size={24} />
    </div>
  );
}

// Add this SamplePrevArrow component if not already present
function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} bg-white/80 hover:bg-white p-2 rounded-full shadow-lg`}
      style={{ ...style, display: 'flex', left: '10px', zIndex: 1 }}
      onClick={onClick}
    >
      <ChevronLeft className="text-gray-800" size={24} />
    </div>
  );
}

// Make sure to include the main component and default export
function ProductImages({ images = [] }) {
  console.log(images);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: images.length > 1, // Only enable infinite if there's more than one image
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: images.length > 1 ? <SampleNextArrow /> : null, // Only show arrows if multiple images
    prevArrow: images.length > 1 ? <SamplePrevArrow /> : null, // Only show arrows if multiple images
    beforeChange: (current, next) => setCurrentSlide(next),
    fade: true,
    autoplay: false, // Disable autoplay to prevent unexpected behavior
    arrows: images.length > 1, // Only show arrows if multiple images
    dotsClass: 'slick-dots !bottom-0',
    appendDots: dots => (
      <div className="!flex justify-center">
        <ul className="!m-0 !p-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <button className="w-2 h-2 rounded-full bg-gray-300 mx-1 focus:outline-none"></button>
    )
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
        <span>No images available</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Slider {...settings}>
        {images.map((img, index) => {
          // Handle both object and string image formats
          const imageUrl = typeof img === 'object' ? img.url : img;
          const imageAlt = typeof img === 'object' ? img.alt : `Product image ${index + 1}`;
          
          return (
            <div key={index} className="relative w-full h-96">
              <Image
                src={`/api/image/download/${imageUrl}`}
                alt={imageAlt}
                fill
                className="object-contain"
                priority={index === 0}
              />
            </div>
          );
        })}
      </Slider>
      {/* <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-gray-800' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
}

export default ProductImages;  // This is the default export