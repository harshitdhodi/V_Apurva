// src/app/api/product/getCategoryAndPhoto/route.ts
import { NextResponse } from 'next/server';
import ProductCategory from '@/lib/models/ProductCategory'; // Consistent import
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const categories = await ProductCategory.find()
      .select('category slug photo alt imgTitle') // Select relevant fields
      .lean();

    return NextResponse.json({
      data: categories,
      total: categories.length,
      message: 'Categories retrieved successfully',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        message: 'Server error',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}