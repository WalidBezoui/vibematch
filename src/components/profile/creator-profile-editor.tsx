'use client';

import { useState, useMemo } from 'react';
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
import { Upload, User, MapPin, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const creatorProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name is required.'),
  jobTitle: z.string().min(2, 'Job title is required.'),
  location: z.string().min(2, 'Location is required.'),
  bio: z.string().max(500, 'Bio must be 500 characters or less.').optional(),
  tags: z.array(z.string()).optional(),
  photoURL: z.string().url().optional(),
});

type CreatorProfileFormValues = z.infer<typeof creatorProfileSchema>;

const AdminBadgeDisplay = ({ badge }: { badge: string }) => {
    if (!badge || badge === 'NONE') return null;

    const badgeInfo: { [key: string]: { style: string, text: string }} = {
        VERIFIED: { style: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Verified'},
        RISING_STAR: { style: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Rising Star'},
        TOP_RATED: { style: 'bg-green-100 text-green-800 border-green-200', text: 'Top Rated'},
    };
    
    const currentBadge = badgeInfo[badge];
    if (!currentBadge) return null;
    
    return (
        <Badge variant="secondary" className={cn(currentBadge.style)}>
            {currentBadge.text}
        </Badge>
    );
};


export default function CreatorProfileEditor({ profile }: { profile: any }) {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<CreatorProfileFormValues>({
    resolver: zodResolver(creatorProfileSchema),
    defaultValues: {
      displayName: profile.displayName || profile.name?.split(' ')[0] || '',
      jobTitle: profile.jobTitle || '',
      location: profile.location || '',
      bio: profile.bio || '',
      tags: profile.tags || [],
      photoURL: profile.photoURL || '',
    },
  });
  
  const handleCancel = () => {
    form.reset({
      displayName: profile.displayName || profile.name?.split(' ')[0] || '',
      jobTitle: profile.jobTitle || '',
      location: profile.location || '',
      bio: profile.bio || '',
      tags: profile.tags || [],
      photoURL: profile.photoURL || '',
    });
    setIsEditing(false);
  }

  const onSubmit = async (data: CreatorProfileFormValues) => {
    if (!user || !firestore) return;

    const userDocRef = doc(firestore, 'users', user.uid);
     const updateData = {
        displayName: data.displayName,
        jobTitle: data.jobTitle,
        location: data.location,
        bio: data.bio,
        tags: data.tags,
        photoURL: data.photoURL,
    };

    try {
      await updateDoc(userDocRef, updateData);
      toast({
        title: 'Profile Updated',
        description: 'Your information has been successfully saved.',
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update your profile.',
      });
    }
  };

  const photoToDisplay = form.watch('photoURL') || profile.photoURL;
  
  if (!isEditing) {
      return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <div className="relative group">
                                <Avatar className="w-32 h-32 border-4">
                                    <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                                    <AvatarFallback className="text-4xl bg-muted">
                                    {profile.displayName?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-background/50 backdrop-blur group-hover:bg-background transition-colors shadow-md opacity-0 group-hover:opacity-100">
                                    <Upload className="h-5 w-5" />
                                    <span className="sr-only">Change Photo</span>
                                </Button>
                            </div>
                            <CardTitle>{profile.displayName}</CardTitle>
                            <CardDescription>{profile.jobTitle}</CardDescription>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                                <MapPin className="h-4 w-4" />
                                <span>{profile.location}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="text-center">
                            <AdminBadgeDisplay badge={profile.adminBadge} />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Public Profile</CardTitle>
                                <CardDescription>This is how brands will see you.</CardDescription>
                            </div>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
                                <p className="text-foreground/90 whitespace-pre-wrap">{profile.bio || 'No bio provided.'}</p>
                            </div>
                            {profile.tags && profile.tags.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.tags.map((tag: string) => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>My Portfolio</CardTitle>
                            <CardDescription>Showcase your best work.</CardDescription>
                        </CardHeader>
                        <CardContent>
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
        </div>
      )
  }

  // EDITING MODE
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
         <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 space-y-6">
                 <h2 className="text-xl font-semibold">Editing Profile</h2>
            </div>
            <div className="md:col-span-2 space-y-8">
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
                    <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
                         <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
                         <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </form>
    </Form>
  );
}
