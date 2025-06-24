'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from "firebase/firestore";
import { Loader2 } from 'lucide-react';
import { onCurrentUserSubscriptionUpdate } from '@/lib/stripe';
import type { DocumentData } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  subscription: DocumentData | null;
  loading: boolean;
  auth: Auth | null;
  db: Firestore | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null);
  const [firebaseDb, setFirebaseDb] = useState<Firestore | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

    if (!isFirebaseConfigured) {
      setConfigError('Firebase configuration is missing. Please ensure NEXT_PUBLIC_FIREBASE variables are set in your .env file.');
      setLoading(false);
      return;
    }

    try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        const auth = getAuth(app);
        const db = getFirestore(app);
        setFirebaseAuth(auth);
        setFirebaseDb(db);

        const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
            setUser(userAuth);
            if (!userAuth) {
                setSubscription(null);
            }
            setLoading(false);
        });

        return () => unsubscribeAuth();
    } catch(e) {
        console.error("Firebase initialization error:", e);
        setConfigError("Could not initialize Firebase. Please check your configuration.");
        setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (!firebaseDb || !user) {
      setSubscription(null);
      return;
    }
    
    const unsubscribeSub = onCurrentUserSubscriptionUpdate(firebaseDb, user, (snapshot) => {
        const newSubscription = snapshot.subscriptions[0] || null;
        setSubscription(newSubscription);
    });

    return () => unsubscribeSub();

  }, [firebaseDb, user]);


  const value = { user, subscription, loading, auth: firebaseAuth, db: firebaseDb };

  if (configError) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4 text-center">
        <p className="text-destructive">{configError}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
