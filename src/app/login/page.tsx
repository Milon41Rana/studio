
      
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if user is already logged in with a non-anonymous account
  useEffect(() => {
    if (!isUserLoading && user && !user.isAnonymous) {
      if (user.email === 'ranamilon41@gmail.com') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    }
  }, [user, isUserLoading, router]);

  async function handleFormSubmit(data: LoginFormData) {
    if (!auth) return;
    try {
        await initiateEmailSignIn(auth, data.email, data.password);
        toast({
            title: 'Login Successful',
            description: "You've been logged in.",
        });
        // Redirection is handled by the useEffect hook
    } catch (error) {
        let errorMessage = 'An unknown error occurred.';
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'The email address is not valid.';
                    break;
                default:
                    errorMessage = 'Failed to log in. Please try again later.';
                    break;
            }
        }
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: errorMessage,
        });
        console.error("Login error:", error);
    }
  }
  
  // Show loading state while checking user status
  if (isUserLoading) {
    return (
       <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading...</p>
       </div>
    );
  }
  
  // If user is logged in (but not anon), show loading while redirecting
  if (user && !user.isAnonymous) {
    return (
       <div className="flex items-center justify-center min-h-[400px]">
          <p>Redirecting...</p>
       </div>
    );
  }


  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex-col items-center gap-4">
            <Separator />
            <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto">
                   <Link href="/signup">Sign up</Link>
                </Button>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    