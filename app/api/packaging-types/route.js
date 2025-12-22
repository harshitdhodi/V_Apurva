import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import PackagingType from '@/lib/models/PackagingType';

export async function GET() {
  try {
    await connectDB();
    const packagingTypes = await PackagingType.find().sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      count: packagingTypes.length,
      data: packagingTypes
    });
    
  } catch (error) {
    console.error('Error fetching packaging types:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error fetching packaging types',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }
    
    const newPackagingType = new PackagingType({
      title: body.title,
      photo: body.photo || '',
      alt: body.alt || '',
      imgTitle: body.imgTitle || ''
    });
    
    const savedType = await newPackagingType.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Packaging type created successfully',
        data: savedType 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating packaging type:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error creating packaging type',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
