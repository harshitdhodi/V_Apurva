import { NextResponse } from 'next/server';
import Logo from '@/lib/models/Logo';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Fetching header color logo...');
    const headerColorLogo = await Logo.findOne({ type: 'headerColor' }).lean();
    
    if (!headerColorLogo) {
      console.log('Header color logo not found');
      return NextResponse.json(
        { message: 'Header color logo not found' },
        { status: 404 }
      );
    }

    console.log('Successfully fetched header color logo');
    return NextResponse.json(headerColorLogo);
  } catch (error) {
    console.error('Error in /api/logo/header-color:', error);
    
    let errorMessage = 'An error occurred';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific MongoDB errors
      if (error.name === 'MongoNetworkError') {
        statusCode = 503; // Service Unavailable
        errorMessage = 'Unable to connect to the database';
      } else if (error.name === 'ValidationError') {
        statusCode = 400; // Bad Request
      }
    }
    
    return NextResponse.json(
      { 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: statusCode }
    );
  }
}