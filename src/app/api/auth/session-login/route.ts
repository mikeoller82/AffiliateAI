
import { NextRequest, NextResponse } from 'next/server';
import {
  getFirebaseAuth,
  createSessionCookieWithRetry,
} from '@/lib/firebase-admin';

/**
 * POST /api/auth/session-login
 * 
 * Expected body: { idToken: string }
 * – Verifies the ID token with Firebase Admin
 * – Creates a session cookie (5-day expiry by default)
 * – Returns the decoded token payload and sets `__session`
 */
export async function POST(request: NextRequest) {
  console.log('=== Session Login API called ===');

  let body: { idToken?: string };
  try {
    body = await request.json();
  } catch (err) {
    console.error('[session-login] Invalid JSON body:', err);
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 },
    );
  }

  const { idToken } = body;
  if (!idToken) {
    return NextResponse.json(
      { error: 'idToken is required' },
      { status: 400 },
    );
  }

  try {
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    console.log('[session-login] Token verified for UID', decodedToken.uid);

    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days in ms
    const sessionCookie = await createSessionCookieWithRetry(
      idToken,
      expiresIn,
    );

    const response = NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
    });

    response.cookies.set({
      name: '__session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
    });

    return response;
  } catch (err: any) {
    console.error('[session-login] Failed:', err);

    let errorMessage = "Authentication error occurred.";
    if (err.code === 'auth/id-token-expired') {
        errorMessage = "Login session has expired. Please try again.";
    } else if (err.message?.includes('Firebase ID token has invalid signature')) {
        errorMessage = "Invalid login credentials. Please try again.";
    } else if (err.message?.includes('private_key')) {
        errorMessage = "Server configuration error: The Firebase Admin private key is not configured correctly.";
    }

    return NextResponse.json(
      {
        error: "Auth error",
        details: errorMessage,
      },
      { status: 401 },
    );
  }
}
