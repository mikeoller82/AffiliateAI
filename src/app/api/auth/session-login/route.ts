
import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp, createSessionCookieWithRetry } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: NextRequest) {
  console.log('=== Session Login API Called ===');
  
  let adminApp;
  try {
    adminApp = getAdminApp();
    console.log('✅ Firebase Admin app obtained successfully.');
  } catch (initError: any) {
    console.error('❌ CRITICAL: Firebase Admin initialization failed via getAdminApp:', initError.message);
    // Pass the specific error from getAdminApp to the client
    return NextResponse.json({ 
      error: `Server Configuration Error: ${initError.message}`,
      details: initError.message,
    }, { status: 500 });
  }

  try {
    const auth = getAuth(adminApp);
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { idToken } = body;
    if (!idToken) {
      console.error('No ID token provided');
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    let decodedToken;
    try {
      console.log('Verifying ID token...');
      decodedToken = await auth.verifyIdToken(idToken);
      console.log('✅ ID token verified for user:', decodedToken.uid);
    } catch (verifyError: any) {
      console.error('❌ Token verification failed:', verifyError);
      
      let userMessage = 'Authentication failed. Please try again.';
      // Check if the error code indicates a project mismatch
      if (verifyError.code === 'auth/argument-error' && verifyError.message.includes('mismatch')) {
          userMessage = 'Authentication failed: ID token project ID does not match the Admin SDK. Please ensure your client and server Firebase configurations are for the same project.';
      } else {
        const errorMap: Record<string, string> = {
            'auth/id-token-expired': 'Your session has expired. Please sign in again.',
            'auth/id-token-revoked': 'Your session has been revoked. Please sign in again.',
            'auth/invalid-id-token': 'Invalid authentication token. Please sign in again.',
            'auth/project-not-found': 'Firebase project configuration error.',
          };
          userMessage = errorMap[verifyError.code] || userMessage;
      }
      return NextResponse.json({ error: userMessage, code: verifyError.code }, { status: 401 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await createSessionCookieWithRetry(idToken, expiresIn);
      
    const response = NextResponse.json({ 
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        emailVerified: decodedToken.email_verified || false
      }
    });

    response.cookies.set({
      name: '__session',
      value: sessionCookie,
      maxAge: Math.floor(expiresIn / 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    console.log('✅ Session login completed successfully for user:', decodedToken.uid);
    return response;

  } catch (error: any) {
    console.error('❌ Unexpected error in session login:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.'
    }, { status: 500 });
  }
}
