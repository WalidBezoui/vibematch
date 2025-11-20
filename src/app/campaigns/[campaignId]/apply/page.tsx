'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

const applicationSchema = z.object({
  coverLetter: z.string().min(30, { message: "Please write a brief note (at least 30 characters)." }),
  bidAmount: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number({ invalid_type_error: 'Tariff must be a number.' }).positive('Your tariff must be a positive number.')
  ),
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
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    </div>
)

export default function ApplyPage() {
    const { campaignId } = useParams();
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const [isAlreadyApplied, setIsAlreadyApplied] = useState<boolean | null>(null);

    const campaignRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'campaigns', campaignId as string) : null,
        [firestore, campaignId]
    );
    const { data: campaign, isLoading: isCampaignLoading, error } = useDoc(campaignRef);

    const form = useForm<ApplicationForm>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            coverLetter: '',
            bidAmount: 0,
        }
    });

    const bidAmountValue = form.watch('bidAmount');
    const isBidHigher = campaign && bidAmountValue > campaign.budget;


    useEffect(() => {
        if (user && firestore && campaignId) {
            const checkApplication = async () => {
                const applicationsRef = collection(firestore, 'campaigns', campaignId as string, 'applications');
                const q = query(applicationsRef, where("creatorId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                setIsAlreadyApplied(!querySnapshot.empty);
            };
            checkApplication();
        }
    }, [user, firestore, campaignId]);

    useEffect(() => {
        if (campaign) {
            form.setValue('bidAmount', campaign.budget);
        }
    }, [campaign, form]);

    const onSubmit = async (data: ApplicationForm) => {
        if (!user || !firestore || !campaign) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not submit application. Please try again.' });
            return;
        }

        try {
            const applicationsRef = collection(firestore, 'campaigns', campaignId as string, 'applications');
            await addDoc(applicationsRef, {
                campaignId: campaignId,
                creatorId: user.uid,
                brandId: campaign.brandId,
                coverLetter: data.coverLetter,
                bidAmount: data.bidAmount,
                campaignBudgetSnapshot: campaign.budget,
                status: 'APPLIED',
                createdAt: serverTimestamp(),
            });

            toast({ title: 'Application Sent!', description: 'The brand will be notified of your interest.' });
            router.push('/dashboard');

        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Submission Failed', description: e.message });
        }
    };
    
    const isLoading = isUserLoading || isCampaignLoading || isAlreadyApplied === null;

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
        router.push(`/login?redirect=/campaigns/${campaignId}/apply`);
        return <ApplyPageSkeleton />;
    }

    if (!campaign || error) {
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
                        <CardTitle className="text-3xl">Apply for: {campaign.title}</CardTitle>
                        <CardDescription>Briefly explain why you're a great fit and confirm your tariff.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                 <FormField
                                    control={form.control}
                                    name="bidAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Tariff for this Mission</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                             {isBidHigher && (
                                                <Alert variant="default" className="border-orange-400 text-orange-700 mt-2">
                                                    <Info className="h-4 w-4" />
                                                    <AlertDescription>
                                                        Note: Your offer is higher than the brand's budget.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="coverLetter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Why you?</FormLabel>
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
                                    {form.formState.isSubmitting ? 'Submitting...' : 'Send my Application'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
