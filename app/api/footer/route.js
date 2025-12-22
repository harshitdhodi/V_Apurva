import { NextResponse } from 'next/server';
import Footer from '../../../lib/models/Footer';
import { connectDB } from '../../../lib/db';

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
