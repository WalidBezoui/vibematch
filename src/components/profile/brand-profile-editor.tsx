'use client';

import { useState } from 'react';
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
import { Building, Link as LinkIcon, AlertTriangle, Upload, Edit, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const brandProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name is required.'),
  website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  industry: z.string().min(2, 'Industry is required.'),
  description: z.string().max(500, 'Description must be 500 characters or less.').optional(),
  logoUrl: z.string().url().optional(),
});

type BrandProfileFormValues = z.infer<typeof brandProfileSchema>;

export default function BrandProfileEditor({ profile }: { profile: any }) {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<BrandProfileFormValues>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      companyName: profile.companyName || profile.name || '',
      website: profile.website || '',
      industry: profile.industry || '',
      description: profile.description || '',
      logoUrl: profile.logoUrl || '',
    },
  });

  const onSubmit = async (data: BrandProfileFormValues) => {
    if (!user || !firestore) return;

    const userDocRef = doc(firestore, 'users', user.uid);
    const updateData = {
        name: data.companyName,
        companyName: data.companyName,
        website: data.website,
        industry: data.industry,
        description: data.description,
    };

    try {
      await updateDoc(userDocRef, updateData);
      toast({
        title: 'Profile Updated',
        description: 'Your company information has been successfully saved.',
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
  
  const handleCancel = () => {
      form.reset(); // Reset form to original values
      setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="items-center text-center p-0">
                    <div className="relative group w-full aspect-[4/3] bg-muted">
                        <Avatar className="w-full h-full rounded-none">
                            <AvatarImage src={profile.logoUrl} alt={profile.companyName} className="object-cover" />
                            <AvatarFallback className="text-6xl bg-muted rounded-none">
                                <Building />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                     <div className="p-6 w-full">
                        <CardTitle>{profile.companyName || profile.name}</CardTitle>
                        <CardDescription>{profile.industry}</CardDescription>
                    </div>
                </CardHeader>
                {!profile.isPaymentVerified && (
                    <CardFooter className="bg-destructive/10 p-4 border-t border-destructive/20">
                        <Alert variant="destructive" className="border-0 p-0">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Payment Method Not Verified</AlertTitle>
                            <AlertDescription>
                                Add a payment method to verify your profile.
                            </AlertDescription>
                        </Alert>
                    </CardFooter>
                )}
            </Card>
        </div>
        <div className="md:col-span-2">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Company Profile</CardTitle>
                        <CardDescription>This information is visible to creators.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                     <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Website</h4>
                        {profile.website ? (
                           <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                             <LinkIcon className="h-4 w-4" /> {profile.website}
                           </a>
                        ) : <p className="text-sm text-muted-foreground">Not provided</p>}
                    </div>
                     <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">About</h4>
                        <p className="text-foreground/90 whitespace-pre-wrap">{profile.description || 'No description provided.'}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="items-center text-center">
                <div className="relative group w-32 h-32">
                    <Avatar className="w-full h-full border-4">
                        <AvatarImage src={form.watch('logoUrl')} alt={profile.companyName} />
                        <AvatarFallback className="text-4xl bg-muted">
                            <Building />
                        </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-background/80 backdrop-blur group-hover:bg-background transition-colors shadow-md">
                        <Upload className="h-5 w-5" />
                        <span className="sr-only">Change logo</span>
                    </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
          <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Company Profile</CardTitle>
                  <CardDescription>Set your company's details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                       <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                  <Input placeholder="Your Company Name" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                      <FormField
                          control={form.control}
                          name="industry"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <FormControl>
                                  <Input placeholder="e.g., E-commerce, SaaS" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                  </div>
                  <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Website</FormLabel>
                           <div className="relative">
                               <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <FormControl>
                                  <Input placeholder="https://yourcompany.com" {...field} className="pl-9" />
                              </FormControl>
                           </div>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                   <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Company Description</FormLabel>
                          <FormControl>
                              <Textarea rows={5} placeholder="Tell creators about your brand, your mission, and what you stand for." {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
                   <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
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
