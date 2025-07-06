// components/OurPeopleClient.js (Client Component)
"use client"
import  Image from 'next/image'

import TipTapViewerClient from "./TipTapViewer"

function OurPeopleClient({ data }) {
  const { heading, subheading, description, currentPhoto, altText, imgTitle } = data

  return (
    <div className="bg-white w-full relative -top-20">
      <div className="flex flex-col-reverse bg-white lg:flex-row w-[90%] justify-center items-center mx-auto py-16 gap-8">
        {/* Content Section - 60% width on large screens */}
        <div className="flex flex-col justify-center text-black lg:w-[65%] w-full">
          <p className="uppercase md:text-[20px] text-[#bf2e2e] font-bold mb-4 text-center md:text-left">
            {heading ? `____${heading}` : ''}
          </p>
          <h2 className="font-daysOne text-3xl sm:text-4xl font-bold mb-8 text-center md:text-left text-gray-800">
            {subheading}
          </h2>
          <div className="md:text-[18px] prose max-w-none">
            <TipTapViewerClient value={description} className="tiptap-content" />
          </div>
        </div>

        {/* Image Section - 40% width on large screens */}
        {currentPhoto && (
          <div className="lg:w-[35%] w-full flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-square">
              <Image
                src={`/api/logo/download/${currentPhoto}`}
                alt={altText}
                title={imgTitle}
                className="w-full h-full object-contain rounded-lg"
                width={500}
                height={500}
                priority={false}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/placeholder-image.jpg'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OurPeopleClient