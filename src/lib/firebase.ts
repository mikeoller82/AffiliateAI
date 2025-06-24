import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

let app: FirebaseApp;
let auth: Auth;

// This function initializes and returns the Firebase instances,
// creating them only if they haven't been created yet.
export function getFirebaseInstances() {
  if (auth) {
    return { app, auth };
  }

  // Ensure this code only runs in the browser
  if (typeof window === "undefined") {
    throw new Error("Firebase can only be initialized in the browser.");
  }
  
  const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };

  const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

  if (!isFirebaseConfigured) {
    throw new Error('Firebase configuration is missing. Ensure NEXT_PUBLIC_FIREBASE variables are set.');
  }

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);

  return { app, auth };
}
