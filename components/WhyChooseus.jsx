"use client";

import { Suspense, memo, useState, useEffect } from "react";
import axios from "axios";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';

// FeatureCard component with memoization for better performance
const FeatureCard = memo(({ icon, title, description }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'No content available',
      }),
    ],
    content: description || '',
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none text-white focus:outline-none',
      },
    },
    immediatelyRender: !!description,
  });

  return (
    <div className="flex flex-col justify-center items-center md:items-start p-6">
      <div className="bg-white rounded-full p-6 w-fit mb-8 transition-all duration-1000 hover:scale-105">
        <video
          className="w-[2.3cm] object-cover transition-all duration-1000"
          src={`/api/video/${icon}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<div class="w-[2.3cm] h-[2.3cm] bg-gray-200 rounded flex items-center justify-center text-gray-500">📹</div>';
          }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <h3 className="text-2xl mb-4 text-white font-daysOne text-center md:text-left">
        {title}
      </h3>
      <Suspense fallback={<div className="h-16 w-64 bg-gray-700 rounded animate-pulse" />}>
        {description && editor && <EditorContent editor={editor} />}
      </Suspense>
    </div>
  );
});

// Add display name for debugging
FeatureCard.displayName = 'FeatureCard';

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="flex flex-col justify-center items-center md:items-start p-6 animate pulse">
    <div className="bg-gray-700 rounded-full w-20 h-20 mb-8" />
    <div className="h-6 w-40 bg-gray-700 rounded mb-4" />
    <div className="h-16 w-64 bg-gray-700 rounded" />
    <div className="h-4 w-48 bg-gray-700 rounded mt-2" />
  </div>
);

// Error boundary component
const ErrorFallback = ({ error, resetError }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
    <p className="text-red-600 mb-4">Unable to load the content</p>
    <button 
      onClick={resetError}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

function WhyChooseUs() {
  const [data, setData] = useState({
    heading: "Why Choose Us",
    subheading: "Discover What Makes Us Different",
    items: [],
    loading: true,
    error: null
  });

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const [headingsResponse, dataResponse] = await Promise.all([
        axios.get(`/api/pageHeading/heading?pageType=whychooseus`, {
          headers: { 
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
          },
          timeout: 10000,
        }),
        axios.get(`/api/whychooseus/getAllWhyChooseUs`, {
          headers: { 
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
          },
          timeout: 10000,
        }),
      ]);

      const { heading = "Why Choose Us", subheading = "Discover What Makes Us Different" } = headingsResponse.data || {};
      const items = Array.isArray(dataResponse.data?.data) ? dataResponse.data.data : [];

      setData({
        heading,
        subheading,
        items,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      
      setData(prev => ({
        ...prev,
        loading: false,
        error: "Failed to load content"
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    fetchData();
  };

  if (data.error) {
    return (
      <div className="bg-black text-white py-16 px-4 flex justify-center items-center mb-16">
        <div className="max-w-6xl mx-auto">
          <ErrorFallback error={data.error} resetError={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <section className="bg-black text-white py-16 px-4 flex justify-center items-center mb-16">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h2 className="md:text-[20px] font-bold text-[#bf2e2e] mb-6 uppercase tracking-wider">
            {data.heading}
          </h2>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-daysOne capitalize leading-tight">
            {data.subheading}
          </h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
          {data.loading || data.items.length === 0 ? (
            Array.from({ length: 4 }, (_, index) => (
              <SkeletonLoader key={`skeleton-${index}`} />
            ))
          ) : (
            data.items.map((item, index) => (
              <FeatureCard
                key={item.id || `feature-${index}`}
                icon={item.photo}
                title={item.title}
                description={item.description}
              />
            ))
          )}
        </div>
        
        {!data.loading && data.items.length === 0 && !data.error && (
          <div className="text-center mt-12">
            <p className="text-gray-400 text-lg">No features available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default WhyChooseUs;