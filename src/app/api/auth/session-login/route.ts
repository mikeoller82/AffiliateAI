import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Global flag to track initialization status
let firebaseInitialized = false;
let firebaseInitError: Error | null = null;

// Initialize Firebase Admin synchronously at module load
console.log('🚀 Starting Firebase Admin initialization...');
console.log('NODE_ENV:', process.env.NODE_ENV);

try {
  // Check if already initialized (in case of module reloading)
  if (admin.apps.length > 0) {
    console.log('✅ Firebase Admin already initialized');
    firebaseInitialized = true;
  } else {
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
      
      // Log first 100 chars to debug format issues
      console.log('FIREBASE_CONFIG preview:', process.env.FIREBASE_CONFIG.substring(0, 100) + '...');
      
      try {
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
        console.error('Raw FIREBASE_CONFIG length:', process.env.FIREBASE_CONFIG.length);
        console.error('First 200 chars:', process.env.FIREBASE_CONFIG.substring(0, 200));
        throw new Error(`FIREBASE_CONFIG JSON parse failed: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }
    } else {
      console.error('❌ FIREBASE_CONFIG environment variable not found');
      console.log('All env vars containing FIREBASE:', Object.keys(process.env).filter(key => key.includes('FIREBASE')));
      console.log('Total env vars count:', Object.keys(process.env).length);
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
    console.log('Project ID:', serviceAccount.project_id);
    console.log('Client Email:', serviceAccount.client_email ? serviceAccount.client_email.substring(0, 20) + '...' : 'missing');
    console.log('Private Key length:', serviceAccount.private_key ? serviceAccount.private_key.length : 0);
    
    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      projectId: serviceAccount.project_id,
    });
    
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized successfully!');
    console.log('✅ Admin apps count:', admin.apps.length);
  }
} catch (error) {
  firebaseInitError = error instanceof Error ? error : new Error(String(error));
  console.error('❌ CRITICAL: Firebase Admin initialization failed:', firebaseInitError);
  console.error('Error details:', {
    message: firebaseInitError.message,
    stack: firebaseInitError.stack
  });
  
  // Don't throw here - let the API handle the error gracefully
  console.error('🚨 Firebase initialization failed at module load - API will return errors');
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



    const { idToken } = body;

    if (!idToken) {
      console.error('No ID token provided');
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Check Firebase initialization status
    if (!firebaseInitialized || firebaseInitError) {
      console.error('❌ Firebase Admin not properly initialized');
      console.error('Initialized:', firebaseInitialized);
      console.error('Init Error:', firebaseInitError?.message);
      console.error('Admin apps count:', admin.apps.length);
      
      return NextResponse.json({ 
        error: 'Firebase initialization failed',
        details: firebaseInitError ? firebaseInitError.message : 'Firebase Admin SDK failed to initialize',
        debug: {
          initialized: firebaseInitialized,
          appsCount: admin.apps.length,
          hasError: !!firebaseInitError,
          nodeEnv: process.env.NODE_ENV,
          hasFirebaseConfig: !!process.env.FIREBASE_CONFIG
        },
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
