import { NextResponse } from 'next/server';
import NewsCategory from '@/lib/models/NewsCategory';
import { connectDB } from '@/lib/db';

export const GET = async (request) => {
  try {
    await connectDB();

    // Find all news categories
    const categories = await NewsCategory.find({}).select('-__v');

    // Check if any categories exist
    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No categories found' },
        { status: 404 }
      );
    }

    // Return the categories
    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length
    });

  } catch (error) {
    console.error('Error fetching news categories:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error while fetching categories',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
};
