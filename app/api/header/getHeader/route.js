import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Header from '@/lib/models/Header';

export async function GET() {
  try {
    await connectDB();
    
    const header = await Header.findOne();
    
    if (!header) {
      return NextResponse.json(
        { message: 'Header not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(header);
  } catch (error) {
    console.error('Error fetching header:', error);
    return NextResponse.json(
      { 
        message: 'Error fetching header data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
