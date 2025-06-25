
import * as admin from 'firebase-admin';

// The service account key needs to be set as environment variables.
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Initialize the app only if it's not already initialized AND all credentials are provided.
// This prevents crashing during the build process if environment variables are missing.
if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
    } catch (e) {
      console.error('Firebase admin initialization error', e);
    }
  } else {
    // During build, these variables might be missing. We log a warning but don't crash.
    // At runtime, if an API route that needs admin is called, it will fail gracefully.
    console.log('Firebase Admin not initialized. Missing environment variables.');
  }
}

// Export the admin app instance. It might be undefined if initialization failed.
// Routes using this must handle the case where it is undefined.
export const adminApp = admin.apps.length > 0 ? admin.app() : undefined;
