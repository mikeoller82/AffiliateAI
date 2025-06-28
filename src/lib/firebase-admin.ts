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

  // ───── 1) Cloud Run: secret injected as env-var string ─────
  const jsonFromEnv = process.env[ENV_VAR_NAME];
  if (jsonFromEnv) {
    console.log('[firebaseAdmin] Initialising from env var', ENV_VAR_NAME);
    try {
      const creds = JSON.parse(jsonFromEnv);
      return initializeApp({
        credential: cert(creds),
        projectId: creds.project_id,
      });
    } catch (err) {
      console.error('[firebaseAdmin] Failed to parse JSON in env var', err);
      throw err;
    }
  }

  // ───── 2) Local: GOOGLE_APPLICATION_CREDENTIALS → file path ─────
  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath && fs.existsSync(filePath)) {
    console.log(
      '[firebaseAdmin] Initialising from file in GOOGLE_APPLICATION_CREDENTIALS',
    );
    const creds = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return initializeApp({
      credential: cert(creds),
      projectId: creds.project_id,
    });
  }

  // ───── 3) Fallback: ADC (metadata server, gcloud auth, etc.) ─────
  console.log('[firebaseAdmin] Initialising from applicationDefault()');
  return initializeApp({
    credential: applicationDefault(),
  });
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
}
