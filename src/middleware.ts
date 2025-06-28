
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  // Allow access to the root page regardless of session
  if (pathname === '/') {
    return NextResponse.next();
  }

  // If trying to access protected routes without a session, redirect to login
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If on login or signup page with a valid session, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/signup')) {
     return NextResponse.redirect(new URL('/dashboard', request.url));
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
     * - go/ (affiliate link redirection)
     * - sites/ (publicly rendered sites)
     * - render/ (publicly rendered sites)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|go|sites|render).*)',
  ],
};
