'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, Info, ArrowRight, CircleDollarSign, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';

const applicationSchema = z.object({
  coverLetter: z.string().optional(),
  bidAmount: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number({ invalid_type_error: 'Tariff must be a number.' }).positive('Your tariff must be a positive number.')
  ),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const ApplyPageSkeleton = () => (
    <div className="max-w-2xl mx-auto">
        <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full mt-4" />
                <Skeleton className="h-12 w-full mt-4" />
            </CardContent>
        </Card>
    </div>
)

export default function ApplyPage() {
    const { campaignId } = useParams();
    const router = useRouter();
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const { t } = useLanguage();
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
                coverLetter: data.coverLetter || '',
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
    const isSubmitting = form.formState.isSubmitting;

    const renderContent = () => {
        if (isLoading) {
            return <ApplyPageSkeleton />;
        }
    
        if (!user) {
            router.push(`/login?redirect=/campaigns/${campaignId}/apply`);
            return <ApplyPageSkeleton />;
        }
    
        if (!campaign || error) {
            return (
                <div className="text-center bg-background/80 backdrop-blur-sm p-8 rounded-2xl">
                    <h1 className="text-2xl font-bold">{t('editCampaignPage.notFound.title')}</h1>
                    <p className="text-muted-foreground mt-2">{t('editCampaignPage.notFound.description')}</p>
                    <Button asChild className="mt-6">
                        <Link href="/discover">{t('discoverCampaigns.title')}</Link>
                    </Button>
                </div>
            )
        }
    
        if (isAlreadyApplied) {
            return (
                <Card className="text-center bg-background/80 backdrop-blur-sm shadow-2xl shadow-primary/10">
                    <CardContent className="p-8">
                        <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                            <CheckCircle className="h-8 w-8 text-black" />
                        </div>
                        <h2 className="text-2xl font-bold">{t('applyPage.alreadyApplied.title')}</h2>
                        <p className="text-muted-foreground mt-2">{t('applyPage.alreadyApplied.description')}</p>
                        <Button asChild className="mt-6">
                            <Link href="/discover">{t('discoverCampaigns.title')}</Link>
                        </Button>
                    </CardContent>
                </Card>
            )
        }

        return (
             <Card className="bg-background/80 backdrop-blur-sm border-border shadow-2xl shadow-primary/5">
                <CardHeader className="text-center items-center p-8">
                    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-black mb-4 shadow-lg shadow-primary/30">
                        <FileText className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-extrabold tracking-tight">{t('applyPage.title')}</CardTitle>
                    <CardDescription className="text-lg gradient-text font-semibold pt-1">{campaign.title}</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-1 p-4 border rounded-lg bg-muted/50">
                                <h3 className="text-sm font-semibold text-muted-foreground">{t('applyPage.form.tariff.title')}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {t('applyPage.form.tariff.description', { budget: campaign.budget })}
                                </p>
                            </div>

                             <FormField
                                control={form.control}
                                name="bidAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <FormControl>
                                                <Input type="number" {...field} className="h-14 pl-10 text-lg" />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                         {isBidHigher && (
                                            <Alert variant="default" className="border-orange-400 text-orange-700 mt-2 text-xs">
                                                <Info className="h-4 w-4" />
                                                <AlertDescription>
                                                    {t('applyPage.form.tariff.warning')}
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
                                        <FormLabel className="text-sm font-semibold text-muted-foreground">{t('applyPage.form.coverLetter.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('applyPage.form.coverLetter.placeholder')}
                                                rows={5}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full h-14 text-base font-bold tracking-wide rounded-full gradient-bg text-black hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
                                    {isSubmitting ? t('applyPage.form.submittingButton') : t('applyPage.form.submitButton')}
                                    {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col">
            <AppHeader />
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 hero-bg">
                <div className="w-full max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('applyPage.backButton')}
                        </Button>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
