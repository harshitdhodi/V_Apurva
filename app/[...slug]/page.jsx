import { notFound } from 'next/navigation';
import BlogPage from '../blogs/BlogPage';
import ProductDetail from '@/components/product/ProductDetails';
import ProductCategoryGrid from '@/components/ProductCategoryGrid';
import SingleBlog from '@/components/SingleBlog';
import Simple404Page from '../404/page';

// Server-side data fetching
async function fetchSlugs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3023';
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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3023';
    const response = await fetch(`${baseUrl}/api/product/getDataBySlug?slugs=${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Product response", result);
    
    return result;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

// Function to fetch related products
async function fetchRelatedProducts(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3023';
    const response = await fetch(`${baseUrl}/api/product/getRelatedProducts?slugs=${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Function to fetch blog data by slug - SERVER SIDE
async function fetchBlogData(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3023';
    const response = await fetch(`${baseUrl}/api/news/getDataBySlug?slugs=${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result) {
      console.error('Empty API response');
      return null;
    }
    
    const blogData = result?.data?.productData || 
                     result?.productData || 
                     result?.data?.blogData ||
                     result?.blogData ||
                     result?.data ||
                     null;
    
    if (!blogData) {
      console.error('No blog data found in response:', result);
      return null;
    }
    
    return blogData;
  } catch (err) {
    console.error('Error fetching blog data:', err);
    return null;
  }
}

// Function to fetch latest news - SERVER SIDE
async function fetchLatestNews() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3023';
    const response = await fetch(`${baseUrl}/api/news/getLatestActiveNews`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result?.data || [];
  } catch (err) {
    console.error('Error fetching latest news:', err);
    return [];
  }
}

// Generate metadata dynamically
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug?.join('/') || '';
  
  if (!slug) {
    return {
      title: 'Apurva Chemicals',
      description: 'Leading manufacturer and exporter of specialty chemicals',
    };
  }
  
  const pageType = await determinePageType(slug);
  
  try {
    // Handle product metadata
    if (pageType === 'product') {
      const productData = await fetchProductData(slug);
      const product = productData?.data?.productData || productData?.productData;
      if (product) {
        const imageUrl = product.photo?.length > 0 
          ? `https://apurvachemicals.com/uploads/${product.photo[0]}`
          : '';
        
        return {
          title: product.metatitle || product.title || 'Product Details - Apurva Chemicals',
          description: product.metadescription || product.description || 'Quality chemical products from Apurva Chemicals',
          keywords: product.metakeywords || '',
          alternates: {
            canonical: product.metacanonical || `https://apurvachemicals.com/${slug}` || product.url,
          },
          openGraph: {
            title: product.metatitle || product.title || 'Product Details',
            description: product.metadescription || product.description || 'Quality chemical products from Apurva Chemicals',
            url: product.metacanonical || `https://apurvachemicals.com/${slug}` || product.url,
            siteName: 'Apurva Chemicals',
            images: imageUrl ? [{ url: imageUrl, alt: product.title || 'Product Image' }] : [],
            locale: 'en_US',
            type: 'website',
          }, 
          twitter: {
            card: 'summary_large_image',
            title: product.metatitle || product.title || 'Product Details',
            description: product.metadescription || product.description || 'Quality chemical products from Apurva Chemicals',
            images: imageUrl ? [imageUrl] : [],
          },
          robots: {
            index: true,
            follow: true,
          }
        };
      }
    }
    
    // Handle product category metadata
    if (pageType === 'product-category') {
      return {
        title: `Product Category - Apurva Chemicals`,
        description: `Browse our quality chemical products and solutions`,
        alternates: {
          canonical: `https://apurvachemicals.com/${slug}`,
        },
        openGraph: {
          title: 'Product Category - Apurva Chemicals',
          description: 'Browse our quality chemical products and solutions',
          url: `https://apurvachemicals.com/${slug}`,
          siteName: 'Apurva Chemicals',
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Product Category - Apurva Chemicals',
          description: 'Browse our quality chemical products and solutions',
        },
        robots: {
          index: true,
          follow: true,
        }
      };
    }
    
    // Handle blog post metadata
    if (pageType === 'single-blog') {
      const blogData = await fetchBlogData(slug);
      if (blogData) {
        const imageUrl = blogData.photo?.[0] 
          ? `https://apurvachemicals.com/uploads/${blogData.photo[0]}`
          : '';
        
        return {
          title: blogData.metatitle || blogData.title || 'Blog Post - Apurva Chemicals',
          description: blogData.metadescription || blogData.description || blogData.title || 'Read our latest insights and updates',
          keywords: blogData.metakeywords || '',
          alternates: {
            canonical: blogData.url || `https://apurvachemicals.com/${slug}`,
          },
          openGraph: {
            title: blogData.metatitle || blogData.title || 'Blog Post',
            description: blogData.metadescription || blogData.description || blogData.title || 'Read our latest insights and updates',
            url: blogData.url || `https://apurvachemicals.com/${slug}`,
            siteName: 'Apurva Chemicals',
            images: imageUrl ? [{ url: imageUrl, alt: blogData.title || 'Blog Image' }] : [],
            locale: 'en_US',
            type: 'article',
            publishedTime: blogData.createdAt || '',
            modifiedTime: blogData.updatedAt || '',
            authors: [blogData.postedBy || 'Apurva Chemicals'],
            section: blogData.category || 'General',
          },
          twitter: {
            card: 'summary_large_image',
            title: blogData.metatitle || blogData.title || 'Blog Post',
            description: blogData.metadescription || blogData.description || blogData.title || 'Read our latest insights and updates',
            images: imageUrl ? [imageUrl] : [],
          },
          robots: {
            index: true,
            follow: true,
          }
        };
      }
    }
    
    // Handle blog category metadata
    if (pageType === 'blog') {
      return {
        title: `Blog Category - Apurva Chemicals`,
        description: `Read our latest articles, insights and industry updates`,
        alternates: {
          canonical: `https://apurvachemicals.com/${slug}`,
        },
        openGraph: {
          title: 'Blog Category - Apurva Chemicals',
          description: 'Read our latest articles, insights and industry updates',
          url: `https://apurvachemicals.com/${slug}`,
          siteName: 'Apurva Chemicals',
          locale: 'en_US',
          type: 'website',
        },
        robots: {
          index: true,
          follow: true,
        }
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  // Default metadata for unknown or error cases
  return {
    title: 'Apurva Chemicals',
    description: 'Leading manufacturer and exporter of specialty chemicals',
    robots: {
      index: true,
      follow: true,
    }
  };
}

// Main page component
export default async function Page(props) {
  const params = await props.params;
  const slug = params?.slug?.join('/') || '';
  
  if (!slug) {
    notFound();
  }
  
  const pageType = await determinePageType(slug);
  
  if (pageType === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Server Error</h1>
          <p className="text-gray-600">Failed to load page. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  if (pageType === '404') {
    notFound();
  }
  
  // Render the appropriate component based on page type
  switch (pageType) {
    case 'product':
      // Fetch product data server-side
      const [productData, relatedProducts] = await Promise.all([
        fetchProductData(slug),
        fetchRelatedProducts(slug)
      ]);
      
      if (!productData) {
        notFound();
      }
      
      return (
        <ProductDetail 
          initialProduct={productData} 
          initialRelatedProducts={relatedProducts}
          slug={slug}
        />
      );
      
    case 'product-category':
      return <ProductCategoryGrid />;
      
    case 'single-blog':
      // Fetch blog data and latest news server-side
      const [blogData, latestNews] = await Promise.all([
        fetchBlogData(slug),
        fetchLatestNews()
      ]);
      
      if (!blogData) {
        notFound();
      }
      
      return (
        <SingleBlog 
          initialBlogData={blogData}
          initialLatestNews={latestNews}
          slug={slug}
        />
      );
      
    case 'blog':
      return <BlogPage />;
      
    default:
      return <Simple404Page />;
  }
}