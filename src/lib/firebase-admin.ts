
import * as admin from 'firebase-admin';

/**
 * Lazily initializes and returns the Firebase Admin app instance.
 * This prevents initialization during the build process.
 */
function getAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    // This error will be caught at runtime by the API route, preventing a build crash.
    throw new Error('Firebase Admin credentials are not set in environment variables.');
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
  } catch (e) {
    console.error('Firebase admin initialization error', e);
    // This will also be caught at runtime.
    throw new Error('Failed to initialize Firebase Admin SDK.');
  }
}

export { getAdminApp };
