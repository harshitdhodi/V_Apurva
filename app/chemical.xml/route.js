import { getServerSideSitemap } from 'next-sitemap';
import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';
const BASE_URL = isProd
  ? "https://www.apurvachemicals.com"
  : "https://www.demo.apurvachemicals.com";

const CHEMICAL_API_URL = `${BASE_URL}/api/product/getProductsByCategory?categorySlug=dye-intermediate`;

async function fetchChemicals() {
  try {
    const response = await axios.get(CHEMICAL_API_URL);
    console.log('Fetched chemicals:', response.data);
    return Array.isArray(response.data.products) ? response.data.products : [];
  } catch (error) {
    console.error('Error fetching chemicals:', error);
    return [];
  }
}

export async function GET() {
  const baseUrl = isProd
    ? 'https://www.apurvachemicals.com'
    : 'https://www.apurvachemicals.com';
  const chemicals = await fetchChemicals();
  const fields = chemicals
    .filter(chemical => chemical.slug && chemical.updatedAt)
    .map(chemical => ({
      loc: `${baseUrl}/${chemical.slug}`,
      lastmod: new Date(chemical.updatedAt).toISOString(),
      changefreq: 'weekly',
      priority: 0.9,
    }));

  return getServerSideSitemap(fields);
}

export const dynamic = 'force-dynamic'; // Disable caching