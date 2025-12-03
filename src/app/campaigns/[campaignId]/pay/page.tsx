
'use client';

import { useDoc, useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, getDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Lock } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { CheckoutDialog } from '@/components/checkout-dialog';
import { useLanguage } from '@/context/language-context';
import { Separator } from '@/components/ui/separator';

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
    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useLanguage();

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
        const enrichItems = async () => {
            if (conversations && campaign && firestore) {
                const items = await Promise.all(conversations.map(async (c) => {
                    const creatorRef = doc(firestore, 'users', c.creator_id);
                    const creatorSnap = await getDoc(creatorRef);
                    return {
                        id: c.id, // conversationId
                        campaignId: campaign.id,
                        campaignTitle: campaign.title,
                        creatorName: creatorSnap.exists() ? (creatorSnap.data().displayName || creatorSnap.data().name) : 'Creator',
                        deliverables: campaign.deliverables,
                        amount: c.agreed_budget,
                    };
                }));
                setCheckoutItems(items);
                setIsLoading(false);
            } else if (!areConversationsLoading && !isCampaignLoading) {
                 setIsLoading(false);
            }
        };
        enrichItems();
    }, [conversations, campaign, firestore, areConversationsLoading, isCampaignLoading]);

    const { subTotal, serviceFee, vat, total } = useMemo(() => {
        const subTotal = checkoutItems.reduce((acc, item) => acc + item.amount, 0);
        const serviceFee = subTotal * 0.10;
        const vat = serviceFee * 0.20;
        const total = subTotal + serviceFee + vat;
        return { subTotal, serviceFee, vat, total };
    }, [checkoutItems]);


    if (isUserLoading || isLoading) {
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
            <main className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
                 <Card className="w-full">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full gradient-bg flex items-center justify-center text-black mb-4 shadow-lg shadow-primary/30">
                            <Lock className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-3xl">{t('checkout.title')}</CardTitle>
                        <CardDescription>
                            {t('checkout.summary')} for campaign: <strong>{campaign.title}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 border-t border-b py-4">
                           {checkoutItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">{t('checkout.paymentTo')} {item.creatorName}</span>
                                    <span className="font-mono">{item.amount.toFixed(2)} {t('currency')}</span>
                                </div>
                           ))}
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">{t('checkout.subtotal')}</p>
                                <p className="font-medium">{subTotal.toFixed(2)} {t('currency')}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">{t('checkout.serviceFee')}</p>
                                <p className="font-medium">{serviceFee.toFixed(2)} {t('currency')}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">{t('checkout.vat')}</p>
                                <p className="font-medium">{vat.toFixed(2)} {t('currency')}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center text-lg font-bold">
                            <p>{t('checkout.total')}</p>
                            <p className="gradient-text text-2xl">{total.toFixed(2)} {t('currency')}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <CheckoutDialog items={checkoutItems}>
                            <Button className="w-full" size="lg">
                                {t('checkout.proceedButton')}
                            </Button>
                        </CheckoutDialog>
                    </CardFooter>
                </Card>
            </main>
        </>
    )
}
