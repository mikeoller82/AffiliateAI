
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './lib/firebase-admin'; // Using admin SDK for server-side verification

async function verifySessionCookie(cookie: string): Promise<boolean> {
  if (!cookie) return false;
  try {
    // Use the Firebase Admin SDK to verify the session cookie
    await auth.verifySessionCookie(cookie, true /** checkRevoked */);
    return true;
  } catch (error) {
    console.error('Session cookie verification failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'highlaunchpad.com';

  // --- Protected Routes Logic ---
  const protectedPaths = ['/dashboard', '/sites', '/editor'];
  const isProtectedRoute = protectedPaths.some(path => url.pathname.startsWith(path));

  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get('__session')?.value || '';
    const isValidSession = await verifySessionCookie(sessionCookie);

    if (!isValidSession) {
      // Redirect to login page if session is not valid
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  // --- End Protected Routes Logic ---

  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/go/')
  ) {
    return NextResponse.next();
  }

  const subdomain = hostname.replace(`.${mainDomain}`, '').replace(`:3000`, '');

  if (hostname.includes(`.${mainDomain}`) && subdomain !== 'www') {
    url.pathname = `/render/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|go/).*)',
  ],
};
