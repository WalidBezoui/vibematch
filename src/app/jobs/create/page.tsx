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
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, XCircle } from 'lucide-react';

const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  campaignBrief: z.string().min(20, 'The campaign brief must be at least 20 characters.'),
  deliverables: z.array(z.object({ value: z.string().min(3, 'Deliverable cannot be empty.') })).min(1, 'Please add at least one deliverable.'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number.')
  ),
  creatorEmail: z.string().email('Please enter a valid email for the creator.'),
});

type CampaignForm = z.infer<typeof campaignSchema>;

export default function CreateCampaignPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [newInviteLink, setNewInviteLink] = useState('');

  const form = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      campaignBrief: '',
      deliverables: [{ value: '' }],
      creatorEmail: '',
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
      deliverables: data.deliverables.map(d => d.value) // Extract just the string value
    }

    try {
        // Create an invite first
        const inviteId = uuidv4();
        const inviteRef = doc(firestore, 'invites', inviteId);
        
        // Create the campaign document
        const campaignsCollectionRef = collection(firestore, 'jobs');
        const campaignDocRef = await addDoc(campaignsCollectionRef, {
            ...submissionData,
            brandId: user.uid,
            status: 'PENDING_CREATOR_APPROVAL',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            inviteId: inviteId,
        });

        // Now set the invite document
        await setDoc(inviteRef, {
            jobId: campaignDocRef.id,
            creatorEmail: data.creatorEmail,
            status: 'pending',
            createdAt: serverTimestamp(),
        });

      toast({
        title: 'Campaign Created!',
        description: 'Invitation link is ready to be shared.',
      });
      setNewInviteLink(`${window.location.origin}/invites/${inviteId}`);
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
      router.push('/login');
      return null;
  }

  return (
    <>
      <AppHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Create a New Campaign Brief</h1>
          <p className="text-muted-foreground mt-2">This will be sent to the creator for approval.</p>
        </div>
        
        {newInviteLink ? (
             <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <h3 className="font-bold text-green-800">Campaign Created Successfully!</h3>
                <p className="text-green-700 mt-2">Share this unique invitation link with your creator:</p>
                <div className="mt-4 flex items-center gap-2">
                    <Input readOnly value={newInviteLink} className="bg-white"/>
                    <Button onClick={() => navigator.clipboard.writeText(newInviteLink)}>Copy</Button>
                </div>
                <p className="text-xs text-green-600 mt-2">
                    Once the creator accepts, you will be prompted for payment.
                </p>
                <Button variant="outline" onClick={() => router.push('/dashboard')} className="mt-4">Back to Dashboard</Button>
             </div>
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


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price (in DH)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="500" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="creatorEmail"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Creator's Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="creator@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? 'Creating Campaign...' : 'Create Campaign & Get Invite Link'}
                </Button>
            </form>
            </Form>
        )}
      </div>
    </>
  );
}
