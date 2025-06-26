
import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from './lib/firebase-admin';

async function verifySessionCookie(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get('__session')?.value;
  if (!cookie) {
    return false;
  }
  
  try {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    await auth.verifySessionCookie(cookie, true /** checkRevoked */);
    return true;
  } catch (error) {
    // Session cookie is invalid or expired.
    console.error('Session cookie verification failed in middleware:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'highlaunchpad.com';

  // Exclude API routes and static files from further processing early.
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/go/') ||
    url.pathname.includes('.') // for files like favicon.ico
  ) {
    return NextResponse.next();
  }

  // --- Protected Routes Logic ---
  if (url.pathname.startsWith('/dashboard')) {
    const isValidSession = await verifySessionCookie(request);
    if (!isValidSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  // --- End Protected Routes Logic ---

  // --- Subdomain routing for user sites ---
  const subdomain = hostname.replace(`.${mainDomain}`, '').replace(`:3000`, '');

  if (hostname.includes(`.${mainDomain}`) && subdomain !== 'www' && subdomain !== '') {
    url.pathname = `/render/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - go/ (affiliate link redirection)
     * This ensures the middleware runs on all pages and API routes needed for auth and routing.
     */
    '/((?!_next/static|_next/image|favicon.ico|go/).*)',
  ],
};
