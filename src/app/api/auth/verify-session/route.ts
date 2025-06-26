
import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  const { sessionCookie } = await request.json();

  if (!sessionCookie) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  try {
    const auth = getAuth(getAdminApp());
    await auth.verifySessionCookie(sessionCookie, true /** checkRevoked */);
    return NextResponse.json({ isValid: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Firebase Admin credentials')) {
        console.error('Session verification failed due to missing admin credentials.');
    }
    // Session cookie is invalid or expired.
    return NextResponse.json({ isValid: false }, { status: 200 });
  }
}
