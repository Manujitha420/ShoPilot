import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes requiring authentication
const protectedRoutes = ['/checkout', '/settings', '/favorites', '/orders'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname matches any protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    // In client-side / dummy-auth, token or user session is stored in cookies or localStorage.
    // Check for auth token in cookies
    const authToken = request.cookies.get('shopilot_token')?.value || request.cookies.get('token')?.value;

    // Note: If auth is purely client-side localStorage in demo environment, 
    // client components will perform additional fallback redirects.
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/settings/:path*',
    '/favorites/:path*',
    '/orders/:path*',
  ],
};
