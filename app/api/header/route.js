import { NextResponse } from 'next/server';
import Header from '@/lib/models/Header';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const header = await Header.findOne().lean();
    
    if (!header) {
      return NextResponse.json(
        { message: 'Header not found' },
        { status: 404 }
      );
    }

    // Convert _id to string
    const serializedHeader = {
      ...header,
      _id: header._id.toString(),
      // Convert any Date objects to ISO strings
      ...(header.createdAt && { createdAt: header.createdAt.toISOString() }),
      ...(header.updatedAt && { updatedAt: header.updatedAt.toISOString() })
    };

    return NextResponse.json(serializedHeader);
  } catch (error) {
    console.error('Error fetching header:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch header data';
    const errorDetails = error instanceof Error && process.env.NODE_ENV === 'development' 
      ? { stack: error.stack } 
      : undefined;
    
    return NextResponse.json(
      { 
        message: errorMessage,
        ...(errorDetails && { details: errorDetails })
      },
      { status: 500 }
    );
  }
}
