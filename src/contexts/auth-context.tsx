
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
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null);
  const [firebaseDb, setFirebaseDb] = useState<Firestore | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Hardcoded Firebase config to bypass environment variable issues.
    const firebaseConfig = {
      apiKey: "AIzaSyDefxmW4h76fC8-R3sKMIW8ngr4iCt-FNM",
      authDomain: "fir-veilnet.firebaseapp.com",
      projectId: "firebase-veilnet",
      storageBucket: "firebase-veilnet.firebasestorage.app",
      messagingSenderId: "785697647146",
      appId: "1:785697647146:web:ab4c9d90c2e0cd6becb153",
      measurementId: "G-FNJ36PCZFN"
    };
    
    const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

    if (!isFirebaseConfigured) {
      const errorMessage = 'Firebase configuration is missing or incomplete.';
      console.error(errorMessage);
      setAuthError(errorMessage);
      setLoading(false);
      return;
    }

    try {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        const auth = getAuth(app);
        const db = getFirestore(app);
        setFirebaseAuth(auth);
        setFirebaseDb(db);
        setAuthError(null);

        const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
            setUser(userAuth);
            if (!userAuth) {
                setSubscription(null);
            }
            setLoading(false);
        });

        return () => unsubscribeAuth();
    } catch(e: any) {
        const errorMessage = `Firebase initialization error: ${e.message}`;
        console.error(errorMessage, e);
        setAuthError(errorMessage);
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


  const value = { user, subscription, loading, auth: firebaseAuth, db: firebaseDb, authError };
  
  if (loading && !authError) {
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
