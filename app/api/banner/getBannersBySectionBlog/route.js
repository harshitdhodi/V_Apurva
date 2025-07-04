import { NextResponse } from 'next/server';
import Banner from '@/lib/models/Banner';
import { connectDB } from '@/lib/db';

export const GET = async (request) => {
  try {
    await connectDB();

    // Find active banners for Blog section, sorted by priority
    const banners = await Banner.find({ 
      section: 'Blog', 
      status: 'active' 
    }).sort({ priority: 1 });

    return NextResponse.json({
      success: true,
      data: banners,
      total: banners.length,
      message: 'Banners for Blog section fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching Blog section banners:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch Blog section banners',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
};
