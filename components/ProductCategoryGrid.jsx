"use client"
import { useState } from 'react';
import Link from 'next/link';
import { FileText, TestTube, Microscope, Heart, Dna, FlaskConical, ArrowRight } from 'lucide-react';
import { useClickTracking } from '@/lib/useClickTracking';
import Image from 'next/image';
import img from "../public/logo.png"
// Safe HTML content renderer with proper list styling
const HTMLContent = ({ html, className = "" }) => {
  const cleanedHtml = (html || "").replace(/<p>(\s|&nbsp;)*<\/p>/gi, "");

  return (
    <div className={`html-content prose max-w-none ${className}`}>
      <style jsx global>{`
        .html-content h1, 
        .html-content h2, 
        .html-content h3, 
        .html-content h4, 
        .html-content h5, 
        .html-content h6 {
          color: #1a202c !important;
          font-weight: 600 !important;
          margin: 1.5em 0 0.75em 0 !important;
          line-height: 1.3 !important;
        }
        .html-content h1 {
          font-size: 30px !important;
          border-bottom: 1px solid #e2e8f0 !important;
          padding-bottom: 0.3em !important;
        }
        .html-content h2 {
          font-size: 1.5em !important;
          border-bottom: 1px solid #edf2f7 !important;
          padding-bottom: 0.3em !important;
        }
        .html-content h3 {
          font-size: 1.25em !important;
        }
        .html-content p {
          margin: 1em 0 !important;
          line-height: 1.6 !important;
          color: #374151 !important;
        }
        .html-content ul {
          list-style-type: disc !important;
          padding-left: 1.5em !important;
          margin: 1em 0 !important;
          display: block !important;
          margin-left:3% !important;
        }
        .html-content ol {
          list-style-type: decimal !important;
          padding-left: 1.5em !important;
          margin: 1em 0 !important;
          display: block !important;
          margin-left:10% !important;
        }
        .html-content li {
          margin: 0.5em 0 !important;
          display: list-item !important;
          padding-left: 0.25em !important;
          line-height: 1.6 !important;
          color: #374151 !important;
        }
        .html-content ul li::marker {
          color: #6b7280 !important;
          font-size: 1em !important;
        }
        .html-content ol li::marker {
          color: #6b7280 !important;
          font-weight: 600 !important;
        }
        .html-content a {
          color: #bf2e2e !important;
          text-decoration: none !important;
        }
        .html-content a:hover {
          color: #a02424 !important;
          text-decoration: underline !important;
        }
        .html-content strong {
          font-weight: 600 !important;
        }
        .html-content em {
          font-style: italic !important;
        }
        .html-content blockquote {
          border-left: 4px solid #e5e7eb !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          color: #6b7280 !important;
        }
        .html-content code {
          background-color: #f3f4f6 !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-size: 0.875em !important;
          color: #dc2626 !important;
        }
        .html-content p:empty,
        .html-content p:has(br:only-child) {
          display: none !important;
        }
        .html-content pre {
          background-color: #f3f4f6 !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
          margin: 1rem 0 !important;
        }
        .html-content table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1rem 0 !important;
        }
        .html-content th,
        .html-content td {
          border: 1px solid #e5e7eb !important;
          padding: 0.5rem !important;
          text-align: left !important;
        }
        .html-content th {
          background-color: #f9fafb !important;
          font-weight: 600 !important;
        }
        .prose ul, 
        .prose ol {
          padding-left: 1.5em;
          margin: 1em 0;
          margin-left:10% !important;
          list-style-type: disc;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
    </div>
  );
};

function ProductCategoryGrid({ initialData, slug }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const { trackEvent } = useClickTracking();
  
  // Use the data passed from server component
  const product = initialData?.products || [];
  const category = initialData?.category || null;

  const getPartialContent = (htmlContent = '') => {
    if (!htmlContent) return '';
    
    // Check if we're in a browser environment
    if (typeof document === 'undefined') return htmlContent.substring(0, 200) + '...';
    
    try {
      // Create a temporary element to extract text content properly
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      const text = tempDiv.textContent || tempDiv.innerText || '';

      // If the content is short enough, return the full HTML
      if (text.length <= 200) {
        return htmlContent;
      }

      // Otherwise, find a good breaking point and add a "Read more" link
      const words = text.split(' ');
      let preview = '';
      let charCount = 0;
      
      for (const word of words) {
        if (charCount + word.length > 200) break;
        preview += (preview ? ' ' : '') + word;
        charCount += word.length + 1;
      }
      
      // Find the last space or punctuation to make a clean break
      const lastSpace = Math.max(
        preview.lastIndexOf(' '),
        preview.lastIndexOf('.'),
        preview.lastIndexOf(',')
      );
      
      if (lastSpace > 0) {
        preview = preview.substring(0, lastSpace + 1);
      }
      
      return `${preview}...`;
    } catch (error) {
      console.error('Error processing HTML content:', error);
      return htmlContent.substring(0, 200) + '...';
    }
  }

  const handleReadMore = () => {
    trackEvent('button_click', {
      buttonName: 'read_more_category_description',
      metadata: {
        category: category?.category,
        action: 'expand',
        page: 'product_category_grid'
      }
    });
    setShowFullContent(true);
  };

  const handleReadLess = () => {
    trackEvent('button_click', {
      buttonName: 'read_less_category_description',
      metadata: {
        category: category?.category,
        action: 'collapse',
        page: 'product_category_grid'
      }
    });
    setShowFullContent(false);
  };

  const handleHomeClick = () => {
    trackEvent('button_click', {
      buttonName: 'breadcrumb_home',
      metadata: {
        breadcrumb: 'home',
        page: 'product_category_grid'
      }
    });
  };

  if (!category) {
    return (
      <div className="text-center py-10">
        <p>No category found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="pb-14">
        <style>
          {`
            .banner-background {
              background-image: url(https://admin.apurvachemicals.com/api/logo/download/${category.photo});
            }
          `}
        </style>
        <div
          className={`banner-background relative bg-cover bg-center bg-no-repeat`}
          title={category.imgTitle}
        >
          <div className='flex flex-col justify-center items-center h-[40vh] sm:h-[30vh] mb-10'>
            <h1 className='font-bold text-white sm:text-2xl md:text-3xl z-10 uppercase text-center'>
              {category.category}
            </h1>
            <div className="absolute bottom-16 flex space-x-2 z-10">
              <Link 
                href="/" 
                className="text-white hover:text-gray-300"
                onClick={handleHomeClick}
              >
                Home
              </Link>
              <span className="text-white">/</span>
              <p className="text-white hover:text-gray-300 cursor-pointer">{category.category}</p>
            </div>
            <div className='absolute inset-0 bg-black opacity-40 z-1'></div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:mx-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-16 m-4'>
          {product.length > 0 ? (
            product.map((item) => (
              <ServiceCard
                key={item.id || item._id}
                imageSrc={`https://admin.apurvachemicals.com/api/image/download/${item.photo[0]}`}
                icon={iconMap[Math.floor(Math.random() * iconMap.length)]}
                title={item.title}
                imgTitle={item.imgTitle}
                alt={item.alt || item.title}
                slug={item.slug}
                categoryName={category.category}
                trackEvent={trackEvent}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No products found in this category.</p>
            </div>
          )}
        </div>

        {category.description && (
          <div className="mx-auto w-[95%] m-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              {showFullContent ? (
                <>
                  <HTMLContent html={category.description} className="text-gray-800" />
                  <button
                    className="text-[#bf2e2e] mt-4 hover:underline font-medium"
                    onClick={handleReadLess}
                  >
                    Show Less
                  </button>
                </>
              ) : (
                <>
                  <HTMLContent html={getPartialContent(category.description)} className="text-gray-800" />
                  {category.description.replace(/<[^>]+>/g, '').length > Math.floor(category.description.replace(/<[^>]+>/g, '').length * 0.25) && (
                    <button
                      className="text-[#bf2e2e] mt-4 hover:underline font-medium"
                      onClick={handleReadMore}
                    >
                      Read More
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductCategoryGrid;

const iconMap = [FileText, TestTube, Microscope, Heart, Dna, FlaskConical];

const colorMap = {
  FileText: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    hoverBgColor: 'group-hover:bg-blue-500',
    hoverTextColor: 'group-hover:text-white',
  },
  TestTube: {
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-600',
    hoverBgColor: 'group-hover:bg-teal-500',
    hoverTextColor: 'group-hover:text-white',
  },
  Microscope: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    hoverBgColor: 'group-hover:bg-green-500',
    hoverTextColor: 'group-hover:text-white',
  },
  Heart: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
    hoverBgColor: 'group-hover:bg-[#bf2e2e]',
    hoverTextColor: 'group-hover:text-white',
  },
  Dna: {
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    hoverBgColor: 'group-hover:bg-purple-500',
    hoverTextColor: 'group-hover:text-white',
  },
  FlaskConical: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    hoverBgColor: 'group-hover:bg-yellow-500',
    hoverTextColor: 'group-hover:text-white',
  },
};

function ServiceCard({ imageSrc, icon: Icon, title, slug, alt, imgTitle, categoryName, trackEvent }) {
  const iconName = Icon?.displayName || Icon?.name || 'FileText';
  const colors = colorMap[iconName] || colorMap.FileText;

  const handleProductImageClick = () => {
    trackEvent('button_click', {
      buttonName: 'product_image_click',
      metadata: {
        productTitle: title,
        productSlug: slug,
        category: categoryName,
        page: 'product_category_grid'
      }
    });
  };

  const handleProductTitleClick = () => {
    trackEvent('button_click', {
      buttonName: 'product_title_click',
      metadata: {
        productTitle: title,
        productSlug: slug,
        category: categoryName,
        page: 'product_category_grid'
      }
    });
  };

  const handleReadMoreClick = () => {
    trackEvent('button_click', {
      buttonName: 'product_read_more',
      metadata: {
        productTitle: title,
        productSlug: slug,
        category: categoryName,
        page: 'product_category_grid',
        action: 'navigate_to_product'
      }
    });
  };

  return (
    <div className="bg-white shadow-lg group h-auto overflow-hidden rounded-lg transition-transform duration-300 hover:shadow-xl">
      <div className='overflow-hidden h-56'>
        <Link href={`/${slug}`} className="block h-full" onClick={handleProductImageClick}>
          <img
            src={imageSrc}
            alt={alt}
            title={imgTitle}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </Link>
      </div>
      <div className="p-5">
        <div className='flex items-center gap-4 mb-3'>
          <div className={`flex-shrink-0 flex justify-center items-center bg-red-100 rounded-full p-3`}>
            {/* {Icon && <Icon className={`${colors.textColor} ${colors.hoverTextColor} transition-colors duration-300 text-lg`} />} */}

          <Image
            src={img}
            alt={alt}
            title={imgTitle}
            width={50}
            height={50}
            className="w-10 h-10 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.jpg';
            }}
          />
          </div>
          <Link 
            href={`/${slug}`} 
            className="text-lg font-bold text-gray-800 hover:text-red-600 transition-colors line-clamp-2"
            onClick={handleProductTitleClick}
          >
            {title}
          </Link>
        </div>
        <div className="flex justify-end">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
            onClick={handleReadMoreClick}
          >
            READ MORE <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}