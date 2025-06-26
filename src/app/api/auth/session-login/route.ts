
// src/app/api/auth/session-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp, createSessionCookieWithRetry } from '@/lib/firebase-admin';
import admin from 'firebase-admin'; // Keep for types like admin.auth.DecodedIdToken

export async function POST(request: NextRequest) {
  console.log('=== Session Login API Called ===');
  
  try {
    // Ensure Firebase Admin App is initialized by calling getAdminApp
    const adminApp = getAdminApp();
    const adminAuth = admin.auth(adminApp);

    let body;
    try {
      body = await request.json();
      console.log('Request body parsed successfully:', { hasIdToken: !!body.idToken });
    } catch (parseError: any) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError.message || 'Unknown parsing error'
      }, { status: 400 });
    }

    const { idToken } = body;

    if (!idToken) {
      console.error('No ID token provided');
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    let decodedToken: admin.auth.DecodedIdToken;
    try {
      console.log('Verifying ID token...');
      const verifyWithTimeout = Promise.race([
        adminAuth.verifyIdToken(idToken), // Use adminAuth from getAdminApp
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Token verification timeout')), 15000) // 15 seconds timeout
        )
      ]);
      decodedToken = await verifyWithTimeout as admin.auth.DecodedIdToken;
      console.log('ID token verified for user:', decodedToken.uid);
    } catch (verifyError: any) {
      console.error('Failed to verify ID token:', verifyError);
      if (verifyError.message?.includes('timeout') || verifyError.code === 'auth/network-request-failed' || verifyError.code === 'ERR_SOCKET_CONNECTION_TIMEOUT') {
        return NextResponse.json({ 
          error: 'Network timeout while verifying token',
          details: 'Please check your internet connection and try again.'
        }, { status: 408 });
      }
      if (verifyError.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'ID token has expired. Please log in again.', details: verifyError.message }, { status: 401 });
      }
      if (verifyError.code === 'auth/invalid-id-token') {
         return NextResponse.json({ error: 'Invalid ID token. The token may be malformed, the signature may be incorrect, or the projects may not match.', details: verifyError.message }, { status: 401 });
      }
      return NextResponse.json({ 
        error: 'Invalid ID token',
        details: verifyError.message || 'Token verification failed'
      }, { status: 401 });
    }

    try {
      console.log('Creating session cookie...');
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

      // Use the imported helper function for creating session cookie with adminAuth
      const sessionCookie = await createSessionCookieWithRetry(idToken, expiresIn);

      console.log('Session cookie created successfully');

      const response = NextResponse.json({ 
        success: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
        }
      });

      response.cookies.set({
        name: '__session',
        value: sessionCookie,
        maxAge: expiresIn / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      console.log('Session login completed successfully');
      return response;

    } catch (sessionError: any) {
      console.error('Failed to create session cookie:', sessionError);
      if (sessionError.code === 'auth/internal-error') {
         return NextResponse.json({ error: 'Firebase internal error during session creation.', details: sessionError.message }, { status: 500 });
      }
      return NextResponse.json({ 
        error: 'Failed to create session',
        details: sessionError.message || 'Session creation failed'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Unexpected error in session login:', error);
    if (error.message?.includes('Firebase Admin credentials are not set')) {
      return NextResponse.json({ error: 'Server configuration error: Firebase Admin credentials are not set properly.', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'An unexpected error occurred',
      type: error.constructor?.name
    }, { status: 500 });
  }
}
