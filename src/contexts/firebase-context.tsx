
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [firebaseInstances, setFirebaseInstances] = useState<FirebaseContextType>({
    app: null,
    auth: null,
  });

  useEffect(() => {
    // Define and check config *inside* useEffect to ensure it only runs on the client
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

    if (isFirebaseConfigured) {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      setFirebaseInstances({ app, auth });
    } else {
      console.error('Firebase is not configured. Please check your environment variables.');
    }
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseInstances}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
