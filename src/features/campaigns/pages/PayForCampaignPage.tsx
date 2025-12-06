
'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, getDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { CheckoutDialog } from '@/components/checkout-dialog';
import { useLanguage } from '@/context/language-context';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const PaymentPageSkeleton = () => (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
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
    const [potentialItems, setPotentialItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, dir } = useLanguage();
    const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

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
                        creatorAvatar: creatorSnap.exists() ? creatorSnap.data().photoURL : '',
                        deliverables: campaign.deliverables,
                        amount: c.agreed_budget,
                    };
                }));
                setPotentialItems(items);
                setSelectedItems(items.map(item => item.id)); // Pre-select all
                setIsLoading(false);
            } else if (!areConversationsLoading && !isCampaignLoading) {
                 setIsLoading(false);
            }
        };
        enrichItems();
    }, [conversations, campaign, firestore, areConversationsLoading, isCampaignLoading]);

    const handleItemSelect = (itemId: string) => {
      setSelectedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    };

    const itemsToProcess = useMemo(() => potentialItems.filter(item => selectedItems.includes(item.id)), [potentialItems, selectedItems]);
    
    const { subTotal, serviceFee, vat, total } = useMemo(() => {
        const subTotal = itemsToProcess.reduce((acc, item) => acc + item.amount, 0);
        const serviceFee = subTotal * 0.10;
        const vat = serviceFee * 0.20;
        const total = subTotal + serviceFee + vat;
        return { subTotal, serviceFee, vat, total };
    }, [itemsToProcess]);


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
    
    if (potentialItems.length === 0) {
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
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="w-full grid lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <h1 className="text-3xl font-extrabold tracking-tight">{t('checkout.title')}</h1>
                             <p className="text-muted-foreground">
                                {t('checkout.summary')} for: <strong>{campaign.title}</strong>
                            </p>
                        </div>
                        <div className="space-y-3">
                           {potentialItems.map(item => (
                               <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg has-[:checked]:bg-primary/5 has-[:checked]:border-primary/50 transition-colors">
                                   <Checkbox 
                                       id={`item-${item.id}`}
                                       checked={selectedItems.includes(item.id)}
                                       onCheckedChange={() => handleItemSelect(item.id)}
                                       className="mt-1"
                                   />
                                   <div className="grid gap-1.5 leading-none flex-1">
                                       <label htmlFor={`item-${item.id}`} className="font-semibold cursor-pointer flex items-center gap-3">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={item.creatorAvatar} alt={item.creatorName} />
                                                <AvatarFallback>{item.creatorName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            {item.creatorName}
                                        </label>
                                       <div className="flex justify-between items-center text-muted-foreground text-sm">
                                           <p className="truncate pr-2">{item.deliverables.join(', ')}</p>
                                           <p className="font-mono whitespace-nowrap">{item.amount.toFixed(2)} {t('currency')}</p>
                                       </div>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </div>
                     <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                            <CheckoutDialog items={itemsToProcess}>
                                <Button className="w-full" size="lg" disabled={itemsToProcess.length === 0}>
                                    {t('checkout.proceedButton')} <Arrow className={cn("h-4 w-4", dir === 'rtl' ? 'mr-2' : 'ml-2')} />
                                </Button>
                            </CheckoutDialog>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </>
    )
}
