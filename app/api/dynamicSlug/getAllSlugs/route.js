import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Product from '@/lib/models/Product';
import ProductCategory from '@/lib/models/ProductCategory';
import News from '@/lib/models/News';
import NewsCategory from '@/lib/models/NewsCategory';

// Connect to the database
await connectDB();

/**
 * GET /api/dynamicSlug
 * Fetches all slugs from products, product categories, news, and news categories
 */
export async function GET() {
  try {
    // Execute all queries in parallel for better performance
    const [
      productSlugs,
      productCategorySlugs,
      newsSlugs,
      newsCategorySlugs
    ] = await Promise.all([
      Product.find({ }, 'slug').lean(),
      ProductCategory.find({ }, 'slug').lean(),
      News.find({ }, 'slug').lean(),
      NewsCategory.find({ }, 'slug').lean()
    ]);

    // Structure the response
    return NextResponse.json({
      success: true,
      data: {
        productSlugs: productSlugs.map(item => item.slug),
        productCategorySlugs: productCategorySlugs.map(item => item.slug),
        newsSlugs: newsSlugs.map(item => item.slug),
        newsCategorySlugs: newsCategorySlugs.map(item => item.slug)
      }
    });

  } catch (error) {
    console.error('Error in GET /api/dynamicSlug:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch dynamic routes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Add other HTTP methods if needed
export async function POST() {
  return NextResponse.json(
    { 
      success: false,
      message: 'Method not allowed' 
    },
    { status: 405 }
  );
}

// Add other HTTP methods if needed
export async function PUT() {
  return NextResponse.json(
    { 
      success: false,
      message: 'Method not allowed' 
    },
    { status: 405 }
  );
}

// Add other HTTP methods if needed
export async function DELETE() {
  return NextResponse.json(
    { 
      success: false,
      message: 'Method not allowed' 
    },
    { status: 405 }
  );
}