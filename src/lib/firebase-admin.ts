// src/lib/firebase-admin.ts
import 'server-only';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';

/**
 * Lazily initializes and returns the Firebase Admin app instance.
 * This pattern is more resilient to hot-reloading in development.
 */
function getAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    return apps[0];
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  
  if (!serviceAccountJson) {
    const error = 'Firebase Admin credentials are not set. Please set the FIREBASE_SERVICE_ACCOUNT_JSON environment variable with the content of your service account file. This is a server-side environment variable and should not be prefixed with NEXT_PUBLIC_.';
    console.error(error);
    throw new Error(error);
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error('The FIREBASE_SERVICE_ACCOUNT_JSON is missing required fields (project_id, client_email, private_key). Please ensure you are using a valid service account key file from the Google Cloud Console, not the client-side web configuration object.');
    }
    
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    console.log('Initializing new Firebase Admin app for project:', serviceAccount.project_id);
    
    const app = initializeApp({
      credential: cert(serviceAccount),
    });

    return app;

  } catch (e: any) {
    console.error('Firebase admin initialization error:', e);
    let errorMessage = `Failed to initialize Firebase Admin SDK. Error: ${e.message}`;
    if (e.message?.includes('Invalid PEM formatted message')) {
        errorMessage = 'Failed to initialize Firebase Admin SDK. The private_key in your FIREBASE_SERVICE_ACCOUNT_JSON is invalid. Please ensure it is copied correctly, including the -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY----- lines.'
    } else if (e instanceof SyntaxError) {
      errorMessage = 'The value of FIREBASE_SERVICE_ACCOUNT_JSON is not a valid JSON object. Please ensure the entire service account key file content is correctly copied into the environment variable.';
    } else if (e.message?.includes("'credential' must be an object")) {
      errorMessage = "The parsed service account is not a valid object. Check the JSON structure."
    }
    throw new Error(errorMessage);
  }
}

async function createSessionCookieWithRetry(idToken: string, expiresIn: number, maxRetries = 3): Promise<string> {
  // Dynamically import getAuth to ensure it's only loaded on the server
  const { getAuth } = await import('firebase-admin/auth');
  const auth = getAuth(getAdminApp());
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to create session cookie (attempt ${attempt}/${maxRetries})`);
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      console.log('Session cookie created successfully');
      return sessionCookie;
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error('All retry attempts failed');
        throw error;
      }
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  // This line should be unreachable if maxRetries > 0
  throw new Error('Failed to create session cookie after multiple retries.');
}

export { getAdminApp, createSessionCookieWithRetry };
