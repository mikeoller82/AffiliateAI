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
    const initFirebase = async () => {
      try {
        const { auth: firebaseAuth, db: firebaseDb } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        const { onCurrentUserSubscriptionUpdate } = await import('@/lib/stripe');

        setAuth(firebaseAuth);
        setDb(firebaseDb);

        const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (userAuth) => {
          setUser(userAuth);
          if (userAuth && firebaseDb) {
            const unsubscribeSub = onCurrentUserSubscriptionUpdate(firebaseDb, userAuth, (snapshot) => {
              const newSubscription = snapshot.subscriptions[0] || null;
              setSubscription(newSubscription);
            });
            // This is a simplified approach; in a real app, you'd manage this unsubscribe more carefully.
          } else {
            setSubscription(null);
          }
          setLoading(false);
        });

        return () => unsubscribeAuth();
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setAuthError("Failed to load Firebase services.");
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  const value = { user, subscription, loading, auth, db, authError };

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
