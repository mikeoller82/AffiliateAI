
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

  // ───── Parse and validate request body ─────
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
    // ───── Verify the ID token with a 15-second timeout ─────
    const auth = getFirebaseAuth();
    const decodedToken = await Promise.race([
      auth.verifyIdToken(idToken as string),
      new Promise((_, r) =>
        setTimeout(() => r(new Error('Token verification timeout')), 15_000),
      ),
    ]);

    if (decodedToken instanceof Error) throw decodedToken;

    console.log('[session-login] Token verified for UID', decodedToken.uid);

    // ───── Create a session cookie (retry logic encapsulated) ─────
    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days in ms
    const sessionCookie = await createSessionCookieWithRetry(
      idToken as string,
      expiresIn,
    );

    // ───── Build and return response ─────
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

    // Granular error mapping if you like
    const isTimeout =
      err?.message?.includes('timeout') ||
      err?.code === 'ETIMEDOUT' ||
      err?.message === 'Token verification timeout';

    return NextResponse.json(
      {
        error: isTimeout ? 'Network timeout while verifying token' : 'Auth error',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: isTimeout ? 408 : 401 },
    );
  }
}
