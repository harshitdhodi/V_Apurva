'use client';

import { useState, useRef } from 'react';
import ProductImages from '@/components/product/ProductImages';
import { ProductDetailsTable } from '@/components/product/ProductDetailsTable';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import MSDSSection from '@/components/product/MSDSSection';
import { FileText, TestTube2, Dna, HeartPulse, DnaOff, FlaskConical, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const iconMap = [
  FileText,
  TestTube2,
  FlaskConical,
  HeartPulse,
  Dna,
  DnaOff,
  TestTube2,
];

export default function ProductDetail({ initialProduct, initialRelatedProducts = [], slug }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const descriptionRef = useRef(null);
console.log("product",initialProduct)
  // Use the data passed from server-side
  const product = initialProduct;
  const relatedProducts = initialRelatedProducts;

  // Helper function to strip HTML tags for meta description
  const stripHtmlTags = (html) => {
    if (typeof document === 'undefined') return '';
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  };

  // Generate meta description from product details
const getMetaDescription = () => {
  if (product?.productData?.details) {
    const plainText = stripHtmlTags(product.productData.details);
    const length30Percent = Math.floor(plainText.length * 0.5);

    return plainText.substring(0, length30Percent) + '...';
  }

  return `${product?.productData?.title || 'Product'} - High quality dye intermediate product`;
};


const getPartialContent = (htmlContent = '', percent = 0.4) => {
  if (!htmlContent) return { __html: '' };

  // Use the length of the HTML string for calculation
  const maxLength = Math.floor(htmlContent.length * percent);

  if (htmlContent.length <= maxLength) {
    return { __html: htmlContent };
  }

  // Truncate the HTML string
  let truncatedHtml = htmlContent.substring(0, maxLength);

  // Avoid cutting in the middle of an HTML tag.
  // Find the last closing tag to avoid breaking the structure.
  const lastOpeningTagIndex = truncatedHtml.lastIndexOf('<');
  const lastClosingTagIndex = truncatedHtml.lastIndexOf('>');

  // If the last '<' is after the last '>', we're inside a tag.
  if (lastOpeningTagIndex > lastClosingTagIndex) {
    truncatedHtml = truncatedHtml.substring(0, lastOpeningTagIndex);
  }

  return { __html: `${truncatedHtml}...` };
};


  // Format image URLs before passing to ProductImages
  const formatImageUrls = (images = []) => {
    if (!Array.isArray(images)) return [];
    return images.map(img => ({
      url: `${img}`,
      alt: product?.productData?.title || 'Product Image',
    }));
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Product not found</div>
      </div>
    );
  }

  const metaDescription = getMetaDescription();
  const currentUrl = typeof window !== 'undefined' ? `https://www.apurvachemicals.com/${slug}` : '';

  return (
    <>
      <style jsx global>{`
        .product-content {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #1f2937;
          font-size: 1rem;
          line-height: 1.75;
        }
        .product-content p {
          margin-bottom: 1rem;
        }

        .product-content p:empty,
        .product-content p:has(br:only-child) {
          display: none;
        }
  
        .product-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        .product-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }
        .product-content h3 {
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }
        .product-content h1 a,
        .product-content h2 a,
        .product-content h3 a,
        .product-content h4 a,
        .product-content h5 a,
        .product-content h6 a {
          color: #bf2e2e !important;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        .product-content h1 a:hover,
        .product-content h2 a:hover,
        .product-content h3 a:hover,
        .product-content h4 a:hover,
        .product-content h5 a:hover,
        .product-content h6 a:hover {
          color: #991b1b !important;
        }
        .product-content ul {
          list-style-type: disc !important;
          margin-left: 4%;
          margin-bottom: 1rem;
        }

        .product-content ul a,
        .product-content ol a {
          color: #bf2e2e !important;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        .product-content ul a:hover,
        .product-content ol a:hover {
          color: #991b1b !important;
        }

        .product-content ol {
          list-style-type: decimal !important;
          margin-left: 4%;
          margin-bottom: 1rem;
        }
        .product-content li {
          margin-bottom: 0.5rem;
        }
        .product-content a {
          color: #bf2e2e;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        .product-content a:hover {
          color: #991b1b;
        }
        .product-content strong {
          font-weight: 600;
        }
        .product-content em {
          font-style: italic;
        }
        
        .product-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          min-width: 600px;
        }
        .product-content th, 
        .product-content td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
        }
        .product-content th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .product-content tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        @media (max-width: 768px) {
          .product-content table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>
      
      <div className="w-full bg-white" suppressHydrationWarning>
        <div className="max-w-8xl lg:pl-16 bg-white mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#bf2e2e]">
              Home
            </Link>
            <ChevronRight className="mx-2 w-5 h-5" />
            <Link href="/dye-intermediate" className="hover:text-[#bf2e2e]">
              Dye Intermediate
            </Link>
            <ChevronRight className="mx-2 w-5 h-5 text-red-700" />
            <span className="text-red-700 font-medium">{product?.productData?.title}</span>
          </nav>

          {/* Product Grid */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-20">
            {/* Product Images */}
            <div className="md:w-1/3 w-full">
              <ProductImages images={formatImageUrls(product?.productData?.photo)} initialProduct={product} />
                  {/* MSDS Section */}
              <div className="mb-8">
                <MSDSSection
                  msds={product?.productData?.msds}
                  name={product?.productData?.title}
                  spec={product?.productData?.spec}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-[60%] w-full">
              <h1 className="text-2xl border-b-2 w-fit border-red-700 font-bold text-[#bf2e2e] mb-6">
                {product?.productData?.title}
              </h1>
              <div dangerouslySetInnerHTML={{ __html: product?.productData?.shortDescription }} className='text-black mb-10'></div>
              {/* Product Details Table */}
              <div className="mb-8">
                <ProductDetailsTable details={product?.productDetailData || {}} />
              </div>

          
            </div>
          </div>

          {/* Product Description */}
          {product?.productData?.details && (
            <div ref={descriptionRef} className="mt-8 lg:-ml-3 mx-auto sm:w-[90%] md:w-full">
              <div className="bg-gray-100 p-5 rounded-lg">
                <span className="text-xl font-bold text-red-700">Description:</span>
                <div className="mt-3">
                  <div
                    className="product-content"
                    style={{
                      overflowX: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      msOverflowStyle: '-ms-autohiding-scrollbar',
                    }}
                  dangerouslySetInnerHTML={
  showFullContent
    ? { __html: product.productData.details }
    : getPartialContent(product.productData.details, 0.6) // ✅ 40%
}
  />
                  {product.productData.details.length > 300 && (
                    <button
                      className="text-red-700 mt-2 hover:underline text-sm font-medium"
                      onClick={() => setShowFullContent(!showFullContent)}
                    >
                      {showFullContent ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 sm:mx-7 w-full md:mx-0">
              <RelatedProducts
                products={relatedProducts}
                iconMap={iconMap}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}