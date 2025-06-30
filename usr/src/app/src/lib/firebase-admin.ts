
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

const ENV_VAR_NAME = 'FIREBASE_SERVICE_ACCOUNT'; // Cloud Run injects the secret here

/**
 * Initialise Firebase Admin exactly once and return the App instance.
 * Priority order:
 * 1. FIREBASE_SERVICE_ACCOUNT – secret JSON content (Cloud Run)
 * 2. GOOGLE_APPLICATION_CREDENTIALS – path to JSON file (local dev)
 * 3. Application Default Credentials (gcloud auth / metadata-server)
 */
export function getAdminApp(): App {
  if (getApps().length) {
    // already initialised
    return getApps()[0];
  }
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // ───── 1) Cloud Run: secret injected as env-var string ─────
  const jsonFromEnv = process.env[ENV_VAR_NAME];
  if (jsonFromEnv) {
    console.log('[firebaseAdmin] Initialising from env var', ENV_VAR_NAME);
    try {
      const credsObject = JSON.parse(jsonFromEnv);
      
      // A common issue with service account JSON in env vars is mangled newlines in the private key.
      // This ensures they are formatted correctly before passing to `cert()`.
      if (!credsObject.private_key) {
        throw new Error("Service account JSON is missing 'private_key' field.");
      }
      credsObject.private_key = credsObject.private_key.replace(/\\n/g, '\n');

      return initializeApp({
        credential: cert(credsObject),
        projectId: projectId || credsObject.project_id, // Prefer client-side project ID
      });
    } catch (err) {
      console.error('[firebaseAdmin] Failed to parse JSON in env var. Ensure it is a valid, single-line JSON string.', err);
      throw new Error(`Failed to initialize Firebase Admin SDK from ${ENV_VAR_NAME}. Check server logs for details.`);
    }
  }

  // ───── 2) Local: GOOGLE_APPLICATION_CREDENTIALS → file path ─────
  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath && fs.existsSync(filePath)) {
    console.log(
      '[firebaseAdmin] Initialising from file in GOOGLE_APPLICATION_CREDENTIALS',
    );
    try {
      const creds = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return initializeApp({
        credential: cert(creds),
        projectId: projectId || creds.project_id, // Prefer client-side project ID
      });
    } catch (err) {
        console.error(`[firebaseAdmin] Failed to parse JSON from file at ${filePath}`, err);
        throw new Error(`Failed to initialize Firebase Admin SDK from ${filePath}.`);
    }
  }

  // ───── 3) Fallback: ADC (metadata server, gcloud auth, etc.) ─────
  console.log('[firebaseAdmin] Attempting to initialise from applicationDefault()');
  try {
      return initializeApp({
        credential: applicationDefault(),
        projectId: projectId, // Explicitly set project ID to match client
      });
  } catch (err) {
      console.error('[firebaseAdmin] Failed to initialize from applicationDefault().', err);
      throw new Error("Firebase Admin SDK initialization failed. No valid credentials found. Please set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.");
  }
}

/**
 * Helper that returns Firebase Auth quickly.
 */
export function getFirebaseAuth() {
  return getAuth(getAdminApp());
}

/**
 * Create a session cookie with configurable retries + exponential back-off.
 */
export async function createSessionCookieWithRetry(
  idToken: string,
  expiresIn: number,
  maxRetries = 3,
) {
  const auth = getFirebaseAuth();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[firebaseAdmin] createSessionCookie attempt ${attempt}/${maxRetries}`,
      );
      return await auth.createSessionCookie(idToken, { expiresIn });
    } catch (err) {
      console.error(
        `[firebaseAdmin] attempt ${attempt} failed:`,
        (err as Error).message,
      );
      if (attempt === maxRetries) throw err;

      // simple exponential back-off up to 10 s
      const wait = Math.min(1000 * 2 ** (attempt - 1), 10_000);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  // This line should be unreachable, but it satisfies TypeScript's need for a return path.
  throw new Error("createSessionCookieWithRetry failed after all retries.");
}
