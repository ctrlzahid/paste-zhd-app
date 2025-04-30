import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Paste } from '@/models/Paste';
import { nanoid } from 'nanoid';
import { rateLimiter } from '@/lib/rate-limiter';
import { trackEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    // Check rate limit first
    const rateLimitResponse = await rateLimiter(req, 'create');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await connectToDatabase();

    const { content, syntax = 'text', expiresIn = '1d' } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Update character limit to 100,000 (1 lakh)
    const MAX_CHARS = 100_000;
    if (content.length > MAX_CHARS) {
      return NextResponse.json(
        {
          error: `Content exceeds maximum length of ${MAX_CHARS.toLocaleString()} characters`,
        },
        { status: 400 }
      );
    }

    // Calculate expiration date
    const expiresAt = new Date();
    switch (expiresIn) {
      case '1h':
        expiresAt.setHours(expiresAt.getHours() + 1);
        break;
      case '1d':
        expiresAt.setDate(expiresAt.getDate() + 1);
        break;
      case '1w':
        expiresAt.setDate(expiresAt.getDate() + 7);
        break;
      case '1m':
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        break;
      default:
        expiresAt.setDate(expiresAt.getDate() + 1); // Default to 1 day
    }

    // Generate a random slug
    const slug = nanoid(12);

    // Create the paste
    const paste = await Paste.create({
      content,
      syntax,
      expiresAt,
      slug,
    });

    // Track the creation event
    await trackEvent(req, 'create', {
      pasteId: paste._id.toString(),
      pasteSlug: paste.slug,
      syntax: paste.syntax,
    });

    return NextResponse.json({ slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Failed to create paste' },
      { status: 500 }
    );
  }
}
