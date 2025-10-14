"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileText, TestTube, Microscope, Heart, Dna, FlaskConical, ArrowRight } from 'lucide-react';

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
  color: #bf2e2e !important;  /* Changed to red */
  text-decoration: none !important;
}
.html-content a:hover {
  color: #a02424 !important;  /* Darker red on hover */
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
          margin-left:10% !important
          list-style-type: disc;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
    </div>
  );
};

function ProductCategoryGrid() {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);

  const params = useParams();
  const slug = params?.slug?.[params.slug.length - 1];

  const getPartialContent = (htmlContent = '') => {
    if (!htmlContent) return '';
    // Create a temporary element to extract text content properly
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || '';

    // If the content is short enough, return the full HTML
    if (text.length <= 200) {
      return htmlContent;
    }

    // Show first 25% of the content
    const cutoffLength = Math.floor(text.length * 0.25);
    const truncatedText = text.slice(0, cutoffLength);

    // Try to find a good breaking point in the HTML
    const htmlLength = htmlContent.length;
    const ratio = truncatedText.length / text.length;
    const approximateHtmlCutoff = Math.floor(htmlLength * ratio);

    // Find the last complete tag before the cutoff
    let cutoffPoint = approximateHtmlCutoff;
    while (cutoffPoint > 0 && htmlContent[cutoffPoint] !== '>') {
      cutoffPoint--;
    }

    if (cutoffPoint > 0) {
      return htmlContent.substring(0, cutoffPoint + 1) + '...';
    }

    return truncatedText + '...';
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`/api/product/getProductsByCategory?categorySlug=${slug}`, {
          headers: { 'Cache-Control': 'no-store' }
        });

        if (isMounted) {
          setProduct(response.data.products || []);
          setCategory(response.data.category || null);

          // Update metadata
          if (response.data.category) {
            const { metatitle, metadescription, metakeywords } = response.data.category;
            document.title = metatitle || "Product Category";

            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.name = 'description';
              document.head.appendChild(metaDesc);
            }
            metaDesc.content = metadescription || "Browse our product category";

            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
              metaKeywords = document.createElement('meta');
              metaKeywords.name = 'keywords';
              document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = metakeywords || "products, category";
          }
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        if (isMounted) {
          setError('Failed to load category data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (slug) {
      fetchCategoryData();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-[#bf2e2e]">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

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
          {
            `
    .banner-background {
      background-image: url(https://www.admin.apurvachemicals.com/api/logo/download/${category.photo});
    }
  `
          }
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
              <Link href="/" className="text-white hover:text-gray-300 ">Home</Link>
              <span className="text-white">/</span>
              <p className="text-white hover:text-gray-300 cursor-pointer ">{category.category}</p>
            </div>
            <div className='absolute inset-0 bg-black opacity-40 z-1'></div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:mx-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-16 m-4'>
          {product.length > 0 ? (
            product.map((item) => (
              <ServiceCard
                key={item.id || item._id}
                imageSrc={item.photo?.[0] ? `https://www.admin.apurvachemicals.com/api/image/download/${item.photo[0]}` : '/placeholder-product.jpg'}
                icon={iconMap[Math.floor(Math.random() * iconMap.length)]}
                title={item.title}
                imgTitle={item.imgTitle}
                alt={item.alt || item.title}
                slug={item.slug} />
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
                    onClick={() => setShowFullContent(false)}
                  >
                    Show Less
                  </button>
                </>
              ) : (
                <>
                  <HTMLContent html={getPartialContent(category.description)} className="text-gray-800" />
                  {/* Show button if content is truncated (i.e., original text is longer than 25%) */}
                  {category.description.replace(/<[^>]+>/g, '').length > Math.floor(category.description.replace(/<[^>]+>/g, '').length * 0.25) && (
                    <button
                      className="text-[#bf2e2e] mt-4 hover:underline font-medium"
                      onClick={() => setShowFullContent(true)}
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

function ServiceCard({ imageSrc, icon: Icon, title, slug, alt, imgTitle }) {
  const iconName = Icon?.displayName || Icon?.name || 'FileText';
  const colors = colorMap[iconName] || colorMap.FileText;

  return (
    <div className="bg-white shadow-lg group h-auto overflow-hidden rounded-lg transition-transform duration-300 hover:shadow-xl">
      <div className='overflow-hidden h-56'>
        <Link href={`/${slug}`} className="block h-full">
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
          <div className={`flex-shrink-0 flex justify-center items-center ${colors.bgColor} ${colors.hoverBgColor} rounded-full p-3`}>
            {Icon && <Icon className={`${colors.textColor} ${colors.hoverTextColor} transition-colors duration-300 text-lg`} />}
          </div>
          <Link href={`/${slug}`} className="text-lg font-bold  text-gray-800 hover:text-red-600 transition-colors line-clamp-2">
            {title}
          </Link>
        </div>
        <div className="flex justify-end">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
          >
            READ MORE <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}