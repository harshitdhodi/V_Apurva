import { notFound } from 'next/navigation';
import BlogPage from '../blogs/BlogPage';
import ProductDetail from '@/components/product/ProductDetails';
import ProductCategoryGrid from '@/components/ProductCategoryGrid';
import SingleBlog from '@/components/SingleBlog';
import Simple404Page from '../404/page';
import axios from 'axios';

// Server-side data fetching
async function fetchSlugs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3059';
    const response = await fetch(`${baseUrl}/api/dynamicSlug/getAllSlugs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Failed to fetch slugs');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching slugs:', err);
    throw err;
  }
}

async function determinePageType(slug) {
  try {
    const { data } = await fetchSlugs();
    const { productSlugs, productCategorySlugs, newsSlugs, newsCategorySlugs } = data;

    const slugString = Array.isArray(slug) ? slug.join('/') : slug;
    const validNewsCategorySlugs = newsCategorySlugs.filter(Boolean);

    if (productSlugs.includes(slugString)) return 'product';
    if (productCategorySlugs.includes(slugString)) return 'product-category';
    if (newsSlugs.includes(slugString)) return 'single-blog';
    if (validNewsCategorySlugs.includes(slugString)) return 'blog';

    return '404';
  } catch (err) {
    console.error('Error determining page type:', err);
    return 'error';
  }
}

// Function to fetch product data by slug
async function fetchProductData(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3059';
    const response = await fetch(`${baseUrl}/api/product/getDataBySlug?slugs=${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (result.success) {
      return result.productData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

// Function to fetch blog data by slug
async function fetchBlogData(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3059';
    const response = await fetch(`${baseUrl}/api/news/getDataBySlug?slugs=${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Check if we got valid data in the expected format
    if (!result || !result.productData) {
      console.error('Unexpected API response format:', result);
      return null;
    }
    
    return result.productData; // Return the productData object directly
  } catch (err) {
    console.error('Error fetching blog data:', err);
    return null;
  }
}

// Generate metadata dynamically
export async function generateMetadata({ params }) {
  const slug = params?.slug?.join('/') || '';
  const pageType = await determinePageType(slug);
  
  // Handle product metadata
  if (pageType === 'product') {
    const productData = await fetchProductData(slug);
    if (productData) {
      return {
        title: productData.metatitle || productData.title || 'Product Details',
        description: productData.metadescription || '',
        keywords: productData.metakeywords || '',
        alternates: {
          canonical: productData.url || `https://apurvachemicals.com/${slug}`,
        },
        openGraph: {
          title: productData.metatitle || productData.title || 'Product Details',
          description: productData.metadescription || '',
          url: productData.url || `https://apurvachemicals.com/${slug}`,
          siteName: 'Apurva Chemicals',
          images: productData.photo?.length > 0 ? 
            [{ url: `https://apurvachemicals.com/uploads/${productData.photo[0]}` }] : [],
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: productData.metatitle || productData.title || 'Product Details',
          description: productData.metadescription || '',
          images: productData.photo?.length > 0 ? 
            [`https://apurvachemicals.com/uploads/${productData.photo[0]}`] : [],
        },
      };
    }
  }
  
  // Handle blog post metadata
  if (pageType === 'single-blog') {
    const blogData = await fetchBlogData(slug);
    if (blogData) {
      const imageUrl = blogData.photo?.[0] 
        ? `https://apurvachemicals.com/uploads/${blogData.photo[0]}`
        : '';
      
      return {
        title: blogData.metatitle || blogData.title || 'Blog Post',
        description: blogData.metadescription || blogData.title || 'Blog post on Apurva Chemicals',
        keywords: blogData.metakeywords || '',
        alternates: {
          canonical: blogData.url || `https://apurvachemicals.com/${slug}`,
        },
        openGraph: {
          title: blogData.metatitle || blogData.title || 'Blog Post',
          description: blogData.metadescription || blogData.title || 'Blog post on Apurva Chemicals',
          url: blogData.url || `https://apurvachemicals.com/${slug}`,
          siteName: 'Apurva Chemicals',
          images: imageUrl ? [{ url: imageUrl }] : [],
          locale: 'en_US',
          type: 'article',
          publishedTime: blogData.createdAt || '',
          modifiedTime: blogData.updatedAt || '',
          authors: [blogData.postedBy || 'Apurva Chemicals'],
        },
        twitter: {
          card: 'summary_large_image',
          title: blogData.metatitle || blogData.title || 'Blog Post',
          description: blogData.metadescription || blogData.title || 'Blog post on Apurva Chemicals',
          images: imageUrl ? [imageUrl] : [],
        },
      };
    }
  }
  
  // Default metadata
  return {
    title: 'Apurva Chemicals',
    description: 'Leading manufacturer and exporter of specialty chemicals',
  };
}

// ✅ Corrected async component usage
export default async function Page(props) {
  const params = await props.params;
  const slug = params?.slug?.join('/') || '';
  const pageType = await determinePageType(slug);

  if (pageType === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Failed to load page</h2>
          <p className="mt-2 text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (pageType === '404') {
    notFound();
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
    default:
      return <Simple404Page />;
  }
}
