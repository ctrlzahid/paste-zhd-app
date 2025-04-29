import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Paste } from '@/models/Paste';
import { trackEvent } from '@/lib/analytics';

// Custom context type for route handler
type Context = {
  params: {
    slug: string;
  };
};

export async function GET(req: NextRequest, context: Context) {
  try {
    await connectToDatabase();

    const { slug } = context.params;
    const paste = await Paste.findOne({ slug });

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    // If expired, delete and return error
    if (paste.expiresAt && new Date() > new Date(paste.expiresAt)) {
      await Paste.findByIdAndDelete(paste._id);
      return NextResponse.json(
        { error: 'This paste has expired' },
        { status: 404 }
      );
    }

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

export async function POST(req: NextRequest, context: Context) {
  try {
    await connectToDatabase();

    const { slug } = context.params;
    const paste = await Paste.findOne({ slug });

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    await Paste.findByIdAndDelete(paste._id);

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
