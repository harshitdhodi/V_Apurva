// src/middleware.js
import { NextResponse } from 'next/server';

// This function runs on every request
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Remove trailing slashes
  if (pathname.endsWith('/') && pathname !== '/') {
    return NextResponse.redirect(new URL(pathname.slice(0, -1), request.url));
  }
  
  return NextResponse.next();
}

// Optional: Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};