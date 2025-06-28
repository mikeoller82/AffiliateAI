import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import type { ServiceAccount } from 'firebase-admin/app';
import 'server-only';

// This function will handle the initialization and is only called if needed.
function createAdminApp(): App {
  const serviceAccountString = process.env.FIREBASE_CONFIG;
  
  if (!serviceAccountString) {
    throw new Error(
      "The FIREBASE_CONFIG environment variable is not set. This is required for server-side Firebase operations."
    );
  }

  try {
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);

    // This is the crucial part: environment variables often store newlines as "\\n".
    // We need to replace them with actual newlines for the PEM key parser to work.
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    return initializeApp({
      credential: cert(serviceAccount),
    });

  } catch (error: any) {
    console.error("Firebase Admin SDK initialization failed:", error);
    // Provide a more helpful error message for developers.
    if (error.message.includes('Failed to parse private key')) {
      throw new Error(
        "Server configuration error: Failed to parse the Firebase private key. " +
        "Ensure the private key in your FIREBASE_CONFIG environment variable is formatted correctly, including newlines."
      );
    }
    throw new Error(
      "Server configuration error: Could not initialize Firebase Admin SDK. " +
      "Please check your FIREBASE_CONFIG environment variable. " +
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
