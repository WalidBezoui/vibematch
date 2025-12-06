'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

const applicationSchema = z.object({
  coverLetter: z.string().min(30, { message: "Please write a brief cover letter (at least 30 characters)." }),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const ApplyPageSkeleton = () => (
    <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full mt-4" />
            </CardContent>
        </Card>
    </div>
)

export default function ApplyPage() {
    const { jobId } = useParams();
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const [isAlreadyApplied, setIsAlreadyApplied] = useState<boolean | null>(null);

    const jobRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'jobs', jobId as string) : null,
        [firestore, jobId]
    );
    const { data: job, isLoading: isJobLoading, error } = useDoc(jobRef);

    useEffect(() => {
        if (user && firestore && jobId) {
            const checkApplication = async () => {
                const applicationsRef = collection(firestore, 'jobs', jobId as string, 'applications');
                const q = query(applicationsRef, where("creatorId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                setIsAlreadyApplied(!querySnapshot.empty);
            };
            checkApplication();
        }
    }, [user, firestore, jobId]);


    const form = useForm<ApplicationForm>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            coverLetter: ''
        }
    });

    const onSubmit = async (data: ApplicationForm) => {
        if (!user || !firestore || !job) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not submit application. Please try again.' });
            return;
        }

        try {
            const applicationsRef = collection(firestore, 'jobs', jobId as string, 'applications');
            await addDoc(applicationsRef, {
                jobId: jobId,
                creatorId: user.uid,
                brandId: job.brandId,
                coverLetter: data.coverLetter,
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            toast({ title: 'Application Sent!', description: 'The brand will be notified of your interest.' });
            setIsAlreadyApplied(true); // Update UI immediately

        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Submission Failed', description: e.message });
        }
    };
    
    const isLoading = isUserLoading || isJobLoading || isAlreadyApplied === null;

    if (isLoading) {
        return (
             <>
                <AppHeader />
                <main className="max-w-2xl mx-auto p-8">
                   <ApplyPageSkeleton />
                </main>
            </>
        )
    }

    if (!user) {
        // Redirect to login but keep them on the apply page after
        router.push(`/login?redirect=/jobs/${jobId}/apply`);
        return <ApplyPageSkeleton />;
    }

    if (!job || error) {
        return (
             <>
                <AppHeader />
                <main className="max-w-2xl mx-auto p-8 text-center">
                    <h1 className="text-2xl font-bold">Campaign not found</h1>
                    <p className="text-muted-foreground">This campaign may have been closed or does not exist.</p>
                    <Button asChild className="mt-4"><Link href="/discover">Back to Discovery</Link></Button>
                </main>
            </>
        )
    }

    if (isAlreadyApplied) {
        return (
             <>
                <AppHeader />
                <main className="max-w-2xl mx-auto p-8 text-center">
                     <Alert variant="default" className="border-green-500">
                        <Check className="h-4 w-4" />
                        <AlertTitle className="text-green-700">You've Already Applied!</AlertTitle>
                        <AlertDescription>
                           The brand has your application. We'll notify you if you're selected.
                           <div className="mt-4">
                             <Button asChild><Link href="/discover">Discover More Campaigns</Link></Button>
                           </div>
                        </AlertDescription>
                    </Alert>
                </main>
            </>
        )
    }
    

    return (
        <>
            <AppHeader />
            <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Apply for: {job.title}</CardTitle>
                        <CardDescription>Briefly explain why you're a great fit for this campaign.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="coverLetter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cover Letter</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Introduce yourself and explain why you'd be perfect for this collaboration..."
                                                    rows={5}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                                    {form.formState.isSubmitting ? 'Submitting...' : 'Send Application'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}