import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// This object will hold the initialized instances to implement a singleton pattern
let firebaseInstances: { app: FirebaseApp, auth: Auth } | null = null;

/**
 * Gets the initialized Firebase app and auth instances.
 * This function implements a lazy singleton pattern to ensure Firebase is only initialized once,
 * and only when it's actually needed. This is the correct way to handle Firebase in Next.js
 * to avoid server-side/client-side mismatches and configuration errors.
 * 
 * @returns An object containing the Firebase app and auth instances.
 * @throws {Error} If Firebase is not configured with the necessary environment variables.
 */
export function getFirebaseInstances(): { app: FirebaseApp, auth: Auth } {
    // If we've already initialized, return the cached instances
    if (firebaseInstances) {
        return firebaseInstances;
    }

    // Read the configuration from environment variables
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    // Check if the essential configuration values are present
    const isConfigured = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;

    if (!isConfigured) {
        // Throw a clear error if the configuration is missing. This will be caught by our calling code.
        throw new Error("Firebase is not configured. Please check your NEXT_PUBLIC_ environment variables.");
    }
    
    // Initialize the app, or get the existing one if it's already been initialized elsewhere.
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);

    // Cache the instances for future calls
    firebaseInstances = { app, auth };
    
    return firebaseInstances;
}
