'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import Image from 'next/image';

// TipTapViewer component with lazy-loading
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
      immediatelyRender: false, // ✅ fixes SSR hydration warning
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

function OurPeople() {
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [description, setDescription] = useState('');
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [altText, setAltText] = useState('');
  const [imgTitle, setImgTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=ourpeople');
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error('Error fetching headings:', error);
    }
  };

  const fetchOurPeople = async () => {
    try {
      const response = await axios.get('/api/ourpeople/getOurPeople');
      if (response.data.success && response.data.data.length > 0) {
        const ourPeople = response.data.data[0];
        setDescription(ourPeople.description || '');
        setCurrentPhoto(ourPeople.photo);
        setAltText(ourPeople.alt || '');
        setImgTitle(ourPeople.imgTitle || '');
      }
    } catch (error) {
      console.error('Error fetching our people data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadings();
    fetchOurPeople();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center bg-white items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2e2e]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full relative -top-20">
      <div className="flex flex-col-reverse bg-white lg:flex-row w-[90%] justify-center items-center mx-auto py-16 gap-8">
        {/* Content Section - 60% width on large screens */}
        <div className="flex flex-col justify-center text-black lg:w-[65%] w-full">
          <p className="uppercase md:text-[20px] text-[#bf2e2e] font-bold mb-4 text-center md:text-left">
            {heading ? `____${heading}` : ''}
          </p>
          <h2 className="font-daysOne text-3xl sm:text-4xl mb-8 text-center md:text-left text-gray-800">
            {subheading}
          </h2>
          <div className="md:text-[20px] prose max-w-none">
            <TipTapViewer value={description} className="tiptap-content" />
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
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OurPeople;