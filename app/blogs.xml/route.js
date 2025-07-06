import { getServerSideSitemap } from 'next-sitemap';
import axios from 'axios';

const BASE_URL = "https://www.apurvachemicals.com/";
const BLOG_API_URL = `${BASE_URL}api/news/getActiveNews`;

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
  
  const fields = blogs
    .filter(blog => blog.slug && blog.updatedAt)
    .map(blog => ({
      loc: `${baseUrl}/${blog.slug}`,
      lastmod: new Date(blog.updatedAt).toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    }));

  return getServerSideSitemap(fields);
}

export const dynamic = 'force-dynamic';
