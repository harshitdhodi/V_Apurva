import { connectDB } from '@/lib/db';
import Footer from '@/lib/models/Footer';

export async function GET() {
  try {
    await connectDB();
    
    const footer = await Footer.findOne({}, 'address addresslink location');
    
    if (!footer) {
      return new Response(
        JSON.stringify({ message: 'Footer not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(footer),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching footer address and location:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const dynamic = 'force-dynamic';