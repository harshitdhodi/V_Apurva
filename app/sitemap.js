// app/sitemap.js
import { MetadataRoute } from 'next'
import axios from 'axios'

const BASE_URL = "http://localhost:3023/";
const BLOG_API_URL = `${BASE_URL}api/news/getActiveNews`;
const CHEMICAL_API_URL = `${BASE_URL}api/product/getProductsByCategory?categorySlug=dye-intermediate`;

// Fetch blog data
async function fetchBlogs() {
  try {
    const response = await axios.get(BLOG_API_URL);
    const blogs = Array.isArray(response.data.data) ? response.data.data : [];
    return blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

// Fetch chemical data
async function fetchChemicals() {
  try {
    const response = await axios.get(CHEMICAL_API_URL);
    const chemicals = Array.isArray(response.data.products) ? response.data.products : [];
    return chemicals;
  } catch (error) {
    console.error('Error fetching chemicals:', error);
    return [];
  }
}

export default function sitemap() {
  const baseUrl = 'https://www.apurvachemicals.com';
  const currentDate = new Date().toISOString();
  
  return [
    {
      url: `${baseUrl}/sitemap1.xml`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
     {
      url: `${baseUrl}/chemical.xml`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs.xml`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    }
  ];
}