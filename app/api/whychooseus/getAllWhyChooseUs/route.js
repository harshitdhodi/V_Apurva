import { NextResponse } from 'next/server';
import WhyChooseUs from '@/lib/models/WhyChooseUs';
import { connectDB } from '@/lib/db';

// GET /api/why-choose-us
export async function GET() {
  try {
    await connectDB();
    
    const whyChooseUs = await WhyChooseUs.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: whyChooseUs,
      message: 'Why Choose Us items retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching Why Choose Us items:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch Why Choose Us items',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
