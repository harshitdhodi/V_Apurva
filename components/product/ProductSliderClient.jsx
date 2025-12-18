"use client"
import { FaArrowRight } from "react-icons/fa"
import { GrDocumentTest } from "react-icons/gr"
import { LuTestTube } from "react-icons/lu"
import { GrTest } from "react-icons/gr"
import { FaBacterium } from "react-icons/fa"
import { GiHeartOrgan } from "react-icons/gi"
import { GiDna2 } from "react-icons/gi"
import { SiMicrogenetics } from "react-icons/si"
import { RiTestTubeLine } from "react-icons/ri"
import  Link  from "next/link"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

// Color map for icons
const colorMap = {
  GrDocumentTest: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    hoverBgColor: "group-hover:bg-blue-500",
    hoverTextColor: "group-hover:text-white",
  },
  LuTestTube: {
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    hoverBgColor: "group-hover:bg-red-500",
    hoverTextColor: "group-hover:text-white",
  },
  GrTest: {
    bgColor: "bg-teal-100",
    textColor: "text-teal-600",
    hoverBgColor: "group-hover:bg-teal-500",
    hoverTextColor: "group-hover:text-white",
  },
  FaBacterium: {
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    hoverBgColor: "group-hover:bg-green-500",
    hoverTextColor: "group-hover:text-white",
  },
  GiHeartOrgan: {
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    hoverBgColor: "group-hover:bg-red-500",
    hoverTextColor: "group-hover:text-white",
  },
  GiDna2: {
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    hoverBgColor: "group-hover:bg-purple-500",
    hoverTextColor: "group-hover:text-white",
  },
  SiMicrogenetics: {
    bgColor: "bg-pink-100",
    textColor: "text-pink-600",
    hoverBgColor: "group-hover:bg-pink-500",
    hoverTextColor: "group-hover:text-white",
  },
  RiTestTubeLine: {
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    hoverBgColor: "group-hover:bg-orange-500",
    hoverTextColor: "group-hover:text-white",
  },
}

const CustomPrevArrow = (props) => (
  <div
    className="flex absolute -left-2 md:-left-10 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-[#0f0f0f54] hover:bg-[#0f0f0f85] rounded-full h-8 w-8 justify-center items-center"
    onClick={props.onClick}
  >
    <IoIosArrowBack size={25} />
  </div>
)

const CustomNextArrow = (props) => (
  <div
    className="flex absolute -right-2 md:-right-10 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-[#0f0f0f54] hover:bg-[#0f0f0f85] rounded-full h-8 w-8 justify-center items-center"
    onClick={props.onClick}
  >
    <IoIosArrowForward size={25} />
  </div>
)

// Service card component
function ServiceCard({ imageSrc, icon: Icon, title, slug, alt, imgTitle }) {
  const iconName = Icon.displayName || Icon.name
  const colors = colorMap[iconName] || {
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    hoverBgColor: "group-hover:bg-gray-200",
    hoverTextColor: "group-hover:text-white",
  }

  return (
    <div className={`bg-white shadow-lg group h-[10cm]`}>
      <div className="overflow-hidden">
        <Link href={`/${slug}`}>
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={alt}
            title={imgTitle}
            className="w-full h-56 object-cover transform group-hover:scale-125 bg-gray-100 transition duration-500"
          />
        </Link>
      </div>
      <div className="py-8 px-4 items-start justify-center flex flex-col gap-2 flex-wrap md:flex-nowrap">
        <div className="flex items-center w-full gap-4">
          <div
            className={`flex justify-center items-center ${colors.bgColor} ${colors.hoverBgColor} rounded-full p-4 h-fit`}
          >
            <Icon className={`${colors.textColor} ${colors.hoverTextColor} transition duration-300 text-[18px]`} />
          </div>
          <Link href={`/${slug}`} className={`text-[16px] md:text-[18px] font-sans font-bold text-gray-800`}>
            {title}
          </Link>
        </div>
        <div className="flex w-full justify-end">
          <Link href={`/${slug}`} className={`text-primary font-medium flex items-center text-[14px] text-[#bf2e2e]`}>
            READ MORE <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// Client component for the slider
function ProductSlider({ products, heading, subheading }) {
  // Map icons based on product type or id
  const iconMap = [
    GrDocumentTest,
    LuTestTube,
    GrTest,
    FaBacterium,
    GiHeartOrgan,
    GiDna2,
    SiMicrogenetics,
    RiTestTubeLine,
  ]

  // Slider settings
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 2760,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  }

  return (
    <div className="flex justify-center items-center overflow-hidden bg-white mt-9">
      <div className="w-[90%] lg:mb-16">
        {typeof window !== "undefined" && window.location.pathname !== "/product" && (
          <>
            <div>
              <p className="text-primary text-[#bf2e2e] md:text-[20px] font-bold uppercase text-center md:text-left">{heading}</p>
            </div>
            <div className="py-4 lg:flex lg:items-center lg:justify-between gap-2">
              <p className="text-3xl sm:text-4xl text-gray-800 font-sans font-semibold text-center md:text-left">{subheading}</p>
              <p className="py-3 text-gray-500 font-semibold flex flex-wrap gap-2">
                <Link href="/dye-intermediate" className="flex items-center gap-2 text-primary font-semibold text-[#bf2e2e]">
                  View all <FaArrowRight />
                </Link>
              </p>
            </div>
          </>
        )}

        <style>{`
                    .slick-dots {
                        bottom: -50px;
                        z-index: 10;
                    }
                    .slick-dots li button:before {
                        font-size: 15px;
                        color: #b91c1c;
                    }
                    .slick-dots li.slick-active button:before {
                        color: red;
                    }
                    .slider-container {
                        overflow: visible;
                        padding-bottom: 50px;
                    }
                `}</style>

        <Slider {...settings}>
          {Array.isArray(products) &&
            products.map((item, index) => (
              <div key={item._id || index} className="px-2 mb-4 relative">
                <ServiceCard
                  imageSrc={`/api/image/download/${item.photo?.[0]}`}
                  icon={iconMap[index % iconMap.length]}
                  title={item.title || ""}
                  imgTitle={item.imgTitle || ""}
                  alt={item.alt || ""}
                  slug={item.slug || ""}
                />
              </div>
            ))}
        </Slider>
      </div>
    </div>
  )
}

export default ProductSlider
