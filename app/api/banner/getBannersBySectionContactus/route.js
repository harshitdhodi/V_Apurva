import { connectDB } from '@/lib/db';
import Banner from '@/lib/models/Banner';

export async function GET() {
  try {
    await connectDB();
    
    const banners = await Banner.find({ 
      section: 'Contact',
      status: 'active' 
    }).sort({ priority: 1 });

    return new Response(JSON.stringify({
      success: true,
      data: banners,
      message: "Banners for Contact Us section fetched successfully"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error("Error fetching Contact Us section banners:", err);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to fetch Contact Us banners"
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export const dynamic = 'force-dynamic';