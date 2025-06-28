
import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: NextRequest) {
  let adminApp;
  try {
    // Attempt to get the initialized Firebase Admin app.
    // getAdminApp will throw a specific error if configuration is wrong.
    adminApp = getAdminApp();
  } catch (error: any) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    // Return the specific error message from getAdminApp to the client.
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  try {
    const auth = getAuth(adminApp);
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    // Verify the ID token and create the session cookie.
    const decodedToken = await auth.verifyIdToken(idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true, uid: decodedToken.uid });
    response.cookies.set({
      name: '__session',
      value: sessionCookie,
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    return response;

  } catch (error: any) {
    console.error('❌ Error during session cookie creation:', error);
    
    let errorMessage = 'An unexpected error occurred during login.';
    let statusCode = 500;

    // Provide more specific error messages for common auth issues during token verification.
    if (error.code) {
      switch (error.code) {
        case 'auth/id-token-expired':
          errorMessage = 'Your session has expired. Please sign in again.';
          statusCode = 401;
          break;
        case 'auth/invalid-id-token':
          errorMessage = 'Authentication failed. The token is invalid.';
          statusCode = 401;
          break;
        case 'auth/argument-error':
           if (error.message.includes('mismatch')) {
              errorMessage = 'Authentication configuration error. The client and server Firebase projects might not match.';
           } else {
              errorMessage = 'An internal authentication error occurred.';
           }
           statusCode = 401;
           break;
        default:
          errorMessage = error.message || errorMessage;
      }
    } else if (error.message?.includes('invalid_grant')) {
        errorMessage = 'Firebase credential error: The service account key is likely invalid or expired, or the server time is out of sync. Please generate a new private key from your Firebase project settings and update the FIREBASE_SERVICE_ACCOUNT_JSON environment variable.';
        statusCode = 401;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
