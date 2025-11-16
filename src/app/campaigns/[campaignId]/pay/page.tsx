'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const PaymentPageSkeleton = () => (
    <Card className="max-w-xl mx-auto">
        <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
            <Skeleton className="h-24 w-full mt-4" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-12 w-full" />
        </CardFooter>
    </Card>
)

export default function PaymentPage() {
    const { campaignId } = useParams();
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const [isPaying, setIsPaying] = useState(false);

    const campaignRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'campaigns', campaignId as string) : null,
        [firestore, campaignId]
    );
    const { data: campaign, isLoading: isCampaignLoading, error } = useDoc(campaignRef);

    const handlePayment = async () => {
        if (!campaignRef) return;
        setIsPaying(true);
        toast({ title: "Processing Payment...", description: "This is a simulation."});
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            await updateDoc(campaignRef, {
                status: 'IN_PROGRESS',
                updatedAt: serverTimestamp(),
            });
            toast({ title: "Payment Successful!", description: "The campaign has started. The creator has been notified."});
            router.push(`/campaigns/${campaignId}`);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Payment Failed', description: e.message });
            setIsPaying(false);
        }
    }


    if (isUserLoading || isCampaignLoading) {
        return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8">
                   <PaymentPageSkeleton />
                </main>
            </>
        )
    }

    if (!campaign || error) {
        return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8 text-center">
                    <h1 className="text-2xl font-bold">Campaign not found</h1>
                    <p className="text-muted-foreground">The campaign you are looking for does not exist or you do not have permission to view it.</p>
                    <Button asChild className="mt-4"><Link href="/dashboard">Back to Dashboard</Link></Button>
                </main>
            </>
        )
    }

    if (campaign.brandId !== user?.uid) {
         return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8">
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Access Denied</AlertTitle>
                        <AlertDescription>You are not authorized to pay for this campaign.</AlertDescription>
                    </Alert>
                </main>
            </>
        )
    }
    
    if (campaign.status !== 'PENDING_PAYMENT') {
        return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8">
                     <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Payment Not Required</AlertTitle>
                        <AlertDescription>
                            This campaign is not currently awaiting payment. Its status is: {campaign.status.replace(/_/g, ' ')}.
                            <Button asChild variant="link" className="p-0 h-auto ml-2"><Link href={`/campaigns/${campaignId}`}>View Campaign</Link></Button>
                        </AlertDescription>
                    </Alert>
                </main>
            </>
        )
    }


    return (
        <>
            <AppHeader />
            <main className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Secure Payment</CardTitle>
                        <CardDescription>You are about to fund the campaign: <strong>{campaign.title}</strong></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center text-xl p-4 bg-muted rounded-lg">
                            <span>Total Amount</span>
                            <span className="font-bold text-2xl gradient-text">{campaign.budget} DH</span>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                            <p>Your payment will be held securely by VibeMatch and only released to the creator upon your approval of the final deliverables.</p>
                        </div>
                        {/* Placeholder for CMI/Stripe integration */}
                        <div className="p-8 border-2 border-dashed rounded-lg text-center">
                            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Payment Gateway Integration Placeholder</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handlePayment} disabled={isPaying} className="w-full" size="lg">
                            {isPaying ? 'Processing...' : `Pay ${campaign.budget} DH and Start Campaign`}
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </>
    )
}
