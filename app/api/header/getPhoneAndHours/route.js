import { connectDB } from '@/lib/db';
import Header from '@/lib/models/Header';

export async function GET() {
  try {
    await connectDB();
    
    const header = await Header.findOne({}, 'phoneNo openingHours');
    
    if (!header) {
      return new Response(
        JSON.stringify({ message: 'Header not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(header),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching header phone and hours:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const dynamic = 'force-dynamic';