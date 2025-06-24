
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseInstances } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        // getFirebaseInstances will throw an error if not configured, which we catch.
        const { auth } = getFirebaseInstances();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        // Unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    } catch (error) {
        // This will catch the "Firebase is not configured" error
        console.error("Firebase auth error in AuthProvider:", error);
        setLoading(false); // Stop loading, as we know auth state can't be determined
    }
  }, []);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
        {loading ? (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
            children
        )}
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
