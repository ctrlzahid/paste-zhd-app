import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip the auth API endpoint
  if (request.nextUrl.pathname === '/api/admin/auth') {
    return NextResponse.next();
  }

  // Only apply to admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip the login route and auth route
    if (
      request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname === '/admin/auth'
    ) {
      return NextResponse.next();
    }

    // Get the authorization from cookies
    const authCookie = request.cookies.get('adminAuth');

    // Create the expected auth header
    const expectedAuth = `Basic ${Buffer.from(
      `admin:${process.env.ADMIN_PASSWORD || 'adminpassword'}`
    ).toString('base64')}`;

    // Check if the cookie exists and matches the expected auth
    if (!authCookie || authCookie.value !== expectedAuth) {
      // If not authorized, check if the request has an Authorization header
      const authHeader = request.headers.get('authorization');

      // If no auth header or it doesn't match, redirect to login
      if (!authHeader || authHeader !== expectedAuth) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }

    // If authorized, add the Authorization header from the cookie
    const response = NextResponse.next();
    if (authCookie) {
      response.headers.set('Authorization', authCookie.value);
    }

    return response;
  }

  return NextResponse.next();
}

// Only run middleware on admin routes and API admin routes
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
