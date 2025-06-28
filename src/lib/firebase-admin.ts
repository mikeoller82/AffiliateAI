
import 'server-only';
import { initializeApp, getApps, App } from 'firebase-admin/app';

/**
 * Lazily initializes and returns the Firebase Admin app instance.
 * This version relies on the Firebase Admin SDK's ability to automatically
 * discover credentials from the environment, which is the recommended approach
 * for Google Cloud environments like Cloud Run.
 */
function getAdminApp(): App {
  // If the app is already initialized, return the existing instance.
  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    return apps[0];
  }

  // The SDK will automatically look for credentials in the following order:
  // 1. The FIREBASE_CONFIG environment variable.
  // 2. The GOOGLE_APPLICATION_CREDENTIALS environment variable.
  // 3. The default service account of the Google Cloud environment (e.g., Cloud Run).
  // Since Cloud Build sets FIREBASE_CONFIG from Secret Manager, this will be found automatically.
  try {
    const app = initializeApp();
    return app;
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization failed:", error);
    // Provide a more helpful error message for developers.
    throw new Error(
      "Server configuration error: Could not initialize Firebase Admin SDK. " +
      "Ensure your service account credentials (e.g., FIREBASE_CONFIG) are set up correctly in your server environment. " +
      `Original error: ${error.message}`
    );
  }
}

export { getAdminApp };
