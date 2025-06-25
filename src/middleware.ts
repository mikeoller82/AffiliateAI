
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Use localhost for development, and your actual domain for production.
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'highlaunchpad.com';

  // Prevent rewriting for special Next.js paths, API routes, or our /go redirects.
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/go/')
  ) {
    return NextResponse.next();
  }

  // Check if the hostname is a subdomain.
  const subdomain = hostname.replace(`.${mainDomain}`, '').replace(`:3000`, '');

  if (hostname.includes(`.${mainDomain}`) && subdomain !== 'www') {
    // Rewrite the path to our special rendering route
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
     * - /go/ (for affiliate links)
     */
    '/((?!_next/static|_next/image|favicon.ico|go/).*)',
  ],
};
