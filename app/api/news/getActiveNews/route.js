import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import News from '@/lib/models/News';
import NewsCategory from '@/lib/models/NewsCategory';
import Product from '@/lib/models/Product';

export const dynamic = 'force-dynamic'; // Ensure dynamic data fetching

export async function GET() {
  try {
    await connectDB();

    // Find all news records where the status is 'active' using lean() for better performance
    const activeNews = await News.find({ status: 'active' })
    .sort({ createdAt: -1 }).lean();

    // Map over active news items to include category names and product names
    const activeNewsWithDetails = await Promise.all(
      activeNews.map(async (newsItem) => {
        // Fetch category name using lean() for better performance
        const category = await NewsCategory.findById(newsItem.categories).lean();
        const categoryName = category ? category.category : 'Uncategorized';

        // Fetch product names if there are associated products
        let productNames = [];
        if (newsItem.products && newsItem.products.length > 0) {
          const products = await Product.find({
            _id: { $in: newsItem.products }
          }).lean();
          productNames = products.map(product => product.title);
        }

        return {
          ...newsItem,
          categoryName,
          productNames
        };
      })
    );

    // Send response with the active news data
    return NextResponse.json({
      success: true,
      data: activeNewsWithDetails,
      total: activeNewsWithDetails.length
    });
  } catch (error) {
    console.error('Error in getActiveNews:', error);
    
    let status = 500;
    let errorMessage = 'Failed to fetch news';
    
    if (error.name === 'CastError') {
      status = 400;
      errorMessage = 'Invalid query parameter format';
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}