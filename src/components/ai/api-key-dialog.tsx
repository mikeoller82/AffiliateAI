
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (apiKey: string) => void;
}

export function ApiKeyDialog({ isOpen, onOpenChange, onSave }: ApiKeyDialogProps) {
  const [key, setKey] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (key.trim().length === 0) {
      toast({
        variant: 'destructive',
        title: 'API Key Required',
        description: 'Please enter a valid Google AI API key.',
      });
      return;
    }
    onSave(key);
    toast({
      title: 'API Key Saved',
      description: 'Your API key has been saved for this session.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Your API Key</DialogTitle>
          <DialogDescription>
            To use the AI tools, please provide your own Google AI API key. Your key is stored securely in your browser and is never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google AI API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
           <p className="text-xs text-muted-foreground">
              You can get a free API key from {' '}
              <Link href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">
                 Google AI Studio
              </Link>.
            </p>
        </div>
        <DialogFooter>
           <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
