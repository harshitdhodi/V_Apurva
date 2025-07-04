'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import ProductImages from '@/components/product/ProductImages';
import { ProductDetailsTable } from '@/components/product/ProductDetailsTable';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import MSDSSection from '@/components/product/MSDSSection';
import { FileText, TestTube2, Dna, HeartPulse, DnaOff, FlaskConical, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import Navbar from '../Navbar';
import Footer from '../layout/Footer';

// TipTapViewer component for rendering rich text
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

const iconMap = [
  FileText,
  TestTube2,
  FlaskConical,
  HeartPulse,
  Dna,
  DnaOff,
  TestTube2,
];

const contentStyles = `
  .product-content p {
    margin-bottom: 1rem;
    lineHeight: 1.6;
  }
  .product-content ul, .product-content ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  .product-content li {
    margin-bottom: 0.5rem;
  }
`;

export default function ProductDetail({ slugs }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pathname = usePathname();
  const descriptionRef = useRef(null);
  const slug = slugs;

  useEffect(() => {
    setIsMounted(true);
    if (slug) {
      fetchProductData();
      fetchRelatedProducts();
    }
  }, [slug]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/product/getDataBySlug?slugs=${slug}`);
      if (response.data) {
        console.log("product data", response.data);
        setProduct(response.data);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`/api/product/getRelatedProducts?slugs=${slug}`);
      if (response.data) {
        console.log("related products", response.data);
        setRelatedProducts(response.data);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  // Helper function to strip HTML tags for meta description
  const stripHtmlTags = (html) => {
    if (typeof document === 'undefined') return '';
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  };

  // Generate meta description from product details
  const getMetaDescription = () => {
    if (product?.productData.details) {
      const plainText = stripHtmlTags(product.productData.details);
      return plainText.length > 155
        ? plainText.substring(0, 155) + '...'
        : plainText;
    }
    return `${product?.productData.title || 'Product'} - High quality dye intermediate product`;
  };

  const getPartialContent = (htmlContent = '') => {
    if (!htmlContent) return '';
    const contentLength = htmlContent.length;
    const partialLength = Math.floor(contentLength * 0.3);
    const partialContent = htmlContent.substring(0, partialLength);
    const lastTagEnd = partialContent.lastIndexOf('>');
    if (lastTagEnd === -1) return partialContent + '...';
    return partialContent.substring(0, lastTagEnd + 1) + '...';
  };

  // Format image URLs before passing to ProductImages
  const formatImageUrls = (images = []) => {
    if (!Array.isArray(images)) return [];
    return images.map(img => ({
      url: `${img}`,
      alt: product?.productData.title || 'Product Image',
    }));
  };

  if (!isMounted) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
      }}>
        Loading...
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Product not found</div>
      </div>
    );
  }

  const metaDescription = getMetaDescription();
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : '';

  return (
    <>
      <style jsx global>{contentStyles}</style>
      {isMounted && (
        <>
          <title>{product?.productData.metatitle ? `${product.productData.metatitle} | Your Company Name` : 'Product Detail | Your Company Name'}</title>
          <meta name="description" content={product?.productData.metadescription || metaDescription} />
          <meta name="keywords" content={`${product?.productData.title || ''}, dye intermediate, chemical products`} />
          <meta property="og:title" content={product?.productData.metatitle || 'Product Detail'} />
          <meta property="og:description" content={product?.productData.metadescription || metaDescription} />
          <meta property="og:type" content="product" />
          {currentUrl && <meta property="og:url" content={currentUrl} />}
          {product?.productData.photo?.[0] && (
            <meta property="og:image" content={`/api/image/download/${product.productData.photo[0]}`} />
          )}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={product?.productData.metatitle || 'Product Detail'} />
          <meta name="twitter:description" content={product?.productData.metadescription || metaDescription} />
          {product?.productData.photo?.[0] && (
            <meta name="twitter:image" content={`/api/image/download/${product.productData.photo[0]}`} />
          )}
          {currentUrl && <link rel="canonical" href={currentUrl} />}
        </>
      )}
      <div className="w-full bg-white">
        <div suppressHydrationWarning>
          {!isMounted ? (
            <div style={{
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#fff',
            }}>
              Loading...
            </div>
          ) : (
            <div className="w-full bg-white">
              <Navbar />
              <div className="max-w-8xl bg-white mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  <span className="text-red-700 font-medium">{product?.productData.title}</span>
                </nav>

                {/* Product Grid */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                  {/* Product Images */}
                  <div className="md:w-1/3 w-full">
                    <ProductImages images={formatImageUrls(product?.productData.photo)} />
                  </div>

                  {/* Product Details */}
                  <div className="md:w-1/2 w-full">
                    <h1 className="text-2xl border-b-2 w-fit border-red-700 font-bold text-[#bf2e2e] mb-6">
                      {product?.productData.title}
                    </h1>

                    {/* Product Details Table */}
                    <div className="mb-8">
                      <ProductDetailsTable details={product?.productDetailData || {}} />
                    </div>

                    {/* MSDS Section */}
                    <div className="mb-8">
                      <MSDSSection
                        msds={product?.productData.msds}
                        name={product?.productData.title}
                        spec={product?.productData.spec}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                {product?.productData.details && (
                  <div ref={descriptionRef} className="mt-8 mx-auto w-[90%] md:w-[87%]">
                    <div className="bg-gray-100 p-5 rounded-lg">
                      <span className="text-xl font-bold text-red-700">Description:</span>
                      <div className="mt-3">
                        <TipTapViewer
                          value={
                            showFullContent
                              ? product.productData.details
                              : getPartialContent(product.productData.details)
                          }
                          className="product-content"
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
                  <div className="mt-16 mx-7 md:mx-0">
                    <h2 className="text-2xl font-bold mb-8">Related Products</h2>
                    <RelatedProducts
                      products={relatedProducts}
                      iconMap={iconMap}
                    />
                  </div>
                )}
              </div>
              <Footer />
            </div>
          )}
        </div>
      </div>
    </>
  );
}