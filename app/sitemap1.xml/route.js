import { getServerSideSitemap } from 'next-sitemap';

export async function GET() {
  const baseUrl = 'https://www.apurvachemicals.com';
  const currentDate = new Date().toISOString();

  const fields = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/products`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/privacy-policy`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/terms-and-conditions`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7,
    },
  ];

  return getServerSideSitemap(fields);
}

export const dynamic = 'force-dynamic';
