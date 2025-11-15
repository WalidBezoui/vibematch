'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number.')
  ),
  creatorEmail: z.string().email('Please enter a valid email for the creator.'),
});

type JobForm = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [newInviteLink, setNewInviteLink] = useState('');

  const form = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      creatorEmail: '',
    },
  });

  const onSubmit = async (data: JobForm) => {
    if (!firestore || !user) {
        toast({ variant: 'destructive', title: 'You must be logged in to create a job.'});
        return;
    }

    try {
        // Create an invite first
        const inviteId = uuidv4();
        const inviteRef = doc(firestore, 'invites', inviteId);
        
        // Create the job document
        const jobsCollectionRef = collection(firestore, 'jobs');
        const jobDocRef = await addDoc(jobsCollectionRef, {
            ...data,
            brandId: user.uid,
            status: 'PENDING_CREATOR_APPROVAL',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            inviteId: inviteId,
        });

        // Now set the invite document
        await setDoc(inviteRef, {
            jobId: jobDocRef.id,
            creatorEmail: data.creatorEmail,
            status: 'pending',
            createdAt: serverTimestamp(),
        });

      toast({
        title: 'Job Created!',
        description: 'Invitation link is ready to be shared.',
      });
      setNewInviteLink(`${window.location.origin}/invites/${inviteId}`);
      // In a real app, this would trigger an email. For now, we'll show the link.
      // router.push(`/jobs/${jobDocRef.id}/pay`);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message || "Could not create the job.",
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
          <h1 className="text-4xl font-bold tracking-tight">Create a New Job Brief</h1>
          <p className="text-muted-foreground mt-2">This will be sent to the creator for approval.</p>
        </div>
        
        {newInviteLink ? (
             <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <h3 className="font-bold text-green-800">Job Created Successfully!</h3>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Instagram Story for Summer Campaign" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description & Deliverables</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe the campaign, what you expect from the creator, and the specific deliverables (e.g., 3 stories, 1 post)." {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {form.formState.isSubmitting ? 'Creating Job...' : 'Create Job & Get Invite Link'}
                </Button>
            </form>
            </Form>
        )}
      </div>
    </>
  );
}
