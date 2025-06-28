import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import * as fs from 'fs';
import 'server-only';

// This is the path where Cloud Run will mount the secret file
const SERVICE_ACCOUNT_PATH = '/etc/secrets/firebase-service-account';

// This function will handle the initialization and is only called if needed.
function createAdminApp(): App {
  // Check if the secret file exists
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    // Fallback for local development using environment variables
    const serviceAccountString = process.env.FIREBASE_CONFIG;
    if (serviceAccountString) {
      try {
        const serviceAccount = JSON.parse(serviceAccountString);
        // Replace escaped newlines for local dev
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/
/g, '
');
        }
        return initializeApp({ credential: cert(serviceAccount) });
      } catch (error: any) {
        console.error("Firebase Admin SDK initialization from ENV_VAR failed:", error);
        throw new Error("Failed to initialize Firebase Admin SDK from environment variable.");
      }
    }
    // If neither the file nor the env var is present, throw a clear error.
    throw new Error(
      `Firebase Admin SDK initialization failed. Secret file not found at ${SERVICE_ACCOUNT_PATH} and FIREBASE_CONFIG env var is not set.`
    );
  }

  // Production: Initialize using the secret file
  try {
    return initializeApp({
      credential: cert(SERVICE_ACCOUNT_PATH),
    });
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization from file failed:", error);
    throw new Error(
      `Server configuration error: Could not initialize Firebase Admin SDK from ${SERVICE_ACCOUNT_PATH}. ` +
      `Original error: ${error.message}`
    );
  }
}

// This function ensures we only initialize the app once.
function getAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    return apps[0];
  }
  return createAdminApp();
}

export { getAdminApp };
