
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { ApiKeyDialog } from '@/components/ai/api-key-dialog';

interface AIKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  promptApiKey: () => void;
}

const AIKeyContext = createContext<AIKeyContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = 'highlaunchpad-gemini-api-key';

export function AIKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey) {
        setApiKeyState(storedKey);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const setApiKey = useCallback((key: string | null) => {
    setApiKeyState(key);
    try {
        if (key) {
            localStorage.setItem(API_KEY_STORAGE_KEY, key);
        } else {
            localStorage.removeItem(API_KEY_STORAGE_KEY);
        }
    } catch (error) {
        console.error("Could not access localStorage:", error);
    }
  }, []);

  const promptApiKey = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    setIsDialogOpen(false);
  };

  const value = { apiKey, setApiKey, promptApiKey };

  if (isLoading) {
    return null; // Don't render children until we've checked for the key
  }

  return (
    <AIKeyContext.Provider value={value}>
      {children}
      <ApiKeyDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveKey}
      />
    </AIKeyContext.Provider>
  );
}

export function useAIKey() {
  const context = useContext(AIKeyContext);
  if (context === undefined) {
    throw new Error('useAIKey must be used within an AIKeyProvider');
  }
  return context;
}
