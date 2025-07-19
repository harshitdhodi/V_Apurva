'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FileText, TestTube2, HeartPulse, Dna, DnaOff, TestTube, ArrowRight, FlaskConical } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import Image from 'next/image';

// TipTapViewer component for rendering rich text
const TipTapViewer = ({ value, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
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
    immediatelyRender: false, // Always set to false for SSR compatibility
  });

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isMounted) return;

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
  }, [isMounted]);

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
};

function ProductCategoryGrid({ category, slug }) {
  const [products, setProducts] = useState(category?.products || []);
  const [isLoading, setIsLoading] = useState(!category);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/product/getProductsByCategory?categorySlug=${slug}`);
          setProducts(response.data.products || []);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();
  }, [category, slug]);

  useEffect(() => {
    if (category) {
      document.title = category.metatitle || 'Default Title';
      document.querySelector('meta[name="description"]')?.setAttribute('content', category.metadescription || 'Default Description');
      document.querySelector('meta[name="keywords"]')?.setAttribute('content', category.metakeywords || 'Default Keywords');
    }
  }, [category]);

  const getPartialContent = (htmlContent) => {
    if (!htmlContent) return '';
    // Find the last complete tag before 25% of the content length
    const contentLength = htmlContent.length;
    const partialLength = Math.floor(contentLength * 0.25);
    const partialContent = htmlContent.substring(0, partialLength);
    // Ensure we don't cut off in the middle of a tag
    const lastTagEnd = partialContent.lastIndexOf('>');
    if (lastTagEnd === -1) return partialContent + '...';
    return partialContent.substring(0, lastTagEnd + 1) + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <style>
        {`
          .banner-background {
            background-image: url(/api/logo/download/${category.photo});
          }
        `}
      </style>
      <div
        className="banner-background relative bg-cover bg-center bg-no-repeat"
        title={category.imgTitle}
      >
        <div className="flex flex-col justify-center items-center h-[40vh] sm:h-[30vh] mb-10">
          <h1 className="font-bold text-white sm:text-2xl md:text-3xl z-10 uppercase text-center">
            {category.name}
          </h1>
          <div className="absolute bottom-16 flex space-x-2 z-10">
            <Link href="/" className="text-white hover:text-gray-300">Home</Link>
            <span className="text-white">/</span>
            <p className="text-white hover:text-gray-300 cursor-pointer">{category.name}</p>
          </div>
          <div className="absolute inset-0 bg-black opacity-40 z-1"></div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-8">{category?.name || 'Products'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <ServiceCard
            key={product.id || index}
            imageSrc={product.image || '/placeholder-product.jpg'}
            icon={iconMap[index % iconMap.length]}
            title={product.name}
            slug={product.slug}
            alt={product.name}
            imgTitle={product.name}
          />
        ))}
      </div>
      <div className="mx-auto w-[95%] m-8">
        <TipTapViewer
          value={
            showFullContent
              ? category.description || ''
              : getPartialContent(category.description || '')
          }
          className="quill"
        />
        {!showFullContent ? (
          <button
            className="text-blue-500 mt-2 hover:underline"
            onClick={() => setShowFullContent(true)}
          >
            Read More
          </button>
        ) : (
          <button
            className="text-blue-500 mt-2 hover:underline"
            onClick={() => setShowFullContent(false)}
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}

const colorMap = {
  FileText: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    hoverBgColor: 'group-hover:bg-blue-500',
    hoverTextColor: 'group-hover:text-white',
  },
  TestTube2: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    hoverBgColor: 'group-hover:bg-green-500',
    hoverTextColor: 'group-hover:text-white',
  },
  FlaskConical: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
    hoverBgColor: 'group-hover:bg-red-500',
    hoverTextColor: 'group-hover:text-white',
  },
  HeartPulse: {
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    hoverBgColor: 'group-hover:bg-purple-500',
    hoverTextColor: 'group-hover:text-white',
  },
  Dna: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    hoverBgColor: 'group-hover:bg-yellow-500',
    hoverTextColor: 'group-hover:text-white',
  },
  DnaOff: {
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-600',
    hoverBgColor: 'group-hover:bg-pink-500',
    hoverTextColor: 'group-hover:text-white',
  },
  TestTube: {
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    hoverBgColor: 'group-hover:bg-orange-500',
    hoverTextColor: 'group-hover:text-white',
  },
};

const iconMap = [FileText, TestTube2, FlaskConical, HeartPulse, Dna, DnaOff, TestTube];

function ServiceCard({ imageSrc, icon: Icon, title, slug, alt, imgTitle }) {
  const iconName = Icon.displayName || Icon.name;
  const colors = colorMap[iconName] || {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    hoverBgColor: 'group-hover:bg-gray-200',
    hoverTextColor: 'group-hover:text-white',
  };

  return (
    <div className="bg-white shadow-lg group h-auto">
      <div className="overflow-hidden">
        <Link href={`/${slug}`}>
          <Image
            src={imageSrc}
            alt={alt}
            title={imgTitle}
            className="w-full h-56 object-cover bg-gray-100 transform group-hover:scale-125 transition duration-500"
            width={400}
            height={224}
            priority={false}
          />
        </Link>
      </div>
      <div className="py-5 px-4 items-start justify-center flex flex-col gap-2 flex-wrap md:flex-nowrap">
        <div className="flex items-center w-full gap-4">
          <div className={`flex justify-center items-center ${colors.bgColor} ${colors.hoverBgColor} rounded-full p-4 h-fit`}>
            <Icon className={`${colors.textColor} ${colors.hoverTextColor} transition duration-300 text-[18px]`} />
          </div>
          <Link href={`/${slug}`} className="text-[18px] font-bold text-gray-800">
            {title}
          </Link>
        </div>
        <div className="flex w-full justify-end">
          <Link href={`/${slug}`} className="text-primary font-medium flex items-center text-[14px]">
            READ MORE <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCategoryGrid;