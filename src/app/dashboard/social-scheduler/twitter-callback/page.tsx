
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function TwitterCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const oauth_token = searchParams.get('oauth_token');
        const oauth_verifier = searchParams.get('oauth_verifier');

        if (oauth_token && oauth_verifier) {
            fetch('/api/oauth/twitter/access-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oauth_token, oauth_verifier }),
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    toast({ title: 'Success', description: `Connected to Twitter as ${data.screenName}` });
                    router.push('/dashboard/social-scheduler');
                } else {
                    throw new Error(data.error || 'Failed to connect to Twitter');
                }
            })
            .catch(error => {
                toast({ variant: 'destructive', title: 'Error', description: error.message });
                router.push('/dashboard/social-scheduler');
            });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Invalid Twitter callback parameters.' });
            router.push('/dashboard/social-scheduler');
        }
    }, [searchParams, router, toast]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-semibold">Connecting to Twitter...</p>
                <p className="text-muted-foreground">Please wait while we finalize the connection.</p>
            </div>
        </div>
    );
}
