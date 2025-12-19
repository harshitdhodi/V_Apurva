"use client"

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';

export default function TipTapViewerClient({ value, className }) {
  const [isMounted, setIsMounted] = useState(false);
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
    // Ensure this is always false for SSR compatibility
    immediatelyRender: false,
  });

  // Only run on client
  useEffect(() => {
    setIsMounted(true);

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

  // Don't render editor content until mounted and visible
  if (!isMounted) {
    return (
      <div ref={containerRef} className={`${className || ''}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${className || ''}`}>
      {isVisible && editor && <EditorContent editor={editor} />}
    </div>
  );
}
