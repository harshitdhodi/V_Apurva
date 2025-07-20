import { notFound } from 'next/navigation';
import BlogPage from '../blogs/BlogPage';
import ProductDetail from '@/components/product/ProductDetails';
import ProductCategoryGrid from '@/components/ProductCategoryGrid';
import SingleBlog from '@/components/SingleBlog';
import Simple404Page from '../404/page';

// Server-side data fetching
async function fetchSlugs() {
  try {

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3023';
    const response = await fetch(`${baseUrl}/api/dynamicSlug/getAllSlugs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Failed to fetch slugs');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching slugs:', err);
    throw err;
  }
}

async function determinePageType(slug) {
  try {
    const { data } = await fetchSlugs();
    const { productSlugs, productCategorySlugs, newsSlugs, newsCategorySlugs } = data;

    const slugString = Array.isArray(slug) ? slug.join('/') : slug;
    const validNewsCategorySlugs = newsCategorySlugs.filter(Boolean);

    if (productSlugs.includes(slugString)) return 'product';
    if (productCategorySlugs.includes(slugString)) return 'product-category';
    if (newsSlugs.includes(slugString)) return 'single-blog';
    if (validNewsCategorySlugs.includes(slugString)) return 'blog';

    return '404';
  } catch (err) {
    console.error('Error determining page type:', err);
    return 'error';
  }
}

// ✅ Corrected async component usage
export default async function Page(props) {
  const params = await props.params;
  const slug = params?.slug?.join('/') || '';
  const pageType = await determinePageType(slug);

  if (pageType === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Failed to load page</h2>
          <p className="mt-2 text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (pageType === '404') {
    notFound();
  }

  switch (pageType) {
    case 'product':
      return <ProductDetail />;
    case 'product-category':
      return <ProductCategoryGrid />;
    case 'single-blog':
      return <SingleBlog />;
    case 'blog':
      return <BlogPage />;
    default:
      return <Simple404Page />;
  }
}
