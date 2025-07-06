// src/app/blogs/page.jsx (Server Component)
import { Suspense } from 'react';
import BlogPageComponent from './BlogPage';

export const revalidate = 3600; // Revalidate every hour

async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
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
      <BlogPageComponent initialData={data} />
    </Suspense>
  );
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Blog - Latest News and Updates',
    description: 'Read our latest blog posts and stay updated with news and insights.',
    openGraph: {
      title: 'Blog - Latest News and Updates',
      description: 'Read our latest blog posts and stay updated with news and insights.',
      type: 'website',
    },
  };
}