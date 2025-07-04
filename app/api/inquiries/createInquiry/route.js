import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const inquiry = new Inquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      ipaddress: data.ipaddress,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_id: data.utm_id,
      gclid: data.gclid,
      gcid_source: data.gcid_source,
      utm_content: data.utm_content,
      utm_term: data.utm_term,
      createdAt: new Date()
    });

    await inquiry.save();

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
