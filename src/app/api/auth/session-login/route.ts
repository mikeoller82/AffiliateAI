// src/app/api/auth/session-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    console.log('✅ Firebase Admin already initialized');
    return true;
  }

  try {
    console.log('🚀 Initializing Firebase Admin...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Always log these in production to debug the issue
    console.log('Environment check:', {
      FIREBASE_CONFIG_exists: !!process.env.FIREBASE_CONFIG,
      FIREBASE_CONFIG_length: process.env.FIREBASE_CONFIG?.length || 0,
      NODE_ENV: process.env.NODE_ENV
    });

    let serviceAccount;
    
    // Primary: Use FIREBASE_CONFIG secret from Cloud Build/Secret Manager
    if (process.env.FIREBASE_CONFIG) {
      console.log('📝 Attempting to parse FIREBASE_CONFIG...');
      try {
        // Log first 100 chars to debug format issues
        console.log('FIREBASE_CONFIG preview:', process.env.FIREBASE_CONFIG.substring(0, 100) + '...');
        
        serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
        console.log('✅ Firebase config parsed successfully');
        console.log('Config fields present:', {
          project_id: !!serviceAccount.project_id,
          client_email: !!serviceAccount.client_email,
          private_key: !!serviceAccount.private_key,
          type: serviceAccount.type
        });
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('Raw FIREBASE_CONFIG:', process.env.FIREBASE_CONFIG);
        throw new Error(`FIREBASE_CONFIG JSON parse failed: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }
    } else {
      console.error('❌ FIREBASE_CONFIG environment variable not found');
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('FIREBASE')));
      throw new Error('FIREBASE_CONFIG environment variable is missing. Check Cloud Run secret configuration.');
    }

    // Validate required fields
    const requiredFields = ['project_id', 'client_email', 'private_key'];
    const missingFields = requiredFields.filter(field => !serviceAccount[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      console.error('Available fields:', Object.keys(serviceAccount));
      throw new Error(`Missing Firebase config fields: ${missingFields.join(', ')}`);
    }
    
    console.log('📋 Initializing Firebase Admin with credentials...');
    
    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      projectId: serviceAccount.project_id,
    });
    
    console.log('✅ Firebase Admin initialized successfully!');
    console.log('Project ID:', serviceAccount.project_id);
    
    return true;
  } catch (error) {
    console.error('❌ CRITICAL: Firebase Admin initialization failed:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    // Don't swallow the error - let it propagate
    throw error;
  }
}

// Initialize Firebase Admin
try {
  initializeFirebaseAdmin();
} catch (initError) {
  console.error('🚨 Firebase initialization failed at module load:', initError);
  // Store the error to show in API responses
  (global as any).firebaseInitError = initError;
}

export async function POST(request: NextRequest) {
  console.log('=== Session Login API Called ===');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 400 });
    }

    // Development bypass (REMOVE IN PRODUCTION)
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      console.log('🚧 DEVELOPMENT MODE: Bypassing token verification');
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
      console.error('❌ Firebase Admin not initialized - no apps found');
      
      // Check if there was an initialization error stored
      const initError = (global as any).firebaseInitError;
      if (initError) {
        console.error('❌ Stored initialization error:', initError.message);
        return NextResponse.json({ 
          error: 'Firebase initialization failed',
          details: `Configuration error: ${initError.message}`,
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: 'Firebase not initialized',
        details: 'Firebase Admin SDK is not initialized. Check server logs for configuration errors.',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('✅ Firebase Admin is properly initialized');

    // Verify the ID token with enhanced error handling
    let decodedToken;
    try {
      console.log('Verifying ID token...');
      
      // Create a timeout promise for token verification
      const TIMEOUT_MS = 10000; // 10 seconds
      const verifyPromise = admin.auth().verifyIdToken(idToken);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Token verification timeout')), TIMEOUT_MS)
      );
      
      decodedToken = await Promise.race([verifyPromise, timeoutPromise]);
      console.log('✅ ID token verified for user:', decodedToken.uid);
    } catch (verifyError: any) {
      console.error('❌ Token verification failed:', verifyError.message || verifyError);
      
      // Handle specific error types
      if (verifyError.message?.includes('timeout')) {
        return NextResponse.json({ 
          error: 'Request timeout',
          details: 'Token verification timed out. Please try again.'
        }, { status: 408 });
      }
      
      // Firebase Auth specific errors
      if (verifyError.code) {
        const errorMap: Record<string, string> = {
          'auth/id-token-expired': 'Your session has expired. Please sign in again.',
          'auth/id-token-revoked': 'Your session has been revoked. Please sign in again.',
          'auth/invalid-id-token': 'Invalid authentication token. Please sign in again.',
          'auth/project-not-found': 'Firebase project configuration error.',
        };
        
        const userMessage = errorMap[verifyError.code] || 'Authentication failed. Please try again.';
        
        return NextResponse.json({ 
          error: userMessage,
          code: verifyError.code
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: 'Authentication failed',
        details: 'Please sign in again.'
      }, { status: 401 });
    }

    // Create session cookie
    try {
      console.log('Creating session cookie...');
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
      const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
      
      const response = NextResponse.json({ 
        success: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email || null,
          emailVerified: decodedToken.email_verified || false
        }
      });

      // Set secure session cookie
      response.cookies.set({
        name: '__session',
        value: sessionCookie,
        maxAge: Math.floor(expiresIn / 1000), // Convert to seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax',
        path: '/'
      });

      console.log('✅ Session login completed successfully for user:', decodedToken.uid);
      return response;

    } catch (sessionError: any) {
      console.error('❌ Failed to create session cookie:', sessionError);
      return NextResponse.json({ 
        error: 'Session creation failed',
        details: 'Unable to create secure session. Please try again.'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Unexpected error in session login:', error);
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' 
        ? error.message || 'An unexpected error occurred'
        : 'An unexpected error occurred. Please try again.'
    }, { status: 500 });
  }
}