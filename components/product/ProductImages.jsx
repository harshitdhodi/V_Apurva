'use client';

import { useState } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomPrevArrow = (props) => (
  <div
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-[#0f0f0f54] rounded-full h-8 w-8 flex justify-center items-center"
    onClick={props.onClick}
    style={{ ...props.style }}
  >
    <ChevronLeft size={25} />
  </div>
);

const CustomNextArrow = (props) => (
  <div
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-[#0f0f0f54] rounded-full h-8 w-8 flex justify-center items-center"
    onClick={props.onClick}
    style={{ ...props.style }}
  >
    <ChevronRight size={25} />
  </div>
);

function getImageUrl(img) {
  return typeof img === "object" ? img.url : img;
}
function getImageAlt(img, index) {
  return typeof img === "object" ? img.alt : `Product Image ${index + 1}`;
}

const ProductImages = ({ images = [] }) => {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
        <span>No images available</span>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(getImageUrl(images[0]));
  const [sliderRef, setSliderRef] = useState(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    beforeChange: (current, next) => {
      setSelectedImage(getImageUrl(images[next]));
    },
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  const handleThumbnailClick = (img) => {
    const url = getImageUrl(img);
    setSelectedImage(url);
    const index = images.findIndex((i) => getImageUrl(i) === url);
    if (sliderRef && index !== -1) {
      sliderRef.slickGoTo(index);
    }
  };

  if (images.length === 1) {
    return (
      <div className="mb-4">
        <Image
          src={`/api/image/download/${getImageUrl(images[0])}`}
          alt={getImageAlt(images[0], 0)}
          width={800}
          height={400}
          className="w-full h-[9cm] bg-gray-100 lg:h-[10cm] object-contain md:rounded-lg"
        />
      </div>
    );
  }

  return (
    <>
      <Slider {...settings} ref={setSliderRef} className="mb-4">
        {images.map((img, index) => (
          <div key={index}>
            <Image
              src={`/api/image/download/${getImageUrl(img)}`}
              alt={getImageAlt(img, index)}
              width={800}
              height={400}
              className="w-full h-[9cm] lg:h-[10cm] object-cover md:rounded-lg"
              priority={index === 0}
            />
          </div>
        ))}
      </Slider>
      <div className="flex justify-center items-center gap-4 md:gap-12 lg:gap-8">
        {images.map((img, index) => {
          const url = getImageUrl(img);
          return (
            <div
              key={index}
              className={`border-2 ${selectedImage === url ? "border-blue-500" : "border-gray-400"}`}
              onClick={() => handleThumbnailClick(img)}
            >
              <Image
                src={`/api/image/download/${url}`}
                alt={`Thumbnail ${index + 1}`}
                width={160}
                height={80}
                className="w-full h-[9cm] bg-gray-100 lg:h-[10cm] object-cover md:rounded-lg"
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductImages;  // This is the default export