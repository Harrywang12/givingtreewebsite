import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, ContactEmailData } from '@/lib/email';
import { rateLimit } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting to prevent spam
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `contact_${clientIp}`;
    const isAllowed = await rateLimit.check(rateLimitKey, 5, 3600); // 5 emails per hour
    
    if (!isAllowed) {
      return NextResponse.json(
        { 
          error: 'Too many contact form submissions. Please try again later.'
        },
        { status: 429 }
      );
    }

    const { name, email, subject, message }: ContactEmailData = await request.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check for required environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Email configuration missing: GMAIL_USER or GMAIL_APP_PASSWORD not set');
      return NextResponse.json(
        { error: 'Email service is not configured. Please try again later.' },
        { status: 503 }
      );
    }

    // Send email
    await sendContactEmail({ name, email, subject, message });

    return NextResponse.json({
      message: 'Your message has been sent successfully! We will get back to you soon.',
      success: true
    });

  } catch (error) {
    console.error('Contact email error:', error);
    
    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes('Invalid login')) {
      return NextResponse.json(
        { error: 'Email service authentication failed. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
