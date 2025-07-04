import { NextResponse } from 'next/server';
import MenuListing from '@/lib/models/MenuListing';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const menuListings = await MenuListing.find().sort('priority');
    const count = await MenuListing.countDocuments();
    
    return NextResponse.json({ count, menuListings });
  } catch (error) {
    console.error('Failed to fetch menu listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu listings.' },
      { status: 500 }
    );
  }
}