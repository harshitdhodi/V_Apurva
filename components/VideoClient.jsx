"use client"

import Image from "next/image"
import Link from "next/link"
import TipTapViewerClient from "./TipTapViewer"
import TipTapSkeleton from "./TipTapSkeleton"
import { Suspense, useState } from "react"
import { usePathname } from 'next/navigation'

// Helper function to extract YouTube video ID and create embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
  let videoId = '';
  
  // Extract from youtube.com/watch?v=
  if (url.includes('youtube.com/watch')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  }
  // Extract from youtu.be/
  else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  }
  // Extract from youtube.com/embed/
  else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0];
  }
  // If it's just a video ID
  else if (url.length === 11 && !url.includes('/')) {
    videoId = url;
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
};

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen || !videoUrl) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full mt-10 max-w-4xl relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-8 right-0 md:-right-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white hover:text-gray-300 transition-all"
            aria-label="Close video"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24" 
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Video container */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </>
  );
};

const VideoClient = ({ data }) => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(data.video || null);

  return (
      <div className="flex justify-center relative items-center md:py-16 bg-gray-100 min-h-[300px]">
      <div className="p-4 md:px-20 w-full max-w-8xl">
        <div className="xl:flex xl:gap-10">
          <div className="flex justify-center items-center xl:w-1/2">
            {data?.photo?.[0] ? (
              <div className="relative lg:w-[600px] w-[400px]">
                <Image
                  src={`/api/image/download/${data.photo[0]}`}
                  alt={data.alt?.[0] || "Video thumbnail"}
                  title={data.imgTitle?.[0] || ""}
                  className="w-full h-auto rounded-lg"
                  width={1200}
                  height={800}
                  priority={true}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Rest of your component remains the same */}
                {data?.video && embedUrl && (  // Add optional chaining here
                  <div className="absolute inset-0 flex justify-center items-center">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="group relative z-10 bg-[#bf2e2e] cursor-pointer text-white animate-pulse bg-primary hover:bg-secondary p-5 xl:p-10 rounded-full flex justify-center items-center md:text-xl transition-all"
                      aria-label="Play video"
                    >
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 group-hover:animate-ping-slow"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </button>
                  </div>
                )}
                {/* Secondary image */}
                {data.photo[1] && (
                  <div className="hidden md:block absolute bottom-0 -left-[6rem] md:w-[40%]">
                    <Image
                      src={`/api/image/download/${data.photo[1]}`}
                      alt={data.alt?.[1] || "Secondary image"}
                      title={data.imgTitle?.[1] || ""}
                      width={200}
                      height={200}
                      className="rounded-lg"
                      priority={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          <div className="py-5 space-y-10 xl:w-1/2">
            <div className="mt-5">
              <h2
                className="text-3xl sm:text-4xl md:px-0 font-bold md:text-[40px] text-gray-800 mt-4 md:text-start"
                style={{ fontFamily: '"Days One", sans-serif' }}
              >
                {data.subheading}
              </h2> 
              <Suspense fallback={<TipTapSkeleton className="justify-center mt-8" />}>
                <TipTapViewerClient
                  value={data.shortDescription || ""}
                  className={
                    pathname === "/about-us"
                      ? "justify-center text-justify  mt-8 font-sans text-[18px] text-black"
                      : "justify-center text-justify  sm:my-8 text-lg font-sans text-black"
                  }
                />          
              </Suspense>
            {pathname === "/about-us" && (
              <Suspense fallback={<TipTapSkeleton className="justify-center" />}>
                <TipTapViewerClient
                  value={data.longDescription || ""}
                  className="justify-center text-justify pb-10 md:pb-5  font-sans text-[18px] text-black"
                />
              </Suspense>
            )}
            </div>

            {pathname !== "/about-us" && (
              <div className="flex justify-center md:justify-start">
                <Link
                  href="/about-us"
                  className="cursor-pointer bg-[#bf2e2e] hover:bg-secondary text-white font-semibold p-4 md:px-7 rounded uppercase transition-colors duration-200"
                >
                  Know More
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        videoUrl={embedUrl}
      />
    </div>
  )
}

export default VideoClient