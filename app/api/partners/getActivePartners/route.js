import { connectDB } from '@/lib/db';
import Partner from '@/lib/models/Partner';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch partners with active status
    const activePartners = await Partner.find({ status: 'active' });

    return Response.json({
      success: true,
      status: 200,
      data: activePartners,
      total: activePartners.length,
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        status: 500, 
        message: error.message 
      },
      { status: 500 }
    );
  }
}
