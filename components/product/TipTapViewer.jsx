// TipTapViewer.jsx
'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import DOMPurify from 'isomorphic-dompurify';

/**
 * TipTapViewer - Hydration-safe, lazy-loaded rich text viewer
 * @param {string} value - Raw HTML or TipTap JSON content
 * @param {string} [className] - Additional CSS classes
 */
const TipTapViewer = ({ value, className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Sanitize HTML consistently on SSR and CSR
  const sanitizedValue = useMemo(() => {
    if (!value) return '';
    return DOMPurify.sanitize(value, {
      ADD_TAGS: ['style'],
      ADD_ATTR: ['class', 'style'],
    });
  }, [value]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'No content available',
      }),
    ],
    content: sanitizedValue,
    editable: false,
    editorProps: {
      attributes: {
        class: `prose max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-xl text-gray-800 focus:outline-none ${className || ''}`.trim(),
      },
    },
    immediatelyRender: false, // Prevents SSR rendering mismatch
  });

  // Mark component as mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lazy load when element enters viewport
  useEffect(() => {
    if (!containerRef.current || !isMounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isMounted]);

  // Show skeleton during SSR / before mount
  if (!isMounted) {
    return (
      <div ref={containerRef} className={className}>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {isVisible && editor ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      )}
    </div>
  );
};

export default TipTapViewer;