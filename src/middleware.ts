import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Simple check if user is "logged in"
  // In a real app, you'd verify a JWT or session cookie
  const isAuthenticated = request.cookies.get('firebase-auth-token'); // Example, adjust to your auth mechanism

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // This part is tricky without real auth. For now, let's assume if they go to dashboard they should be logged in.
    // If you had a real auth token, you'd check it here.
    // If not authenticated, redirect to login page.
    // In this MVP, we let the client-side logic in the dashboard page handle the redirect.
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
