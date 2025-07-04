import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Ensure params is properly destructured after awaiting
    const { filename } = params;
    
    if (!filename) {
      return new NextResponse('Filename is required', { status: 400 });
    }
    
    const videoUrl = `https://www.apurvachemicals.com/api/image/video/${filename}`;
    
    // Fetch the video from the external URL
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      console.error(`Failed to fetch video: ${videoUrl} - Status: ${response.status}`);
      return new NextResponse('Video not found', { status: 404 });
    }
    
    // Get the video data and content type
    const videoBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'video/mp4';
    
    // Return the video with appropriate headers
    return new NextResponse(Buffer.from(videoBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': response.headers.get('content-length') || videoBuffer.length,
      },
    });
    
  } catch (error) {
    console.error('Error in video route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
