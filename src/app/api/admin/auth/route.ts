import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Set the Authorization header in a cookie so the browser will send it with subsequent requests
  const authHeader = `Basic ${Buffer.from(
    `admin:${process.env.ADMIN_PASSWORD || 'adminpassword'}`
  ).toString('base64')}`;

  // Create a response
  const response = NextResponse.json({
    success: true,
    message: 'Authenticated successfully',
  });

  // Set cookie for the admin auth
  response.cookies.set({
    name: 'adminAuth',
    value: authHeader,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return response;
}
