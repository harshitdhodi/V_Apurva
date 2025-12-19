import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const access = promisify(fs.access);
const stat = promisify(fs.stat);

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fileExists(path) {
  try {
    await access(path, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request, { params }) {
  try {
    // console.log('MSDS request received, params:', params);
    const { filename } = params || {};
    
    if (!filename) {
      console.error('No filename provided in request');
      return new NextResponse('Filename is required', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Security: Prevent directory traversal
    if (filename.includes('..') || path.isAbsolute(filename)) {
      console.error('Invalid filename:', filename);
      return new NextResponse('Invalid filename', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Define possible locations for MSDS files
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'msds', filename),
      path.join(process.cwd(), 'app', 'api', 'image', 'msds', filename)
    ];

    // console.log('Checking for file in paths:', possiblePaths);

    let filePath;
    let fileFound = false;

    // Check which path exists
    for (const possiblePath of possiblePaths) {
      if (await fileExists(possiblePath)) {
        filePath = possiblePath;
        fileFound = true;
        // console.log('Found file at:', filePath);
        break;
      }
      console.log('File not found at:', possiblePath);
    }

    if (!fileFound) {
      const errorMessage = `MSDS file not found: ${filename}. Checked paths: ${possiblePaths.join(', ')}`;
      console.error(errorMessage);
      return new NextResponse(errorMessage, {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    try {
      const fileStat = await stat(filePath);
      const fileStream = fs.createReadStream(filePath);
      
      const response = new NextResponse(fileStream, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Content-Length': fileStat.size.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });

      // Handle client disconnection
      request.signal.addEventListener('abort', () => {
        fileStream.destroy();
      });

      return response;
    } catch (error) {
      console.error('Error reading file:', error);
      return new NextResponse('Error reading file', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch (error) {
    console.error('Unexpected error in MSDS route:', error);
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
