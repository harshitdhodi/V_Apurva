"use client"

import Image from "next/image"
import Link from "next/link"
import TipTapViewerClient from "./TipTapViewer"
import TipTapSkeleton from "./TipTapSkeleton"
import { Suspense } from "react"
import { usePathname } from 'next/navigation'

const VideoClient = ({ data }) => {
    const pathname = usePathname();

  return (
    <div className="flex justify-center relative items-center md:py-16 bg-gray-100 min-h-[300px]">
      <div className="p-4 md:px-20 w-full max-w-8xl">
        <div className="xl:flex xl:gap-10">
          <div className="flex justify-center items-center xl:w-1/2">
            {data?.photo?.[0] ? (
              <div className="relative w-[600px]">
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
                {/* Static play button - links to video instead of modal */}
                {data.video && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <Link
                      href={data.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative z-10 bg-[#bf2e2e] cursor-pointer text-white animate-pulse bg-primary hover:bg-secondary p-5 xl:p-10 rounded-full flex justify-center items-center md:text-xl"
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
                    </Link>
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
                      ? "justify-center mt-8 text-[18px] text-black"
                      : "justify-center sm:my-8 text-black"
                  }
                />          
              </Suspense>
            </div>

            {pathname === "/about-us" && (
              <Suspense fallback={<TipTapSkeleton className="justify-center pt-4" />}>
                <TipTapViewerClient
                  value={data.longDescription || ""}
                  className="justify-center text-justify pt-4"
                />
              </Suspense>
            )}

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
    </div>
  )
}

export default VideoClient