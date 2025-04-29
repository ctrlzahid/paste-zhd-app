import { NextRequest } from 'next/server';
import { AnalyticsEvent } from '@/models/Analytics';
import { connectToDatabase } from '@/lib/database';

export async function trackEvent(
  req: NextRequest,
  event: 'create' | 'view' | 'delete',
  data: {
    pasteId?: string;
    pasteSlug?: string;
    syntax?: string;
  } = {}
) {
  try {
    await connectToDatabase();

    // Get the IP and user agent from the request
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const userAgent = req.headers.get('user-agent') || undefined;

    // Create an analytics event
    await AnalyticsEvent.create({
      ip,
      event,
      pasteId: data.pasteId,
      pasteSlug: data.pasteSlug,
      syntax: data.syntax,
      userAgent,
      timestamp: new Date(),
    });
  } catch (error) {
    // Log but don't throw to avoid disrupting the main flow
    console.error('Error tracking analytics event:', error);
  }
}
