
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppHeader } from '@/components/app-header';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PartyPopper } from 'lucide-react';

const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  campaignBrief: z.string().min(20, 'The campaign brief must be at least 20 characters.'),
  deliverables: z.array(z.object({ value: z.string().min(3, 'Deliverable cannot be empty.') })).min(1, 'Please add at least one deliverable.'),
  budget: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Budget must be a positive number.')
  ),
});

type CampaignForm = z.infer<typeof campaignSchema>;

export function CreateJobPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [newCampaignId, setNewCampaignId] = useState('');

  const form = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      campaignBrief: '',
      deliverables: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliverables"
  });

  const onSubmit = async (data: CampaignForm) => {
    if (!firestore || !user) {
        toast({ variant: 'destructive', title: 'You must be logged in to create a campaign.'});
        return;
    }

    const submissionData = {
      ...data,
      deliverables: data.deliverables.map(d => d.value), // Extract just the string value
      brandId: user.uid,
      status: 'OPEN_FOR_APPLICATIONS',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
        const campaignsCollectionRef = collection(firestore, 'jobs');
        const campaignDocRef = await addDoc(campaignsCollectionRef, submissionData);

      toast({
        title: 'Campaign Published!',
        description: 'Your campaign is now open for applications.',
      });
      setNewCampaignId(campaignDocRef.id);
      setIsSuccess(true);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message || "Could not create the campaign.",
      });
    }
  };

  if (isUserLoading) {
      return <div>Loading...</div>
  }

  if (!user) {
      // It might be better to use middleware for this, but for now this works
      router.push('/login');
      return null;
  }

  return (
    <>
      <AppHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Create a New Campaign</h1>
          <p className="text-muted-foreground mt-2">This will be visible to creators on the platform.</p>
        </div>
        
        {isSuccess ? (
             <Alert className="border-green-500 text-green-700">
                <PartyPopper className="h-4 w-4" />
                <AlertTitle className="font-bold">Campaign Published!</AlertTitle>
                <AlertDescription>
                    Your campaign is now live and creators can start applying.
                    <div className="mt-4 flex gap-4">
                         <Button onClick={() => router.push(`/jobs/${newCampaignId}/manage`)}>Manage Applications</Button>
                         <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                    </div>
                </AlertDescription>
             </Alert>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Campaign Title</FormLabel>
                      <FormControl>
                          <Input placeholder="e.g., Summer Skincare Campaign" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="campaignBrief"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Campaign Brief</FormLabel>
                      <FormControl>
                          <Textarea placeholder="Describe the campaign goals, target audience, key messages, and overall vibe." {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Deliverables</FormLabel>
                  <div className="space-y-3">
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`deliverables.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder={`e.g., 3 Instagram Stories with product link`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         {fields.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ value: "" })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Deliverable
                  </Button>
                </div>


                <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Budget (in DH)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? 'Publishing Campaign...' : 'Publish Campaign'}
                </Button>
            </form>
            </Form>
        )}
      </div>
    </>
  );
}
