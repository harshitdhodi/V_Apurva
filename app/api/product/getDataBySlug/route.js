import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import ProductDetail from '@/lib/models/ProductDetail';

// Connect to the database
await connectDB();

export async function GET(request) {
  try {
    // Get the searchParams from the request URL
    const { searchParams } = new URL(request.url);
    const slugs = searchParams.get('slugs');

    if (!slugs) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Find product data by slug
    const productData = await Product.findOne({ slug: slugs });

    if (!productData) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Find product detail data by productId (using the same slug as productId)
    const productDetailData = await ProductDetail.findOne({ productId: slugs });

    return NextResponse.json({
      success: true,
      productData,
      productDetailData: productDetailData || null
    });

  } catch (error) {
    console.error('Error in GET /api/product/getDataBySlug:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Optionally add other HTTP methods if needed
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

// Add any other HTTP methods you want to handle
// export async function PATCH() { ... }
