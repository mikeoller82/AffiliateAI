// src/app/api/auth/session-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = require('../../../../../serviceAccountKey.json');
    
<<<<<<< HEAD
    // Alternative initialization with explicit configuration
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      projectId: serviceAccount.project_id,
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export async function POST(request: NextRequest) {
  console.log('=== Session Login API Called ===');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed successfully:', { hasIdToken: !!body.idToken });
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 400 });
    }
    // TEMPORARY - REMOVE IN PRODUCTION
      if (process.env.NODE_ENV === 'development') {
        console.log('DEVELOPMENT MODE: Skipping token verification');
        const response = NextResponse.json({ 
          success: true,
          user: { uid: 'dev-user', email: 'dev@example.com' }
        });
        
        response.cookies.set({
          name: '__session',
          value: 'dev-session',
          maxAge: 60 * 60 * 24 * 5,
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/'
        });
        
        return response;
}
    const { idToken } = body;

    if (!idToken) {
      console.error('No ID token provided');
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Check if Firebase Admin is initialized
    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized');
      return NextResponse.json({ 
        error: 'Firebase Admin not initialized',
        details: 'Please check serviceAccountKey.json file'
      }, { status: 500 });
    }

    // Try to verify the ID token with timeout
    let decodedToken;
    try {
      console.log('Verifying ID token...');
      
      // Add a timeout wrapper for the verification
      const verifyWithTimeout = Promise.race([
        admin.auth().verifyIdToken(idToken),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Token verification timeout')), 15000)
        )
      ]);
      
      decodedToken = await verifyWithTimeout;
      console.log('ID token verified for user:', decodedToken.uid);
    } catch (verifyError) {
      console.error('Failed to verify ID token:', verifyError);
      
      // Handle specific timeout errors
      if (verifyError.message?.includes('timeout') || 
          verifyError.code === 'ERR_SOCKET_CONNECTION_TIMEOUT') {
        return NextResponse.json({ 
          error: 'Network timeout while verifying token',
          details: 'Please check your internet connection and try again'
        }, { status: 408 }); // 408 Request Timeout
      }
      
      return NextResponse.json({ 
        error: 'Invalid ID token',
        details: verifyError instanceof Error ? verifyError.message : 'Token verification failed'
      }, { status: 401 });
    }

    // Try to create session cookie
    try {
      console.log('Creating session cookie...');
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
      console.log('Session cookie created successfully');

      const response = NextResponse.json({ 
        success: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email
        }
      });

      response.cookies.set({
        name: '__session',
        value: sessionCookie,
        maxAge: expiresIn / 1000, // Convert to seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      console.log('Session login completed successfully');
      return response;

    } catch (sessionError) {
      console.error('Failed to create session cookie:', sessionError);
      return NextResponse.json({ 
        error: 'Failed to create session',
        details: sessionError instanceof Error ? sessionError.message : 'Session creation failed'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Unexpected error in session login:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'An unexpected error occurred',
      type: error.constructor.name
    }, { status: 500 });
=======
    return response;
  } catch (error: any) {
    console.error('Error creating session cookie:', error);
    if(error.code) {
        console.error('Firebase Auth Error Code:', error.code);
    }
    
    if (error instanceof Error && error.message.includes('Firebase Admin credentials')) {
        return NextResponse.json({ error: 'Server configuration error: Firebase Admin credentials are not set in environment variables.' }, { status: 500 });
    }
    
    const detailedError = error.code === 'auth/invalid-id-token'
        ? 'The ID token is invalid. This can happen if the client and server Firebase projects do not match.'
        : 'An unexpected error occurred while creating the session.';

    return NextResponse.json({ error: 'Failed to create session', details: detailedError }, { status: 401 });
>>>>>>> 69ed3b157b9be397f38124cd21b9c0bb93353a44
  }
}
