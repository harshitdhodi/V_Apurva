import Meta from '@/models/Meta';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();

    const allMeta = await Meta.find();

    return Response.json(
      { success: true, data: allMeta },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching all metadata:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}