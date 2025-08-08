// src/app/blogs/page.jsx (Server Component)
import { Suspense } from 'react';
import BlogClient from './BlogPage';

export const revalidate = 3600; // Revalidate every hour

async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3023';
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not set');
    return { blogs: [], categories: [], banners: [] };
  }

  try {
    const [blogsRes, categoriesRes, bannersRes] = await Promise.all([
      fetch(`${apiUrl}/api/news/getActiveNews`, { 
        next: { revalidate: 3600 },
        cache: 'force-cache'
      }),
      fetch(`${apiUrl}/api/news/getSpecificCategoryDetails`, { 
        next: { revalidate: 3600 },
        cache: 'force-cache'
      }),
      fetch(`${apiUrl}/api/banner/getBannersBySectionBlog`, { 
        next: { revalidate: 3600 },
        cache: 'force-cache'
      })
    ]);

    const [blogs, categories, banners] = await Promise.all([
      blogsRes.ok ? blogsRes.json() : { data: [] },
      categoriesRes.ok ? categoriesRes.json() : { data: [] },
      bannersRes.ok ? bannersRes.json() : { data: [] }
    ]);

    return {
      blogs: blogs.data || [],
      categories: categories.data || [],
      banners: banners.data || []
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      blogs: [],
      categories: [],
      banners: []
    };
  }
}

// Generate comprehensive metadata for SEO
export async function generateMetadata() {
  try {
    // Fetch some blog data for dynamic meta description
    const data = await getData();
    const { blogs = [], categories = [] } = data;
    
    // Create dynamic description based on available content
    const categoryNames = categories.slice(0, 3).map(cat => cat.category).join(', ');
    const recentPosts = blogs.slice(0, 2).map(post => post.title).join(', ');
    
    const dynamicDescription = `Read our latest articles and insights${categoryNames ? ` on ${categoryNames}` : ''}${recentPosts ? `. Featured posts: ${recentPosts}` : ''}. Stay updated with industry news and expert analysis.`;
    
    const baseUrl = 'https://apurvachemicals.com';
    const blogUrl = `${baseUrl}/blogs`;
    
    // Get featured image from latest blog post or use default
    const featuredImage = blogs[0]?.photo?.[0] 
      ? `https://admin.apurvachemicals.com/api/image/download/${blogs[0].photo[0]}`
      : `${baseUrl}/images/default-blog-banner.jpg`;

    return {
      title: 'Blog - Latest News, Insights & Industry Updates | Apurva Chemicals',
      description: dynamicDescription.length > 160 ? dynamicDescription.substring(0, 157) + '...' : dynamicDescription,
      keywords: `blog, news, chemical industry, insights, updates, articles, ${categoryNames}, Apurva Chemicals`,
      alternates: {
        canonical: blogUrl,
      },
      openGraph: {
        title: 'Blog - Latest News & Industry Insights | Apurva Chemicals',
        description: dynamicDescription.length > 160 ? dynamicDescription.substring(0, 157) + '...' : dynamicDescription,
        url: blogUrl,
        siteName: 'Apurva Chemicals',
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: 'Apurva Chemicals Blog - Latest Industry News and Insights',
          }
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog - Latest News & Industry Insights | Apurva Chemicals',
        description: dynamicDescription.length > 160 ? dynamicDescription.substring(0, 157) + '...' : dynamicDescription,
        images: [featuredImage],
        creator: '@ApurvaChemicals',
        site: '@ApurvaChemicals',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      verification: {
        google: 'your-google-verification-code', // Add your actual verification code
        yandex: 'your-yandex-verification-code', // Add if needed
        yahoo: 'your-yahoo-verification-code', // Add if needed
      },
      category: 'Blog',
      classification: 'Business',
      // Add structured data for better SEO
      other: {
        'article:publisher': 'https://www.facebook.com/ApurvaChemicals', // Add your Facebook page
        'article:author': 'Apurva Chemicals',
        'og:locale:alternate': ['en_GB', 'en_IN'], // Add alternate locales if needed
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Fallback metadata
    return {
      title: 'Blog - Latest News and Updates | Apurva Chemicals',
      description: 'Read our latest blog posts and stay updated with industry news, insights, and expert analysis from Apurva Chemicals.',
      keywords: 'blog, news, chemical industry, insights, updates, articles, Apurva Chemicals',
      alternates: {
        canonical: 'https://apurvachemicals.com/blogs',
      },
      openGraph: {
        title: 'Blog - Latest News and Updates | Apurva Chemicals',
        description: 'Read our latest blog posts and stay updated with industry news and insights.',
        url: 'https://apurvachemicals.com/blogs',
        siteName: 'Apurva Chemicals',
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog - Latest News and Updates | Apurva Chemicals',
        description: 'Read our latest blog posts and stay updated with industry news and insights.',
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export default async function BlogPage() {
  const data = await getData();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf2e2e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blogs...</p>
        </div>
      </div>
    }>
      <BlogClient initialData={data} />
    </Suspense>
  );
}