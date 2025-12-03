
'use client';

import { useDoc, useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { CheckoutDialog } from '@/components/checkout-dialog';

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
    </Card>
)

export default function PaymentPage() {
    const { campaignId } = useParams();
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

    const campaignRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'campaigns', campaignId as string) : null,
        [firestore, campaignId]
    );
    const { data: campaign, isLoading: isCampaignLoading, error } = useDoc(campaignRef);
    
    const conversationsQuery = useMemoFirebase(
        () => (firestore && campaignId && user) ? query(collection(firestore, 'conversations'), where('campaign_id', '==', campaignId as string), where('status', '==', 'OFFER_ACCEPTED'), where('brand_id', '==', user.uid)) : null,
        [firestore, campaignId, user]
    );
    const { data: conversations, isLoading: areConversationsLoading } = useCollection(conversationsQuery);
    
    useEffect(() => {
        if (conversations && campaign) {
            const items = conversations.map(c => ({
                id: c.id, // conversationId
                campaignId: campaign.id,
                campaignTitle: campaign.title,
                creatorName: c.otherUser?.name || 'Creator', // Assuming enriched conversations
                deliverables: campaign.deliverables,
                amount: c.agreed_budget,
            }));
            setCheckoutItems(items);
        }
    }, [conversations, campaign]);


    if (isUserLoading || isCampaignLoading || areConversationsLoading) {
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
    
    if (checkoutItems.length === 0) {
        return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8">
                     <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Payment Not Required</AlertTitle>
                        <AlertDescription>
                            This campaign does not currently have any accepted offers awaiting payment.
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
                 <CheckoutDialog items={checkoutItems}>
                    <Button className="w-full" size="lg">Proceed to Checkout</Button>
                </CheckoutDialog>
            </main>
        </>
    )
}
