import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Logo from '@/lib/models/Logo';

export async function GET() {
  try {
    await connectDB();
    
    const footerWhiteLogos = await Logo.findOne({ type: 'footerWhite' });
    
    if (!footerWhiteLogos) {
      return NextResponse.json(
        { message: 'Footer white logo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(footerWhiteLogos);
  } catch (error) {
    console.error('Error fetching footer white logos:', error);
    return NextResponse.json(
      { 
        message: 'Error fetching footer white logos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
