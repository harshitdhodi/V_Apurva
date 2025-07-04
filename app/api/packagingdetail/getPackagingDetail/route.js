import { NextResponse } from 'next/server';
import PackagingDetail from '@/lib/models/PackagingDetail';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const packagingDetail = await PackagingDetail.findOne();
    return NextResponse.json(packagingDetail);
  } catch (error) {
    console.error('Failed to fetch packaging detail:', error);
    return NextResponse.json(
      { 
        message: 'Server error',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}