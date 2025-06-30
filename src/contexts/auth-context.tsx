
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Auth } from 'firebase/auth';
import type { Firestore } from "firebase/firestore";
import { Loader2 } from 'lucide-react';
import type { DocumentData } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  subscription: DocumentData | null;
  loading: boolean;
  auth: Auth | null;
  db: Firestore | null;
  authError: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs once on mount to initialize Firebase and set up the auth listener.
    const initFirebase = async () => {
      try {
        const { auth: firebaseAuth, db: firebaseDb } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        
        setAuth(firebaseAuth);
        setDb(firebaseDb);

        // onAuthStateChanged returns its own unsubscribe function.
        const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
          setUser(user);
          // We set loading to false as soon as the auth state is determined.
          // The subscription will be handled by the next effect.
          setLoading(false); 
        });

        // Cleanup function for the auth listener.
        return () => unsubscribeAuth();

      } catch (error) {
        console.error("Firebase initialization error:", error);
        if (error instanceof Error && error.message.includes("Missing Firebase client configuration")) {
            setAuthError(error.message);
        } else {
            setAuthError("Failed to load Firebase services. Check the console for details.");
        }
        setLoading(false);
      }
    };
    initFirebase();
  }, []);

  useEffect(() => {
    // This effect runs whenever the user or db state changes.
    // It's responsible for setting up the subscription listener.
    if (user && db) {
      const { onCurrentUserSubscriptionUpdate } = require('@/lib/stripe');
      const unsubscribeSub = onCurrentUserSubscriptionUpdate(db, user, (snapshot: { subscriptions: DocumentData[] }) => {
        const newSubscription = snapshot.subscriptions[0] || null;
        setSubscription(newSubscription);
      });

      // Cleanup function for the subscription listener.
      return () => unsubscribeSub();
    } else {
      // If there is no user, clear the subscription.
      setSubscription(null);
    }
  }, [user, db]);


  const signOut = async () => {
    if (auth) {
      await auth.signOut();
    }
  };

  const value = { user, subscription, loading, auth, db, authError, signOut };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
