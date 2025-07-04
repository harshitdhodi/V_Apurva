"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import TipTapViewer from './TipTapViewer';

export default function ClientVideo({ pagecontent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const location = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openModal = () => {
    if (pagecontent?.video) {
      setIsModalOpen(true);
      setVideoUrl(pagecontent.video);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setVideoUrl('');
  };

  if (!isClient) {
    return (
      <div className="p-4 md:px-20 w-full max-w-screen-xl">
        <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  if (!pagecontent) {
    return (
      <div className="p-4 md:px-20 w-full max-w-screen-xl">
        <div className="text-center text-gray-500 py-10">No content available</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:px-20 w-full max-w-screen-xl">
      <div className="xl:flex xl:gap-10">
        <div className="flex justify-center items-center xl:w-1/2">
          {pagecontent?.photo?.[0] ? (
            <div className="relative">
              <Image
                src={`/api/image/download/${pagecontent.photo[0]}`}
                alt={pagecontent.alt?.[0] || 'Video thumbnail'}
                title={pagecontent.imgTitle?.[0] || ''}
                className="md:w-auto md:h-auto md:max-w-full rounded-lg"
                width={600}
                height={400}
                priority
              />
              <div className="absolute bottom-10 sm:bottom-24 md:bottom-10 md:inset-0 md:flex md:justify-center md:items-center">
                <div
                  onClick={openModal}
                  className="cursor-pointer text-white animate-pulse bg-[#bf2e2e] hover:bg-secondary p-5 xl:p-10 rounded-full flex justify-center items-center md:text-xl"
                >
                  <Play size={24} />
                </div>
              </div>
              {pagecontent.photo[1] && (
                <div className="hidden md:block absolute bottom-0 -left-[6rem] md:w-[40%]">
                  <Image
                    src={`/api/image/download/${pagecontent.photo[1]}`}
                    alt={pagecontent.alt?.[1] || 'Secondary image'}
                    title={pagecontent.imgTitle?.[1] || ''}
                    width={200}
                    height={200}
                    className="rounded-lg"
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
            <p
              className="text-3xl sm:text-4xl md:px-0 font-bold md:text-[40px] text-gray-800 mt-4 md:text-left"
              style={{ fontFamily: '"Days One", sans-serif' }}
            >
              {pagecontent.subheading}
            </p>

            <TipTapViewer
              value={pagecontent.shortDescription || ''}
              className={
                location === '/about-us'
                  ? 'justify-center mt-8 text-black'
                  : 'justify-center sm:my-8 -ml-4 text-black'
              }
            />
          </div>

          {location === '/about-us' && (
            <TipTapViewer
              value={pagecontent.longDescription || ''}
              className="justify-center text-justify pt-4"
            />
          )}

          {location !== '/about-us' && (
            <div className="flex justify-center md:justify-start">
              <Link
                href="/about-us"
                className="cursor-pointer bg-[#bf2e2e] hover:bg-secondary text-white font-semibold p-4 md:px-7 rounded uppercase"
              >
                Know More
              </Link>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg relative w-11/12 md:w-4/5 lg:w-3/4 xl:w-1/2 h-1/2 md:h-3/5">
            <button
              className="absolute top-2 right-2 p-2 text-white bg-black rounded-full z-50 w-8 h-8 flex items-center justify-center"
              onClick={closeModal}
            >
              ✖
            </button>
            <div className="w-full h-full">
              <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}