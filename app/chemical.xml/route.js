import { getServerSideSitemap } from 'next-sitemap';

export async function GET() {
  const baseUrl = 'https://www.apurvachemicals.com';
  
  try {
    // Make sure to use the correct API endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/api/product/getProductsByCategory?categorySlug=dye-intermediate`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch products:', response.statusText);
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log

    const { category, products = [] } = data;

    const fields = [];

    // Add category page if it exists
    if (category?.slug) {
      fields.push({
        loc: `${baseUrl}/${encodeURIComponent(category.slug)}`,
        lastmod: category.updatedAt ? new Date(category.updatedAt).toISOString() : new Date().toISOString(),
        changefreq: 'weekly',
        priority: '1.0',
      });
    }

    // Add product pages
    products.forEach(product => {
      if (product?.slug) {
        fields.push({
          loc: `${baseUrl}/${encodeURIComponent(product.slug)}`,
          lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
          changefreq: 'weekly',
          priority: '0.9',
        });
      }
    });

    console.log('Generated sitemap fields:', fields); // Debug log

    if (fields.length === 0) {
      console.warn('No valid sitemap entries found');
      // Return empty sitemap instead of 404
      return getServerSideSitemap([]);
    }

    return getServerSideSitemap(fields);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return empty sitemap on error
    return getServerSideSitemap([]);
  }
}

// Disable caching
export const dynamic = 'force-dynamic';