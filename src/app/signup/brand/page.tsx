'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import { useFirestore, useAuth } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const brandSignupSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type BrandSignupForm = z.infer<typeof brandSignupSchema>;

export default function BrandSignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<BrandSignupForm>({
    resolver: zodResolver(brandSignupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: BrandSignupForm) => {
    if (!firestore || !auth) return;
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2. Create user profile in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        name: data.name,
        role: 'brand',
        createdAt: serverTimestamp(),
      });

      router.push('/dashboard');
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message || "Could not create your account.",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 hero-bg">
      <div className="w-full max-w-md">
        <div className="bg-background/80 dark:bg-background/80 backdrop-blur-xl border rounded-2xl shadow-2xl shadow-primary/10 p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tighter">Sign up as a Brand</h1>
                <p className="text-muted-foreground mt-2">Create your account to start finding creators.</p>
            </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@company.com" {...field} />
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
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full mt-4"
              >
                {form.formState.isSubmitting ? 'Creating Account...' : 'Create Brand Account'}
              </Button>
            </form>
          </Form>
           <div className="text-center mt-6">
                <p className="text-sm text-foreground/60">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold gradient-text hover:text-glow transition">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
