import { NextResponse } from 'next/server';
import OurPeople from '@/lib/models/OurPeople';
import { connectDB } from '@/lib/db';


export async function GET() {
  try {
    await connectDB();
    
    const ourPeople = await OurPeople.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: ourPeople,
      message: 'Our People data fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching Our People data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching Our People data',
        error: error.message
      },
      { status: 500 }
    );
  }
}
