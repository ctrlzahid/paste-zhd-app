export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Paste } from '@/models/Paste';
import { trackEvent } from '@/lib/analytics';
import bcrypt from 'bcryptjs';

// ✅ this is the only correct typing Next.js 15 accepts
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const slug = req.nextUrl.searchParams.get('slug');
    const passwordAttempt = req.headers.get('x-paste-password') || '';
    const paste = await Paste.findOne({ slug });

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    if (paste.expiresAt && new Date() > new Date(paste.expiresAt)) {
      await Paste.findByIdAndDelete(paste._id);
      return NextResponse.json(
        { error: 'This paste has expired' },
        { status: 404 }
      );
    }

    // Password protection
    if (paste.password) {
      if (!passwordAttempt) {
        return NextResponse.json(
          { error: 'Password required', passwordRequired: true },
          { status: 401 }
        );
      }
      const isMatch = await bcrypt.compare(passwordAttempt, paste.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: 'Incorrect password', passwordRequired: true },
          { status: 401 }
        );
      }
    }

    // Burn after read: delete after first view
    if (paste.burnAfterRead) {
      await Paste.findByIdAndDelete(paste._id);
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
      burnAfterRead: paste.burnAfterRead || false,
      passwordProtected: !!paste.password,
    });
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paste' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const slug = req.nextUrl.searchParams.get('slug');
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
