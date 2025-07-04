import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Footer from '@/lib/models/Footer';

export async function GET() {
  try {
    await connectDB();
    
    const footer = await Footer.findOne();  
    
    if (!footer) {
      return NextResponse.json(
        { message: 'Footer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(footer);
  } catch (error) {
    console.error('Error fetching footer:', error);
    return NextResponse.json(
      { 
        message: 'Error fetching footer data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
