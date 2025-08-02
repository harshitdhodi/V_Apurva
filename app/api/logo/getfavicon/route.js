import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Logo from '@/lib/models/Logo';


// Helper function to get the favicon file
async function findFavicon() {
  await connectDB();
  const favicon = await Logo.findOne({ type: 'favicon' });
  if (favicon) {
    return { 
      success: true, 
      photo: favicon.photo,
      message: 'Favicon found in database'
    };
  } else {
    return { 
      success: false, 
      message: 'No favicon found',
      defaultFavicon: '/favicon.ico' // Fallback to default favicon
    };
  }
}

export async function GET() {
  try {
    const result = await findFavicon();
    
    if (!result.success) {
      // If no favicon found, return the default favicon path
      return NextResponse.json(
        { 
          success: false, 
          message: result.message,
          defaultFavicon: result.defaultFavicon
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      photo: result.photo,
      message: result.message
    });

  } catch (error) {
    console.error('Error in favicon endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
