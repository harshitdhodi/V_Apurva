import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Aboutus from '@/lib/models/aboutus';

export async function GET() {
  try {
    await connectDB();
    const aboutus = await Aboutus.findOne();
    
    if (!aboutus) {
      return NextResponse.json({ error: 'No about us data found' }, { status: 404 });
    }
    
    return NextResponse.json(aboutus);
  } catch (error) {
    console.error('Failed to fetch about us data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch about us data' }, 
      { status: 500 }
    );
  }
}
