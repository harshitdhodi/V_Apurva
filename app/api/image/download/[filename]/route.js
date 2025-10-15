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
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    // Videos
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg'
  };
  
  return types[ext] || 'application/octet-stream';
}

export async function GET(request, { params }) {
  try {
    const { filename } = await params || {};
  
    if (!filename) {
      return new NextResponse('Filename is required', { status: 400 });
    }

    // Construct the file path - check both possible locations
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
        break;
      } catch (error) {
        console.log(`File not found at: ${possiblePath}`);
      }
    }

    if (!fileExists) {
      console.error(`File not found at any location: ${filename}`);
      const errorSvg = `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" fill="#9ca3af">
          File not found: ${filename}
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

    // console.log(`Serving file from: ${filePath}`);
    
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
      console.error('Error reading file:', error);
      return new NextResponse('Error reading file', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
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