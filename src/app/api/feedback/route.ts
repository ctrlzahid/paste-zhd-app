import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Feedback } from '@/models/Feedback';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { message, email } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get the IP and user agent
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const userAgent = req.headers.get('user-agent') || undefined;

    await Feedback.create({
      message,
      email,
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
