import { NextResponse } from 'next/server'; // For better typing and nextUrl access
import { connectDB } from '@/lib/db';
import Faq from '@/lib/models/faq';

export async function GET(request) {
  try {
    await connectDB();

    // Correct way to access query params in App Router
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

    // Optional: Handle missing productId (e.g., return empty or error)
    if (!productId) {
      return NextResponse.json(
        { error: 'productId query parameter is required' },
        { status: 400 }
      );
    }

    const faqs = await Faq.find({ product: productId, isActive: true }).sort({ order: 1 });  // 'asc' → 1

    return NextResponse.json({
      data: faqs,
      message: 'FAQs fetched successfully',
    });
  } catch (err) {
    console.error('Error fetching FAQs:', err);

    const errorMessage =
      err instanceof Error ? err.message : 'An unknown error occurred';

    return NextResponse.json(
      { error: `Failed to fetch FAQs: ${errorMessage}` },
      { status: 500 }
    );
  }
}