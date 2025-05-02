import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for login and API routes
    if (
      request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname.startsWith('/api/')
    ) {
      return NextResponse.next();
    }

    // Check for auth cookie
    const authCookie = request.cookies.get('admin_auth');
    if (!authCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
