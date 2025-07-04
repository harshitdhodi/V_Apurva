"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';

// TipTapViewer component
const TipTapViewer = ({ value, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'No content available',
      }),
    ],
    content: value || '',
    editable: false,
    editorProps: {
      attributes: {
        class: `prose max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-xl text-gray-800 focus:outline-none ${className || ''}`,
      },
    },
    immediatelyRender: !!value,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`${className || ''}`}>
      {isVisible && editor && <EditorContent editor={editor} />}
    </div>
  );
};

// Simplified Image Component for SSG
const StaticImage = ({ src, alt, title, className, width, height, priority = false }) => {
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      title={title}
      className={className}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
      quality={85}
    />
  );
};

const VideoComponent = () => {
  const pathname = usePathname();
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/aboutus/active`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPageContent(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-red-500">
        Error loading content: {error}
      </div>
    );
  }

  // Handle case where no content is available
  if (!pageContent) {
    return (
      <div className="flex justify-center relative -top-20 items-center md:py-16 bg-gray-100 min-h-[300px]">
        <div className="p-4 md:px-20 w-full max-w-8xl">
          <div className="text-center text-gray-500 py-10">No content available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center relative -top-20 items-center md:py-16 bg-gray-100 min-h-[300px]">
      <div className="p-4 md:px-20 w-full max-w-8xl">
        <div className="xl:flex xl:gap-10">
          <div className="flex justify-center items-center xl:w-1/2">
            {pageContent?.photo?.[0] ? (
              <div className="relative">
                <StaticImage
                  src={`/api/image/download/${pageContent.photo[0]}`}
                  alt={pageContent.alt?.[0] || "Video thumbnail"}
                  title={pageContent.imgTitle?.[0] || ""}
                  className="md:w-auto md:h-auto md:max-w-full rounded-lg"
                  width={600}
                  height={400}
                  priority={true}
                />

                {/* Static play button - links to video instead of modal */}
                {pageContent.video && (
                  <div className="absolute bottom-10 sm:bottom-24 md:bottom-10 md:inset-0 md:flex md:justify-center md:items-center">
                    <Link
                      href={pageContent.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-white bg-[#bf2e2e] hover:bg-secondary p-5 xl:p-10 rounded-full flex justify-center items-center md:text-xl transition-all duration-200 hover:scale-105"
                      aria-label="Play video"
                    >
                      <svg
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
                {pageContent.photo[1] && (
                  <div className="hidden md:block absolute bottom-0 -left-[6rem] md:w-[40%]">
                    <StaticImage
                      src={`/api/image/download/${pageContent.photo[1]}`}
                      alt={pageContent.alt?.[1] || "Secondary image"}
                      title={pageContent.imgTitle?.[1] || ""}
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
              <p
                className="text-3xl sm:text-4xl md:px-0 font-bold md:text-[40px] text-gray-800 mt-4 md:text-left"
                style={{ fontFamily: '"Days One", sans-serif' }}
              >
                {pageContent.subheading}
              </p>
              <TipTapViewer
                value={pageContent.shortDescription || ""}
                className={
                  pathname === "/about-us"
                    ? "justify-center mt-8 text-black"
                    : "justify-center sm:my-8 -ml-4 text-black"
                }
              />
            </div>

            {pathname === "/about-us" && (
              <TipTapViewer value={pageContent.longDescription || ""} className="justify-center text-justify pt-4" />
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
  );
};

export default VideoComponent;