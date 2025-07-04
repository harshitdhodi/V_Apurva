// src/app/blogs/page.jsx
import { Suspense } from 'react';
import BlogPage from './BlogPage';

export const revalidate = 3600; // Revalidate every hour

async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not set');
    return { blogs: [], categories: [], banners: [] };
  }

  try {
    const [blogsRes, categoriesRes, bannersRes] = await Promise.all([
      fetch(`${apiUrl}/api/news/getActiveNews`),
      fetch(`${apiUrl}/api/news/getSpecificCategoryDetails`),
      fetch(`${apiUrl}/api/banner/getBannersBySectionBlog`)
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

export default async function Blog() {
  const data = await getData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPage initialData={data} />
    </Suspense>
  );
}