import dbConnect from '@/lib/dbConnect';
import Faq from '@/models/Faq';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  const { productId } = params;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid Product ID provided.' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const faqs = await Faq.find({ product: productId, isActive: true })
      .sort({ order: 'asc' })
      .lean(); // Use .lean() for faster, read-only operations

    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('API Error fetching FAQs by product ID:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred on the server.' },
      { status: 500 }
    );
  }
}