import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slugs = searchParams.get('slugs');

  if (!slugs) {
    return new Response(JSON.stringify({ message: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await connectDB();
    
    // Fetch the current product
    const currentProduct = await Product.findOne({ slug: slugs });
    if (!currentProduct) {
      return new Response(JSON.stringify({ message: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find related products in the same category (excluding the current product)
    const relatedProducts = await Product.find({
      categories: { $in: currentProduct.categories },
      slug: { $ne: slugs }
    }).limit(10).lean();

    return new Response(JSON.stringify(relatedProducts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching related products:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Error fetching related products',
        error: error.message 
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
