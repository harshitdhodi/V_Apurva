import { getServerSideSitemap } from 'next-sitemap';
import axios from 'axios';

const BASE_URL = "http://localhost:3023/";
const BLOG_API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3023'}/api/news/getActiveNews`;

async function fetchBlogs() {
  try {
    const response = await axios.get(BLOG_API_URL);
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function GET() {
  const baseUrl = 'https://www.apurvachemicals.com';
  const blogs = await fetchBlogs();
  
  const fields = [
    // Add static /blogs page
    {
      loc: `${baseUrl}/blogs`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    },
    // Add dynamic blog posts
    ...blogs
      .filter(blog => blog.slug && blog.date)
      .map(blog => ({
        loc: `${baseUrl}/${blog.slug}`,
        lastmod: new Date(blog.date).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      })),
  ];

  // Generate the XML sitemap
  return getServerSideSitemap(fields);
}

// Prevents Next.js from adding default headers
export const dynamic = 'force-dynamic';