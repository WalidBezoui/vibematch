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
import { Building, Link as LinkIcon, AlertTriangle, Upload } from 'lucide-react';
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
        name: data.companyName, // Also update the base name for consistency
        companyName: data.companyName,
        website: data.website,
        industry: data.industry,
        description: data.description,
        // logoUrl would be updated via an upload function
    };

    try {
      await updateDoc(userDocRef, updateData);
      toast({
        title: 'Profile Updated',
        description: 'Your company information has been successfully saved.',
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
            <CardTitle>{form.watch('companyName')}</CardTitle>
            <CardDescription>{form.watch('industry')}</CardDescription>
          </CardHeader>
           {!profile.isPaymentVerified && (
             <CardFooter>
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Payment Method Not Verified</AlertTitle>
                    <AlertDescription>
                        Please add a payment method to verify your profile. Creators are less likely to respond to unverified brands.
                    </AlertDescription>
                </Alert>
             </CardFooter>
           )}
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                 <CardDescription>
                    Your payment method is not shared with creators.
                </CardDescription>
            </CardHeader>
            <CardContent>
               <Button className="w-full" disabled={profile.isPaymentVerified}>
                {profile.isPaymentVerified ? 'Payment Method Verified' : 'Add Payment Method'}
               </Button>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>This information will be visible to creators.</CardDescription>
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
              <CardFooter className="border-t px-6 py-4">
                 <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
