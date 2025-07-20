import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Helper function to get the favicon file
async function findFavicon() {
  const possibleFilenames = [
    'favicon.ico',
    'favicon.png',
    'favicon.jpg',
    'favicon.jpeg',
    'favicon.svg',
    'favicon.webp'
  ];

  // Check in public directory first
  for (const filename of possibleFilenames) {
    try {
      const filePath = path.join(process.cwd(), 'public', filename);
      await fs.access(filePath);
      return { 
        success: true, 
        photo: filename,
        message: 'Favicon found in public directory'
      };
    } catch (error) {
      // File not found, try next one
    }
  }

  // Check in logos directory
  const logosDir = path.join(process.cwd(), 'app', 'api', 'logo', 'download', 'logos');
  try {
    const files = await fs.readdir(logosDir);
    for (const filename of possibleFilenames) {
      if (files.includes(filename)) {
        return { 
          success: true, 
          photo: filename,
          message: 'Favicon found in logos directory'
        };
      }
    }
  } catch (error) {
    console.error('Error reading logos directory:', error);
  }

  return { 
    success: false, 
    message: 'No favicon found',
    defaultFavicon: '/favicon.ico' // Fallback to default favicon
  };
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
