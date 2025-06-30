
'server-only';
import fs from 'fs';
import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
  App,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const ENV_VAR_NAME = 'FIREBASE_SERVICE_ACCOUNT';

/**
 * Initializes Firebase Admin SDK for server-side operations.
 * 
 * This function handles credentials in a specific order, crucial for both
 * local development and production deployment on Google Cloud.
 *
 * Priority Order:
 * 1. FIREBASE_SERVICE_ACCOUNT (Environment Variable): 
 *    - Used in deployed environments like Cloud Run.
 *    - The service account JSON key is stored as a secret and injected as an environment variable.
 * 
 * 2. GOOGLE_APPLICATION_CREDENTIALS (Environment Variable):
 *    - **This is the recommended method for local development.**
 *    - Steps:
 *        a. Download your service account JSON file from the Google Cloud Console.
 *        b. Save it somewhere safe on your local machine (e.g., `~/.config/gcloud/my-service-account.json`).
 *        c. Set the environment variable in your terminal:
 *           `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-file.json"`
 *        d. Now, when you run `npm run dev`, the SDK will find and use these credentials.
 * 
 * 3. Application Default Credentials (ADC):
 *    - A fallback method, often used in local development.
 *    - If the above variables are not set, the SDK will look for credentials created by the gcloud CLI.
 *    - To set this up, run the following command in your terminal and follow the prompts:
 *      `gcloud auth application-default login`
 *
 * If none of these methods succeed, this function will throw an error, as the server cannot securely
 * communicate with Firebase services without proper authentication.
 */
export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // 1. Production: Cloud Run secret injected as env-var string
  const jsonFromEnv = process.env[ENV_VAR_NAME];
  if (jsonFromEnv) {
    console.log('[firebaseAdmin] Attempting to initialize from env var', ENV_VAR_NAME);
    try {
      const credsObject = JSON.parse(jsonFromEnv);
      if (!credsObject.private_key) {
        throw new Error("Service account JSON from env var is missing 'private_key' field.");
      }
      credsObject.private_key = credsObject.private_key.replace(/\\n/g, '\n');
      console.log('[firebaseAdmin] Successfully parsed env var. Initializing app...');
      return initializeApp({
        credential: cert(credsObject),
        projectId: projectId || credsObject.project_id,
      });
    } catch (err) {
      console.error('[firebaseAdmin] Failed to parse JSON in env var.', err);
      throw new Error(`Failed to initialize Firebase Admin from ${ENV_VAR_NAME}. Check the JSON format.`);
    }
  }

  // 2. Local Development: GOOGLE_APPLICATION_CREDENTIALS file path
  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath) {
    console.log('[firebaseAdmin] Attempting to initialize from file path in GOOGLE_APPLICATION_CREDENTIALS:', filePath);
    if (fs.existsSync(filePath)) {
        try {
            const creds = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log('[firebaseAdmin] Successfully parsed file. Initializing app...');
            return initializeApp({
                credential: cert(creds),
                projectId: projectId || creds.project_id,
            });
        } catch (err) {
            console.error(`[firebaseAdmin] Failed to parse JSON from file at ${filePath}`, err);
            throw new Error(`Failed to initialize Firebase Admin from ${filePath}. Check file content.`);
        }
    } else {
        console.warn(`[firebaseAdmin] GOOGLE_APPLICATION_CREDENTIALS was set, but file does not exist at: ${filePath}. Falling back...`);
    }
  }

  // 3. Fallback for Local Development or GCE: Application Default Credentials
  console.log('[firebaseAdmin] Attempting to initialize from applicationDefault(). This is the last resort.');
  try {
      const app = initializeApp({
        credential: applicationDefault(),
        projectId: projectId,
      });
      console.log('[firebaseAdmin] Successfully initialized from applicationDefault().');
      return app;
  } catch (err) {
      console.error('[firebaseAdmin] CRITICAL: All credential methods failed. Could not initialize Firebase Admin SDK.', err);
      throw new Error("Firebase Admin SDK initialization failed. No valid credentials found. For local development, set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of your service account key file, or run 'gcloud auth application-default login'.");
  }
}


export function getFirebaseAuth() {
  return getAuth(getAdminApp());
}

export async function createSessionCookieWithRetry(
  idToken: string,
  expiresIn: number,
  maxRetries = 3,
) {
  const auth = getFirebaseAuth();
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await auth.createSessionCookie(idToken, { expiresIn });
    } catch (err) {
      console.error(
        `[firebaseAdmin] createSessionCookie attempt ${attempt} failed:`,
        (err as Error).message,
      );
      if (attempt === maxRetries) throw err;
      const wait = Math.min(1000 * 2 ** (attempt - 1), 10_000);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw new Error("createSessionCookieWithRetry failed after all retries.");
}
