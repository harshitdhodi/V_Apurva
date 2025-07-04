import { NextResponse } from 'next/server';
import NewsCategory from '@/lib/models/NewsCategory';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const categories = await NewsCategory.find().select('category photo alt imgTitle slug');
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch news categories:', error);
    return NextResponse.json(
      { 
        message: 'Server error',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}