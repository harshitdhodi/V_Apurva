import { getServerSideSitemap } from 'next-sitemap';
import axios from 'axios';


const BASE_URL = "http://localhost:3023/";

const CHEMICAL_API_URL = `${BASE_URL}api/product/getProductsByCategory?categorySlug=dye-intermediate`;

async function fetchChemicals() {
  try {
    const response = await axios.get(CHEMICAL_API_URL);
    console.log("Chemicals", response.data);
    return Array.isArray(response.data.products) ? response.data.products : [];
  } catch (error) {
    console.error('Error fetching chemicals:', error);
    return [];
  }
}

export async function GET() {
  const baseUrl = 'https://www.apurvachemicals.com';
  const chemicals = await fetchChemicals();
  console.log("Chemicals", chemicals);
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
