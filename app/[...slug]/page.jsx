'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR to avoid hydration issues
const BlogPage = dynamic(() => import('../blogs/BlogPage'), { ssr: false });
const ProductDetail = dynamic(() => import('@/components/product/ProductDetails'), { ssr: false });
const ProductCategoryGrid = dynamic(() => import('@/components/ProductCategoryGrid'), { ssr: false });
const SingleBlog = dynamic(() => import('@/components/SingleBlog'), { ssr: false });
const Simple404Page = dynamic(() => import('../404/page'), { ssr: false });

// Simulate axios for API calls
const fetchSlugs = async () => {
  try {
    const response = await fetch(`/api/dynamicSlug/getAllSlugs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch slugs');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error('Error fetching slugs:', err);
    throw err;
  }
};

export default function SlugPage() {
  const [pageType, setPageType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const slug = params?.slug?.[params.slug.length - 1];

  useEffect(() => {
    let isMounted = true;
    
    const getPageType = async () => {
      try {
        const response = await fetchSlugs();
        if (!isMounted) return;
        
        const { productSlugs, productCategorySlugs, newsSlugs, newsCategorySlugs } = response.data;
        console.log("productSlugs",productSlugs);
        
        const slugString = Array.isArray(slug) ? slug.join('/') : slug;
console.log("slugString",slugString);
        // Filter out null values from newsCategorySlugs
        const validNewsCategorySlugs = newsCategorySlugs.filter(slug => slug !== null);

        if (productSlugs.includes(slugString)) {
          setPageType('product');
        } else if (productCategorySlugs.includes(slugString)) {
          setPageType('product-category');
        } else if (newsSlugs.includes(slugString)) {
          setPageType('single-blog');
        } else if (validNewsCategorySlugs.includes(slugString)) {
          setPageType('blog');
        } else {
          setPageType('404');
        }
      } catch (err) {
        console.error('Error determining page type:', err);
        if (isMounted) {
          setError('Failed to load page');
          setPageType('error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getPageType();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">{error}</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  switch (pageType) {
    case 'product':
      return <ProductDetail />;
    case 'product-category':
      return <ProductCategoryGrid />;
    case 'single-blog':
      return <SingleBlog />;
    case 'blog':
      return <BlogPage />;
    case '404':
      return <Simple404Page />;
    default:
      return <Simple404Page />;
  }
}