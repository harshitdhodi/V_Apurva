import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Banner from '@/lib/models/Banner';

export async function GET() {
  try {
    await connectDB();
    
    const banners = await Banner.find({ 
      section: 'Home',
      status: 'active' 
    }).sort({ priority: 1 });

    return NextResponse.json({
      data: banners,
      message: "Banners for home section fetched successfully"
    });
  } catch (err) {
    console.error("Error fetching home section banners:", err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Failed to fetch home section banners: ${errorMessage}` },
      { status: 400 }
    );
  }
}

// Remove this line: export default GET;