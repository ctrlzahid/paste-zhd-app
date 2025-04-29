import { NextRequest, NextResponse } from 'next/server';
import { UsageLimit } from '@/models/Analytics';
import { connectToDatabase } from '@/lib/database';

const DAILY_LIMIT = 50;

export async function rateLimiter(
  req: NextRequest,
  event: 'create' | 'view' | 'delete'
) {
  // Only apply rate limiting to creation of pastes
  if (event !== 'create') return null;

  await connectToDatabase();

  // Get the IP from the request headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

  // Format date as YYYY-MM-DD to track daily usage
  const today = new Date().toISOString().split('T')[0];

  try {
    // Try to find an existing record for this IP and date
    const usageRecord = await UsageLimit.findOne({ ip, date: today });

    if (usageRecord) {
      // If record exists, increment the count
      usageRecord.count += 1;
      await usageRecord.save();

      // Check if limit exceeded
      if (usageRecord.count > DAILY_LIMIT) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again tomorrow.' },
          { status: 429 }
        );
      }
    } else {
      // Create a new record if none exists
      await UsageLimit.create({ ip, date: today, count: 1 });
    }

    // Not rate limited, proceed with request
    return null;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // In case of error, allow the request to proceed but log the error
    return null;
  }
}
