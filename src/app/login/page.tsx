
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
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

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
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Authentication Not Ready',
        description: authError || 'The authentication service is not available. Please wait a moment and try again.',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Starting login process...');
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const idToken = await userCredential.user.getIdToken();
      console.log('Got ID token, creating session...');

      // Create session cookie with better error handling
      const response = await fetch('/api/auth/session-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      console.log('Session API response status:', response.status);
      console.log('Session API response headers:', Object.fromEntries(response.headers.entries()));

      // Get response text first to handle potential parsing issues
      const responseText = await response.text();
      console.log('Session API response text:', responseText);

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        
        // Try to parse error response as JSON
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.details || errorMessage;
          } catch (parseError) {
            console.error('Failed to parse error response as JSON:', parseError);
            // If it's HTML (like a 500 error page), extract useful info
            if (responseText.includes('<title>')) {
              errorMessage = 'Server error occurred. Please try again in a moment.';
            } else {
              errorMessage = responseText.substring(0, 100) || errorMessage;
            }
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      let result;
      try {
        if (!responseText) {
          throw new Error('Empty response from server');
        }
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (result.success) {
        console.log('Login successful, redirecting...');
        toast({
          title: 'Success!',
          description: 'You have been successfully logged in.',
        });
        router.push('/dashboard');
      } else {
        throw new Error(result.error || 'Login failed - no success status');
      }

    } catch (error: any) {
      console.error("Login failed:", error);
      
      let description = 'An unexpected error occurred. Please try again.';
      
      // Handle Firebase Auth errors
      if (error.code === 'auth/invalid-credential' || 
          error.code === 'auth/wrong-password' || 
          error.code === 'auth/user-not-found' || 
          error.code === 'auth/configuration-not-found' || 
          error.code === 'auth/api-key-not-valid') {
        description = 'Invalid email or password. Please check your credentials and try again.';
      } 
      // Handle network/timeout errors
      else if (error.message?.includes('timeout') || 
               error.message?.includes('Network timeout') ||
               error.message?.includes('ERR_SOCKET_CONNECTION_TIMEOUT')) {
        description = 'Connection timeout. Please check your internet connection and try again.';
      }
      // Handle server errors
      else if (error.message?.includes('Server error: 50')) {
        description = 'Server is temporarily unavailable. Please try again in a moment.';
      }
      // Use the actual error message if available
      else if (error.message && !error.message.includes('Failed to fetch')) {
        description = error.message;
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
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} autoComplete="email" />
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
                      <Input type="password" placeholder="••••••••" {...field} autoComplete="current-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || !!authError}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
               {authError && (
                <p className="text-xs text-center text-destructive bg-destructive/20 p-2 rounded-md">
                  <strong>Configuration Error:</strong> {authError}
                </p>
              )}
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
