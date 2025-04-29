import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Paste } from '@/models/Paste';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToDatabase();

    const paste = await Paste.findOne({ slug: params.slug });

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    if (paste.expiresAt && new Date(paste.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Paste has expired' }, { status: 410 });
    }

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

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToDatabase();

    const paste = await Paste.findOne({ slug: params.slug });

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    if (paste.expiresAt && new Date(paste.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Paste has expired' }, { status: 410 });
    }

    paste.reportCount += 1;
    paste.isReported = paste.reportCount >= 3;

    await paste.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reporting paste:', error);
    return NextResponse.json(
      { error: 'Failed to report paste' },
      { status: 500 }
    );
  }
}
