import { NextResponse } from 'next/server';
import Banner from '@/lib/models/Banner';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({
      section: 'About Us',
      status: 'active'
    }).sort({ priority: 1 });

    return NextResponse.json({
      success: true,
      data: banners,
      message: 'Banners for About Us section fetched successfully'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching About Us banners',
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
