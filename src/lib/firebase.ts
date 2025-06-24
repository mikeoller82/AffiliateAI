
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Add a check to ensure the variables are loaded, especially for deployment environments.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    const errorMessage = "Firebase configuration is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY and other environment variables are set in your deployment environment.";
    console.error(errorMessage);
    // We throw an error to fail the build loudly, which is better than a cryptic error later.
    throw new Error(errorMessage);
}


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
