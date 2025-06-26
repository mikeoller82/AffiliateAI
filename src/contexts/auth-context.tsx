'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, type User, type Auth } from 'firebase/auth';
import { type Firestore } from "firebase/firestore";
import { auth, db } from '@/lib/firebase'; // Import the correctly configured instances
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
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth || !db) {
        const errorMessage = 'Firebase configuration is missing or invalid. Check your environment variables.';
        console.error(errorMessage);
        setAuthError(errorMessage);
        setLoading(false);
        return;
    }
    
    setAuthError(null);
    const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
        setUser(userAuth);
        if (!userAuth) {
            setSubscription(null);
        }
        setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);
  
  useEffect(() => {
    if (!db || !user) {
      setSubscription(null);
      return;
    }
    
    const unsubscribeSub = onCurrentUserSubscriptionUpdate(db, user, (snapshot) => {
        const newSubscription = snapshot.subscriptions[0] || null;
        setSubscription(newSubscription);
    });

    return () => unsubscribeSub();

  }, [user]);

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
