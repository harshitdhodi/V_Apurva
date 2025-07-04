import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import News from '@/lib/models/News';
import newsCategory from '@/lib/models/NewsCategory';
import Product from '@/lib/models/Product';

export async function GET() {
  try {
    await connectDB();

    const news = await News.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(4)
      .select('-details -metatitle -metadescription -metakeywords -metacanonical -metalanguage -metaschema -otherMeta -msds -spec -url -priority -lastmod -changeFreq -createdAt -updatedAt')
      .lean();

    if (!news || news.length === 0) {
      return NextResponse.json(
        { data: [], total: 0, message: 'No active news found' },
        { status: 200 }
      );
    }

    // Map over news items to include category names and product names
    const newsWithCategoryNameAndProductName = await Promise.all(news.map(async (newsItem) => {
      // Fetch category name
      const category = await newsCategory.findOne({ slug: { $in: newsItem.categories } }).lean();
      const categoryName = category ? category.category : 'Uncategorized';

      // Fetch product name if there's an associated product
      let productName = null;
      if (newsItem.productId) {
        const product = await Product.findOne({ slug: newsItem.productId }).lean();
        productName = product ? product.title : 'Unnamed';
      }

      return {
        ...newsItem,
        categoryName,
        productName,
        _id: newsItem._id?.toString() || newsItem._id
      };
    }));

    return NextResponse.json({
      data: newsWithCategoryNameAndProductName,
      total: newsWithCategoryNameAndProductName.length,
      message: 'News retrieved successfully'
    });
  } catch (error) {
    console.error("Error retrieving latest active news:", error);
    let errorMessage = 'Server error';
    let status = 500;

    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
      status = 400;
    }

    return NextResponse.json(
      { message: errorMessage, error: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status }
    );
  }
}