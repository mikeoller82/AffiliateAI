
import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

async function verifySessionCookie(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get('__session')?.value;
  if (!sessionCookie) {
    return false;
  }

  try {
    const auth = getAuth(getAdminApp());
    await auth.verifySessionCookie(sessionCookie, true);
    return true;
  } catch (error) {
    // Session cookie is invalid or expired.
    // It's a warning, not an error, because this is expected for logged-out users.
    console.warn('Session cookie verification failed. This is expected if the user is not logged in or the session has expired.');
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'highlaunchpad.com';

  // Exclude most static and API files from the middleware protection logic,
  // but allow the logic to run on /dashboard and its sub-paths.
  const isStaticOrApiAsset = url.pathname.startsWith('/_next') ||
                             url.pathname.startsWith('/go/') ||
                             url.pathname.includes('.');

  if (isStaticOrApiAsset) {
    return NextResponse.next();
  }

  // --- Protected Routes Logic ---
  if (url.pathname.startsWith('/dashboard')) {
    const isValidSession = await verifySessionCookie(request);
    if (!isValidSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', url.pathname);
      
      const response = NextResponse.redirect(loginUrl);
      // Clear the invalid cookie
      response.cookies.delete('__session');
      return response;
    }
  }
  // --- End Protected Routes Logic ---

  // --- Subdomain routing for user sites ---
  const subdomain = hostname.replace(`.${mainDomain}`, '').replace(`:3000`, '');

  if (hostname.includes(`.${mainDomain}`) && subdomain !== 'www' && subdomain !== '') {
    // Prevent rewriting for /dashboard on a subdomain
    if (url.pathname.startsWith('/dashboard')) {
        return NextResponse.next();
    }
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
