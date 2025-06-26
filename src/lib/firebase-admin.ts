
import 'server-only';
import * as admin from 'firebase-admin';

/**
 * Lazily initializes and returns the Firebase Admin app instance.
 * This prevents initialization during the build process.
 */
function getAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error('Firebase Admin credentials are not set. Please set the FIREBASE_SERVICE_ACCOUNT_JSON environment variable with the content of your service account file.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
    });
  } catch (e: any) {
    console.error('Firebase admin initialization error:', e.message);
    throw new Error(`Failed to initialize Firebase Admin SDK. Check if FIREBASE_SERVICE_ACCOUNT_JSON is a valid JSON. Error: ${e.message}`);
  }
}

export { getAdminApp };
