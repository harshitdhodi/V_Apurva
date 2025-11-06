import { connectDB } from "@/lib/db";
import News from "@/lib/models/News";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const clientIP = searchParams.get("clientIP");

  try {
    if (!id || !clientIP) {
      return NextResponse.json(
        { message: "Blog ID and client IP are required" },
        { status: 400 }
      );
    }

    // First, ensure the document exists and get the current visits value
    const existingBlog = await News.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { message: "Blog not found" },
        { status: 404 }
      );
    }

    // Check if IP has already viewed
    if (existingBlog.viewedIPs?.includes(clientIP)) {
      return NextResponse.json(existingBlog, { status: 200 });
    }

    // Convert visits to number if it's a string
    const currentVisits = typeof existingBlog.visits === 'string' 
      ? parseInt(existingBlog.visits, 10) || 0 
      : (existingBlog.visits || 0);

    // Update with the incremented value
    const result = await News.findByIdAndUpdate(
      id,
      {
        $set: { visits: currentVisits + 1 },
        $push: { viewedIPs: clientIP }
      },
      { new: true }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error incrementing blog visits:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}