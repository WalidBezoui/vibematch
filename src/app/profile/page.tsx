'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase, useUserProfile } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSkeleton = () => (
  <div className="grid md:grid-cols-3 gap-8">
    <div className="md:col-span-1 space-y-4">
      <Card>
        <CardHeader className="items-center">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="w-full space-y-2 pt-4 text-center">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </CardHeader>
      </Card>
    </div>
    <div className="md:col-span-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-12 w-1/3" />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function ProfilePage() {
  const { user, isUserLoading, firestore } = useFirebase();
  const { userProfile, isLoading: isProfileLoading, error: profileError } = useUserProfile();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        email: userProfile.email || '',
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !firestore) return;

    const userDocRef = doc(firestore, 'users', user.uid);

    try {
      await updateDoc(userDocRef, {
        name: data.name,
      });
      toast({
        title: 'Profile Updated',
        description: 'Your information has been successfully saved.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update your profile.',
      });
    }
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  if (!isUserLoading && !user) {
    router.push('/login');
    return <ProfileSkeleton />;
  }

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          <ProfileSkeleton />
        </main>
      </>
    );
  }

  if (profileError || !userProfile) {
    return (
      <>
        <AppHeader />
        <main className="max-w-5xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="text-muted-foreground">Could not load user profile.</p>
        </main>
      </>
    );
  }


  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader />
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 space-y-4">
            <Card className="overflow-hidden">
                <CardHeader className="items-center text-center p-6 bg-card">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary">
                            <AvatarImage src={userProfile.photoURL} alt={userProfile.name} />
                            <AvatarFallback className="text-4xl">
                                {userProfile.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <Button variant="ghost" size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background/50 group-hover:bg-background transition-colors">
                            <Camera className="h-4 w-4" />
                            <span className="sr-only">Change photo</span>
                        </Button>
                    </div>
                    <div className="pt-2">
                        <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                        <CardDescription>{userProfile.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Role</span>
                        <span className="text-sm font-medium capitalize px-2 py-1 rounded-md bg-secondary text-secondary-foreground">{userProfile.role}</span>
                    </div>
                </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information here.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
