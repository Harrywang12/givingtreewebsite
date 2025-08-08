import { NextRequest, NextResponse } from 'next/server';
import { sendItemDonationEmail, ItemDonationEmailData } from '@/lib/email';
import { rateLimit } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting to prevent spam
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `donation_${clientIp}`;
    const isAllowed = await rateLimit.check(rateLimitKey, 3, 3600); // 3 donation emails per hour
    
    if (!isAllowed) {
      return NextResponse.json(
        { 
          error: 'Too many donation submissions. Please try again later.'
        },
        { status: 429 }
      );
    }

    const data: ItemDonationEmailData = await request.json();

    // Basic validation
    if (!data.name || !data.email || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Name, email, and at least one item are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of data.items) {
      if (!item.name || !item.category || !item.condition || !item.quantity) {
        return NextResponse.json(
          { error: 'Each item must have a name, category, condition, and quantity' },
          { status: 400 }
        );
      }
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
    await sendItemDonationEmail(data);

    return NextResponse.json({
      message: 'Your donation request has been sent successfully! We will contact you soon to arrange pickup.',
      success: true
    });

  } catch (error) {
    console.error('Item donation email error:', error);
    
    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes('Invalid login')) {
      return NextResponse.json(
        { error: 'Email service authentication failed. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send donation request. Please try again later.' },
      { status: 500 }
    );
  }
}
