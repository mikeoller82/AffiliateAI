
import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const auth = getAuth(getAdminApp());
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    const options = { name: '__session', value: sessionCookie, maxAge: expiresIn, httpOnly: true, secure: true, path: '/' };

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set(options);
    
    return response;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    if (error instanceof Error && error.message.includes('Firebase Admin credentials')) {
        return NextResponse.json({ error: 'Server configuration error: Firebase Admin credentials are not set in environment variables.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}
