import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const filename = params?.filename;
    
    if (!filename) {
      return new NextResponse('Filename is required', { status: 400 });
    }
    
    const imageUrl = `https://www.apurvachemicals.com/api/image/download/${filename}`;
    
    let response;
    try {
      response = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Next.js Image Proxy)',
          'Accept': 'image/*',
        },
        signal: AbortSignal.timeout(5000), 
      });
      
      if (!response.ok) {
        console.error(`External API returned ${response.status}: ${response.statusText}`);
        const placeholderSvg = `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" fill="#9ca3af">
            Image not available
          </text>
        </svg>`;
        
        return new NextResponse(placeholderSvg, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=60',
          },
        });
      }
      
      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/*';
      
      return new NextResponse(Buffer.from(imageBuffer), {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
      
    } catch (error) {
      console.error('Error fetching image:', error);
      const placeholderSvg = `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" fill="#9ca3af">
          Error loading image
        </text>
      </svg>`;
      
      return new NextResponse(placeholderSvg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new NextResponse('Internal Server Error', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}