
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
    console.error('[session-login] CRITICAL_ERROR:', JSON.stringify(err, null, 2));

    let errorMessage = "An unknown authentication error occurred.";
    let errorCode = err.code || "UNKNOWN_AUTH_ERROR";

    switch (errorCode) {
      case 'auth/id-token-expired':
        errorMessage = "Login session has expired. Please log in again.";
        break;
      case 'auth/id-token-revoked':
        errorMessage = "Your session has been revoked. Please log in again.";
        break;
      case 'auth/invalid-argument':
      case 'auth/invalid-id-token':
        errorMessage = "The authentication token was invalid. Please try again.";
        break;
      case 'auth/project-not-found':
        errorMessage = "The Firebase project could not be found. Check server configuration.";
        break;
      case 'auth/user-disabled':
        errorMessage = "This user account has been disabled.";
        break;
      case 'app/invalid-credential':
        errorMessage = `The server failed to authenticate with Google's services. This is a local server configuration issue. Please ensure your service account credentials are correctly set up for local development. Common solutions: 1) Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the file path of your service account key. 2) Run 'gcloud auth application-default login' in your terminal. Original error: ${err.message}`;
        break;
      case 'auth/argument-error':
        if (err.message?.includes('Firebase ID token has incorrect "aud"')) {
          errorMessage = `Firebase project mismatch. The server is configured for a different project than the client application. Ensure client and server Firebase configurations match. Details: ${err.message}`;
          errorCode = 'auth/audience-mismatch';
        } else {
          errorMessage = `An internal authentication error occurred: ${err.message}`;
        }
        break;
      default:
        errorMessage = `An unexpected Firebase error occurred: ${err.message} (Code: ${errorCode})`;
    }

    // A final check for private key formatting issues
    if (errorMessage.includes('private_key')) {
        errorMessage = "Server configuration error: The Firebase Admin private key is not configured correctly. If using the FIREBASE_SERVICE_ACCOUNT env var, ensure newline characters are correctly escaped. Details: " + err.message;
        errorCode = 'auth/invalid-private-key';
    }

    return NextResponse.json(
      {
        error: "Auth error",
        errorCode: errorCode,
        details: errorMessage,
      },
      { status: 401 },
    );
  }
}
