import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Mission from '@/lib/models/Mission';

export async function GET() {
  try {
    await connectDB();
    console.log('Fetching active mission...');
    
    const mission = await Mission.getActiveMission();
    
    if (!mission) {
      console.log('No active mission found');
      return NextResponse.json(
        { error: 'No active mission found' },
        { status: 404 }
      );
    }

    console.log('Mission found:', mission.title);
    return NextResponse.json({ data: mission });
  } catch (error) {
    console.error('Error in GET /api/mission/getAllActiveMissions:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
