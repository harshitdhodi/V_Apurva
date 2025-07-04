import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Aboutus from '@/lib/models/aboutus';

let isConnected = false;

export async function GET() {
  try {
    // Connect to the database if not already connected
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    // Use lean() for better performance since we only need plain objects
    const aboutus = await Aboutus.findOne({ status: 'active' }).lean().exec();
    
    if (!aboutus) {
      return NextResponse.json({ error: "No active 'About Us' record found." }, { status: 404 });
    }

    // Convert _id to string and handle dates
    const result = {
      ...aboutus,
      _id: aboutus._id.toString(),
      // Convert dates to ISO strings if they exist and are Date objects
      ...(aboutus.createdAt && { 
        createdAt: aboutus.createdAt instanceof Date 
          ? aboutus.createdAt.toISOString() 
          : aboutus.createdAt 
      }),
      ...(aboutus.updatedAt && { 
        updatedAt: aboutus.updatedAt instanceof Date 
          ? aboutus.updatedAt.toISOString() 
          : aboutus.updatedAt 
      })
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch about us data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch about us data' }, 
      { status: 500 }
    );
  }
}
