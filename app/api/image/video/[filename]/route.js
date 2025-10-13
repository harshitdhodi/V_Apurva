import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get content type based on file extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    // Videos
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.wmv': 'video/x-ms-wmv',
    // Fallback to octet-stream for unknown types
  };
  
  return types[ext] || 'application/octet-stream';
}

export async function GET(request, { params }) {
  try {
    const filename = params?.filename;

    if (!filename) {
      return new NextResponse('Filename is required', { status: 400 });
    }

    // Construct the file path - check multiple possible locations
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'images', filename),
      path.join(process.cwd(), 'app', 'api', 'image', 'images', filename)
    ];

    let filePath;
    let fileExists = false;

    // Check which path exists
    for (const possiblePath of possiblePaths) {
      try {
        await fs.access(possiblePath);
        filePath = possiblePath;
        fileExists = true;
        console.log(`Found video at: ${filePath}`);
        break;
      } catch (error) {
        console.log(`Video not found at: ${possiblePath}`);
      }
    }

    // If file not found locally, try to fetch from external source as fallback
    if (!fileExists) {
      console.log(`Video not found locally, trying external source: ${filename}`);
      try {
        const externalUrl = `https://www.apurvachemicals.com/api/image/video/${filename}`;
        const response = await fetch(externalUrl);
        
        if (response.ok) {
          const videoBuffer = await response.arrayBuffer();
          return new NextResponse(videoBuffer, {
            status: 200,
            headers: {
              'Content-Type': getContentType(filename),
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Content-Length': response.headers.get('content-length'),
            },
          });
        }
      } catch (externalError) {
        console.error('Error fetching from external source:', externalError);
      }

      // If we get here, both local and external fetch failed
      console.error(`Video not found at any location: ${filename}`);
      const errorSvg = `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" fill="#9ca3af">
          Video not found: ${filename}
        </text>
      </svg>`;

      return new NextResponse(errorSvg, {
        status: 404,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    try {
      const fileBuffer = await fs.readFile(filePath);
      const contentType = getContentType(filename);
      
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Length': fileBuffer.length,
        },
      });
    } catch (error) {
      console.error('Error reading video file:', error);
      return new NextResponse('Error reading video file', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (error) {
    console.error('Unexpected error in video route:', error);
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
