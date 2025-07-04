import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import News from '@/lib/models/News';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const slugs = searchParams.get('slugs');

    if (!slugs) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Find news data by slug
    const productData = await News.findOne({ slug: slugs });

    if (!productData) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ productData });
  } catch (error) {
    console.error('Error fetching data by slug:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
