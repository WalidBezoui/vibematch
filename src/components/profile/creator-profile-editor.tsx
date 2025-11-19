'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User, MapPin, Badge as BadgeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const creatorProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name is required.'),
  jobTitle: z.string().min(2, 'Job title is required.'),
  location: z.string().min(2, 'Location is required.'),
  bio: z.string().max(500, 'Bio must be 500 characters or less.').optional(),
  tags: z.array(z.string()).optional(),
  headshotUrl: z.string().url().optional(),
});

type CreatorProfileFormValues = z.infer<typeof creatorProfileSchema>;

const AdminBadgeDisplay = ({ badge }: { badge: string }) => {
    if (!badge || badge === 'NONE') return null;

    const badgeStyles: { [key: string]: string } = {
        VERIFIED: 'bg-blue-100 text-blue-800 border-blue-200',
        RISING_STAR: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        TOP_RATED: 'bg-green-100 text-green-800 border-green-200',
    };
    
    return (
        <Badge variant="secondary" className={cn('capitalize', badgeStyles[badge])}>
            {badge.replace('_', ' ').toLowerCase()}
        </Badge>
    );
};


export default function CreatorProfileEditor({ profile }: { profile: any }) {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();

  const form = useForm<CreatorProfileFormValues>({
    resolver: zodResolver(creatorProfileSchema),
    defaultValues: {
      displayName: profile.displayName || profile.name.split(' ')[0] || '',
      jobTitle: profile.jobTitle || '',
      location: profile.location || '',
      bio: profile.bio || '',
      tags: profile.tags || [],
      headshotUrl: profile.photoURL || '',
    },
  });

  const onSubmit = async (data: CreatorProfileFormValues) => {
    if (!user || !firestore) return;

    const userDocRef = doc(firestore, 'users', user.uid);
     const updateData = {
        displayName: data.displayName,
        jobTitle: data.jobTitle,
        location: data.location,
        bio: data.bio,
        tags: data.tags,
        // headshotUrl would be updated via a separate upload function
    };

    try {
      await updateDoc(userDocRef, updateData);
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

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1 space-y-6">
        <Card>
            <CardHeader className="items-center text-center">
                 <div className="relative group w-32 h-32">
                    <Avatar className="w-full h-full border-4">
                        <AvatarImage src={form.watch('headshotUrl')} alt={profile.displayName} />
                        <AvatarFallback className="text-4xl bg-muted">
                           {profile.displayName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                     <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-background/80 backdrop-blur group-hover:bg-background transition-colors shadow-md">
                        <Upload className="h-5 w-5" />
                        <span className="sr-only">Change Photo</span>
                    </Button>
                </div>
                <CardTitle>{form.watch('displayName')}</CardTitle>
                <CardDescription>{form.watch('jobTitle')}</CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{form.watch('location')}</span>
                </div>
            </CardHeader>
            <CardContent className="text-center">
                 <AdminBadgeDisplay badge={profile.adminBadge} />
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Public Profile</CardTitle>
                    <CardDescription>This is how brands will see you on VibeMatch.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="grid sm:grid-cols-2 gap-4">
                         <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your first name or nickname" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="jobTitle"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Culinary Photographer" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Marrakech, Morocco" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea rows={5} placeholder="Tell brands what makes you unique. What's your story and your content's vibe?" {...field} />
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
          </form>
        </Form>

         <Card>
            <CardHeader>
                <CardTitle>My Portfolio</CardTitle>
                <CardDescription>Showcase your best work. This is the most important part of your profile.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Portfolio CRUD will go here */}
                 <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Your portfolio is empty.</p>
                     <Button variant="outline" className="mt-4">
                        + Add a Project
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
