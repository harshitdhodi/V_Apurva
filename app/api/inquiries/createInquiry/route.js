import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';
import { connectDB } from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const emailTemplate = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Inquiry</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            max-width: 600px;
            margin: 20px auto;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
        }
        p {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            margin: 10px 0;
        }
        .field {
            font-weight: bold;
            color: #333;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #aaa;
            text-align: center;
        }
        .centered-text {
            text-align: center;
            margin: 20px 0;
            font-size: 20px;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>APURVA CHEMICALS PVT LTD</h2>
        <p class="centered-text">New Inquiry!!</p>
        <p><span class="field">Name:</span> ${data.name || 'Not provided'}</p>
        <p><span class="field">Email:</span> ${data.email || 'Not provided'}</p>
        <p><span class="field">Phone:</span> ${data.phone || 'Not provided'}</p>
        <p><span class="field">Message:</span></p>
        <p>${data.message || 'No message provided'}</p>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>`;

export async function POST(req) {
  try {
    await connectDB();
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.email || !data.name) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const inquiry = new Inquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      path: data.path,
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

    // Prepare and send email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Using the same email as the sender
      to: process.env.EMAIL_USER,
      replyTo: data.email,
      subject: `New Inquiry from ${data.name}`,
      html: emailTemplate(data)
    };

    await transporter.sendMail(mailOptions);
    console.log('Inquiry email sent successfully');

    await inquiry.save();

    return NextResponse.json(
      { success: true, data: inquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing inquiry:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: error.statusCode || 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}