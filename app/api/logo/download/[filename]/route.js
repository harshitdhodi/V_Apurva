import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Ensure params is resolved before destructuring
    const resolvedParams = await Promise.resolve(params);
    const { filename } = resolvedParams;
    
    if (!filename) {
      return new NextResponse('Filename is required', { status: 400 });
    }
    
    const logoUrl = `https://www.apurvachemicals.com/api/logo/download/${filename}`;
    
    // Fetch the logo from the external URL
    const response = await fetch(logoUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch logo');
    }
    
    // Get the logo data and content type
    const logoBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type');
    
    // Return the logo with appropriate headers
    return new NextResponse(Buffer.from(logoBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType || 'image/*',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    
  } catch (error) {
    console.error('Error fetching logo:', error);
    return new NextResponse('Logo not found', { status: 404 });
  }
}
