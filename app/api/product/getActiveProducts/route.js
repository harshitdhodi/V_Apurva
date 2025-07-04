import { NextResponse } from 'next/server';
import Product from '@/lib/models/Product';
import ProductCategory from '@/lib/models/ProductCategory';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Fetching active products...');
    const products = await Product.find({ status: 'active' }).lean();

    if (!products || products.length === 0) {
      console.log('No active products found');
      return NextResponse.json(
        { data: [], total: 0, message: 'No active products found' },
        { status: 200 }
      ); 
    }

    console.log(`Found ${products.length} active products, fetching categories...`);

    // Process products to include category names
    const productsWithCategories = await Promise.all(
      products.map(async (product) => {
        try {
          // Convert product to plain object if it's a Mongoose document
          const productObj = product.toObject ? product.toObject() : product;
          
          // Find the first category if categories is an array, otherwise use directly
          const categorySlug = Array.isArray(productObj.categories) ? productObj.categories[0] : productObj.categories;
          
          // Use slug instead of _id for category lookup
          const category = await ProductCategory.findOne({ slug: categorySlug }).lean();
          const categoryName = category?.category ?? 'Uncategorized';

          return {
            ...productObj,
            categoryName,
            _id: productObj._id?.toString() || productObj._id
          };
        } catch (error) {
          console.error(`Error processing product ${product._id}:`, error);
          const productObj = product.toObject ? product.toObject() : product;
          return {
            ...productObj,
            categoryName: 'Uncategorized',
            _id: productObj._id?.toString() || productObj._id
          };
        }
      })
    );

    console.log('Successfully processed all products');
    return NextResponse.json({
      data: productsWithCategories,
      total: productsWithCategories.length,
      message: 'Products retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving active products:', error);
    let errorMessage = 'Server error';
    let errorDetails = '';

    if (error instanceof Error) {
      errorDetails = error.message;
      if ('name' in error && error.name === 'CastError') {
        errorMessage = 'Invalid query parameter format';
      }
    }

    return NextResponse.json(
      { message: errorMessage, error: errorDetails },
      { status: 500 }
    );
  }
}