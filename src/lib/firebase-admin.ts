// src/lib/firebase-admin.ts
import 'server-only';
import * as admin from 'firebase-admin';

/**
 * Lazily initializes and returns the Firebase Admin app instance.
 * This prevents initialization during the build process.
 */
function getAdminApp() {
  console.log('getAdminApp called');
  console.log('Existing apps count:', admin.apps.length);

  if (admin.apps.length > 0) {
    console.log('Using existing Firebase Admin app');
    return admin.app();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  
  console.log('Service account JSON exists:', !!serviceAccountJson);
  console.log('Service account JSON length:', serviceAccountJson?.length);

  if (!serviceAccountJson) {
    const error = 'Firebase Admin credentials are not set. Please set the FIREBASE_SERVICE_ACCOUNT_JSON environment variable with the content of your service account file.';
    console.error(error);
    throw new Error(error);
  }

  try {
    console.log('Attempting to parse service account JSON...');
    
    // Log first 100 characters to see the format (without exposing sensitive data)
    console.log('JSON starts with:', serviceAccountJson.substring(0, 100));
    
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    console.log('Successfully parsed service account JSON');
    console.log('Project ID:', serviceAccount.project_id);
    console.log('Client email:', serviceAccount.client_email);
    console.log('Has private key:', !!serviceAccount.private_key);

    // Set network timeout environment variables before initialization
    process.env.GOOGLE_APPLICATION_CREDENTIALS_TIMEOUT = '30000'; // 30 seconds
    process.env.GCLOUD_PROJECT = serviceAccount.project_id;

    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // You can add these optional timeout settings
      httpTimeout: 30000, // 30 seconds
    });

    console.log('Firebase Admin app initialized successfully');
    return app;

  } catch (e: any) {
    console.error('Firebase admin initialization error:', e);
    console.error('Error message:', e.message);
    console.error('Error stack:', e.stack);
    
    if (e instanceof SyntaxError) {
      console.error('JSON Parse Error - the service account JSON is malformed');
      // Show a bit more context for JSON errors
      console.error('Problematic JSON section:', serviceAccountJson?.substring(0, 200));
    }
    
    throw new Error(`Failed to initialize Firebase Admin SDK. Check if FIREBASE_SERVICE_ACCOUNT_JSON is a valid JSON. Error: ${e.message}`);
  }
}

/**
 * Helper function to create session cookie with retry logic
 */
async function createSessionCookieWithRetry(idToken: string, expiresIn: number, maxRetries = 3) {
  const auth = admin.auth(getAdminApp());
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to create session cookie (attempt ${attempt}/${maxRetries})`);
      
      const sessionCookie = await auth.createSessionCookie(idToken, { 
        expiresIn,
        // Add explicit timeout for this operation
      });
      
      console.log('Session cookie created successfully');
      return sessionCookie;
      
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('All retry attempts failed');
        throw error;
      }
      
      // Exponential backoff: wait longer between retries
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

export { getAdminApp, createSessionCookieWithRetry };
