'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseInstances } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { onCurrentUserSubscriptionUpdate } from '@/lib/stripe';
import type { DocumentData } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  subscription: DocumentData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSub: (() => void) | undefined;
    
    try {
      const { auth } = getFirebaseInstances();
      const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
        setUser(userAuth);

        if (userAuth) {
          // User is logged in, now we listen for their subscription status
          unsubscribeSub = onCurrentUserSubscriptionUpdate((snapshot) => {
            const newSubscription = snapshot.subscriptions[0] || null;
            setSubscription(newSubscription);
            setLoading(false); // Done loading user and subscription
          });
        } else {
          // No user, so we are done loading.
          setSubscription(null);
          setLoading(false);
        }
      });

      return () => {
        unsubscribeAuth();
        if (unsubscribeSub) {
          unsubscribeSub();
        }
      };
    } catch (error) {
        console.error("Firebase auth could not be initialized.", error);
        setLoading(false);
    }
  }, []);

  const value = { user, subscription, loading };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
