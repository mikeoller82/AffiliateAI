
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/contexts/auth-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const dynamic = 'force-dynamic';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { auth, authError } = useAuth();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    if (!auth || authError) {
      toast({
        variant: 'destructive',
        title: 'Authentication Not Ready',
        description: authError || 'The authentication service is not available. Please fix the configuration error above.',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Starting login process...');
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const idToken = await userCredential.user.getIdToken();
      console.log('Got ID token, creating session...');

      const response = await fetch('/api/auth/session-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      console.log('Session API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: 'An unknown server error occurred.'}));
        throw new Error(errorData.details || 'Login failed due to a server error.');
      }
      
      const result = await response.json();

      if (result.success) {
        console.log('Login successful, redirecting...');
        toast({
          title: 'Success!',
          description: 'You have been successfully logged in.',
        });
        router.replace('/dashboard');
      } else {
        throw new Error(result.error || 'Login failed - no success status');
      }

    } catch (error: any) {
      console.error("Login failed:", error);
      
      // The error message now comes directly from our improved API's 'details' field,
      // or from a client-side Firebase Auth error.
      let description = error.message || 'An unexpected error occurred. Please try again.';

      if (error.code === 'auth/invalid-credential' || 
          error.code === 'auth/wrong-password' || 
          error.code === 'auth/user-not-found') {
        description = 'Invalid email or password. Please check your credentials and try again.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <Image
                src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
                alt="HighLaunchPad Logo"
                width={64}
                height={64}
                className="rounded-md mx-auto mb-4"
            />
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
              <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Configuration Error</AlertTitle>
                  <AlertDescription>
                      {authError} This is required for local development.
                  </AlertDescription>
              </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} autoComplete="email" disabled={!!authError} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} autoComplete="current-password" disabled={!!authError} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || !!authError}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
