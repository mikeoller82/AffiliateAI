
import 'server-only';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';

/**
 * Lazily initializes and returns the Firebase Admin app instance.
 * This function is designed to be simple and throw specific errors if initialization fails.
 * The calling function is responsible for catching and handling these errors.
 */
function getAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    return apps[0];
  }

  // Use FIREBASE_CONFIG, which is set by Cloud Build from Secret Manager.
  const serviceAccountJson = process.env.FIREBASE_CONFIG;
  if (!serviceAccountJson) {
    throw new Error('Server configuration error: The FIREBASE_CONFIG environment variable is not set. This should be configured in your deployment environment (e.g., Cloud Run secrets).');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (e) {
    throw new Error('Server configuration error: Failed to parse FIREBASE_CONFIG. Please ensure it is a valid JSON object.');
  }

  // Auto-correct the private key newlines, which is a common issue with .env files.
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  try {
    const app = initializeApp({
      credential: cert(serviceAccount),
    });
    return app;
  } catch (error: any) {
    // Catch initialization errors from firebase-admin itself
     throw new Error(`Server configuration error: Failed to initialize Firebase Admin SDK. ${error.message}`);
  }
}

export { getAdminApp };
