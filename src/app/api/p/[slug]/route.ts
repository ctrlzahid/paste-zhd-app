import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Paste } from '@/models/Paste';
import { trackEvent } from '@/lib/analytics';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;
    const paste = await Paste.findOne({ slug });

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    // Check if paste has expired
    if (paste.expiresAt && new Date() > new Date(paste.expiresAt)) {
      // Delete the expired paste
      await Paste.findByIdAndDelete(paste._id);
      return NextResponse.json(
        { error: 'This paste has expired' },
        { status: 404 }
      );
    }

    // Track the view event
    await trackEvent(req, 'view', {
      pasteId: paste._id.toString(),
      pasteSlug: paste.slug,
      syntax: paste.syntax,
    });

    return NextResponse.json({
      content: paste.content,
      syntax: paste.syntax,
      createdAt: paste.createdAt,
      expiresAt: paste.expiresAt,
    });
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paste' },
      { status: 500 }
    );
  }
}

// Handle report or delete requests
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;
    const paste = await Paste.findOne({ slug });

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    // Delete the paste
    await Paste.findByIdAndDelete(paste._id);

    // Track the delete event
    await trackEvent(req, 'delete', {
      pasteId: paste._id.toString(),
      pasteSlug: paste.slug,
      syntax: paste.syntax,
    });

    return NextResponse.json({ message: 'Paste deleted successfully' });
  } catch (error) {
    console.error('Error deleting paste:', error);
    return NextResponse.json(
      { error: 'Failed to delete paste' },
      { status: 500 }
    );
  }
}
