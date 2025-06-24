import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if all required environment variables are set
export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

let app: FirebaseApp;
let auth: Auth;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Initialize Analytics only on the client side where it is supported
  if (typeof window !== 'undefined') {
      isSupported().then(supported => {
          if (supported) {
              getAnalytics(app);
          }
      });
  }
} else {
  console.warn(
    'Firebase configuration is incomplete. Firebase features will be disabled. ' +
    'Ensure all NEXT_PUBLIC_FIREBASE_ environment variables are set in your deployment environment.'
  );
  // Provide mock/dummy objects to prevent crashes during build
  app = {} as FirebaseApp;
  auth = {} as Auth;
}

export { app, auth };
