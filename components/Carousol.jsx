'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ContactUsInquiryForm from './ContactUsInquiry';
import ParticleBackground from './ParticleBackground';

function Carousol() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const textRefs = useRef([]);
  const imgRefs = useRef([]);
  const buttonRefs = useRef([]);

  useEffect(() => {
    document.body.style.overflow = showInquiryForm ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showInquiryForm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/banner/getBannersBySectionHome', {
          method: 'GET',
          credentials: 'include',
        });
        const json = await res.json();
        setBanners(json?.data || []);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  useEffect(() => {
    if (!loading && banners.length > 0) {
      gsap.fromTo(
        textRefs.current[currentSlide],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      );
      gsap.fromTo(
        imgRefs.current[currentSlide],
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1 }
      );
      gsap.fromTo(
        buttonRefs.current[currentSlide],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.3 }
      );
    }
  }, [currentSlide, loading, banners.length]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (banners.length === 0) return <div className="text-center py-10">No banners found</div>;

  return (
    <div className="relative overflow-hidden w-full min-h-[600px] bg-white">
      <ParticleBackground />
      {showInquiryForm && <ContactUsInquiryForm onClose={() => setShowInquiryForm(false)} />}

      <div className="relative w-full h-full">
        {banners.map((slide, index) => {
          const editor = useEditor({
            content: slide.details,
            extensions: [StarterKit],
            editable: false,
          });

          return (
            <div
              key={index}
              className={`absolute inset-0 px-4 py-8 transition-opacity duration-700 ease-in-out flex flex-col items-center justify-center text-center
                ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <img
                ref={(el) => (imgRefs.current[index] = el)}
                className="max-w-[90%] h-auto object-contain sm:max-w-md md:max-w-lg lg:max-w-xl mb-6"
                src={`/api/image/download/${slide.photo[0]}`}
                alt={slide.alt[0]}
                title={slide.imgTitle[0]}
              />

              <div className="space-y-4 max-w-xl" ref={(el) => (textRefs.current[index] = el)}>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{slide.title}</h2>
                <div className="text-gray-700 prose prose-sm mx-auto">
                  {editor && <EditorContent editor={editor} />}
                </div>
              </div>

              <div
                className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
                ref={(el) => (buttonRefs.current[index] = el)}
              >
                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded"
                >
                  INQUIRY NOW
                </button>
                <Link href="/about-us">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded">
                    ABOUT US
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Carousol;
