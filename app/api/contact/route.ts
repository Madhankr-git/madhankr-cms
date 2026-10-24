import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    console.log(`[Contact Form Received] From: ${name} <${email}> | Subject: ${subject || 'General'} | Message: ${message}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received. Madhan will respond shortly.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error', details: err?.message }, { status: 500 });
  }
}
