// src/app/api/pageHeading/heading/route.ts
import { NextResponse } from 'next/server';
import PageHeadings from '@/lib/models/PageHeading';
import { connectDB } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageType = searchParams.get('pageType');

  if (!pageType) {
    return NextResponse.json(
      { message: 'pageType is required' },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const pageHeading = await PageHeadings.findOne({ pageType });

    if (!pageHeading) {
      return NextResponse.json(
        { message: 'Page heading not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      heading: pageHeading.heading,
      subheading: pageHeading.subheading
    });
  } catch (err) {
    console.error('Error in /api/pageHeading/heading:', err);
    return NextResponse.json(
      { message: 'Error retrieving page heading' },
      { status: 500 }
    );
  }
}