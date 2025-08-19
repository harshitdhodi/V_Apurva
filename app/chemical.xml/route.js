import { getServerSideSitemap } from 'next-sitemap';
import axios from 'axios';

const BASE_URL = "http://localhost:3023/";
const baseUrl = 'https://www.apurvachemicals.com';
const categorySlug = 'dye-intermediate';
const CHEMICAL_API_URL = `${BASE_URL}api/product/getProductsByCategory?categorySlug=${categorySlug}`;

async function fetchCategoryAndChemicals() {
  try {
    const response = await axios.get(CHEMICAL_API_URL);
    // response.data.category and response.data.products
    return {
      category: response.data.category,
      products: Array.isArray(response.data.products) ? response.data.products : [],
    };
  } catch (error) {
    console.error('Error fetching chemicals:', error);
    return { category: null, products: [] };
  }
}

export async function GET() {
  const { category, products } = await fetchCategoryAndChemicals();

  // Use the slug from the category object, fallback to default if missing
  const dynamicCategorySlug = category?.slug;

  // Add the category page as the first entry with priority 1
  const fields = [
    {
      loc: `${baseUrl}/${dynamicCategorySlug}`,
      lastmod: new Date(category.updatedAt).toISOString(),
      changefreq: 'weekly',
      priority: 1,
    },
    ...products
      .filter(chemical => chemical.slug && chemical.updatedAt)
      .map(chemical => ({
        loc: `${baseUrl}/${chemical.slug}`,
        lastmod: new Date(chemical.updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.9,
      })),
  ];

  return getServerSideSitemap(fields);
}

export const dynamic = 'force-dynamic'; // Disable caching