import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vision from '@/lib/models/Vision';

export async function GET() {
  try {
    await connectDB();
    console.log('Fetching active vision...');
    
    const vision = await Vision.getActiveVision();
    
    if (!vision) {
      console.log('No active vision found');
      return NextResponse.json(
        { error: 'No active vision found' },
        { status: 404 }
      );
    }

    console.log('Vision found:', vision.title);
    return NextResponse.json({ data: vision });
  } catch (error) {
    console.error('Error in GET /api/vision/getAllActiveVisions:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
