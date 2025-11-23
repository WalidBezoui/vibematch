

'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useUser, useMemoFirebase, useUserProfile } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc, writeBatch, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ArrowDown, ArrowUp, ChevronDown, FileText, Inbox, MessageSquare, PlusCircle, X, ShieldCheck, Bell, Sparkles } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import CreatorProfileSheet from '@/components/creator-profile-sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

// This page is now a pure notification feed for brands, showing actionable events.
// The primary action for a new application is to go to the dedicated management page.

type NotificationItem = {
  id: string; // application or campaign id
  type: 'NEW_APPLICATION' | 'OFFER_PENDING';
  data: any;
  createdAt: any;
};

const NotificationCardSkeleton = () => (
    <div className="flex items-center space-x-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
);

const NotificationCard = ({ notification }: { notification: NotificationItem }) => {
    const {t} = useLanguage();

    if (notification.type === 'NEW_APPLICATION') {
        const { profile, campaignTitle, campaignId } = notification.data;
        return (
            <Card className="transition-all hover:shadow-md">
                <CardHeader className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 cursor-pointer">
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={profile?.photoURL} alt={profile?.name} />
                                <AvatarFallback>{profile?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">
                                    {profile?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">{t('notificationsPage.card.appliedTo')} <span className="font-medium text-foreground">{campaignTitle}</span></p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {notification.createdAt ? new Date(notification.createdAt.seconds * 1000).toLocaleString() : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center ml-auto sm:ml-0 pl-16 sm:pl-0">
                            <Button asChild variant="default" size="sm">
                                <Link href={`/campaigns/${campaignId}/manage`}>
                                    Manage Applications <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        )
    }

    if (notification.type === 'OFFER_PENDING') {
         const { brandProfile, title, id: campaignId } = notification.data;
         return (
            <Card className="transition-all hover:shadow-md border-blue-500/30 bg-blue-500/5">
                <CardHeader className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 cursor-pointer">
                           <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-black shadow-lg shadow-primary/30">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">
                                    Offer from {brandProfile?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">You've been selected for the campaign: <span className="font-medium text-foreground">{title}</span></p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {notification.createdAt ? new Date(notification.createdAt.seconds * 1000).toLocaleString() : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center ml-auto sm:ml-0 pl-16 sm:pl-0">
                            <Button asChild variant="default" size="sm">
                                <Link href={`/campaigns/${campaignId}`}>
                                    Review & Accept <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        )
    }

    return null;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const { user, isUserLoading } = useUser();
    const { userProfile, isLoading: isProfileLoading } = useUserProfile();
    const firestore = useFirestore();
    const router = useRouter();
    const { t } = useLanguage();

    const isBrand = userProfile?.role === 'brand';

    const campaignsQuery = useMemoFirebase(
        () => (isBrand && user && firestore) ? query(collection(firestore, 'campaigns'), where('brandId', '==', user.uid)) : null,
        [user, firestore, isBrand]
    );
    const { data: brandCampaigns, isLoading: isLoadingCampaigns } = useCollection(campaignsQuery);

    const creatorCampaignsQuery = useMemoFirebase(
        () => (!isBrand && user && firestore) ? query(collection(firestore, 'campaigns'), where('creatorIds', 'array-contains', user.uid), where('status', '==', 'OFFER_PENDING')) : null,
        [user, firestore, isBrand]
    );
    const { data: creatorOfferCampaigns, isLoading: isLoadingCreatorCampaigns } = useCollection(creatorCampaignsQuery);


    useEffect(() => {
        if (isUserLoading || isProfileLoading) return;
        if (!user || !userProfile) {
            router.push('/login');
            return;
        }

        const fetchAllData = async () => {
            setIsLoading(true);
            const allNotifications: NotificationItem[] = [];

            // Logic for Brands
            if (isBrand) {
                if (isLoadingCampaigns || !brandCampaigns || !firestore) return;
                const campaignMap = new Map(brandCampaigns.map(c => [c.id, c.title]));

                for (const campaign of brandCampaigns) {
                    const appsRef = collection(firestore, 'campaigns', campaign.id, 'applications');
                    const q = query(appsRef, where('status', '==', 'APPLIED'));
                    const appsSnapshot = await getDocs(q);

                    if (!appsSnapshot.empty) {
                        for (const appDoc of appsSnapshot.docs) {
                            const appData = { id: appDoc.id, ...appDoc.data() };
                            const profileRef = doc(firestore, 'users', appData.creatorId);
                            const profileSnap = await getDoc(profileRef);
                            allNotifications.push({
                                type: 'NEW_APPLICATION',
                                id: appData.id,
                                createdAt: appData.createdAt,
                                data: {
                                    ...appData,
                                    profile: profileSnap.exists() ? profileSnap.data() : null,
                                    campaignTitle: campaignMap.get(appData.campaignId) || 'Unknown Campaign',
                                }
                            });
                        }
                    }
                }
            }
            // Logic for Creators
            else {
                if(isLoadingCreatorCampaigns || !creatorOfferCampaigns || !firestore) return;
                
                for(const campaign of creatorOfferCampaigns) {
                     const brandProfileRef = doc(firestore, 'users', campaign.brandId);
                     const brandProfileSnap = await getDoc(brandProfileRef);
                     allNotifications.push({
                         type: 'OFFER_PENDING',
                         id: campaign.id,
                         createdAt: campaign.updatedAt,
                         data: {
                             ...campaign,
                             brandProfile: brandProfileSnap.exists() ? brandProfileSnap.data() : null
                         }
                     })
                }
            }

            setNotifications(allNotifications.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds));
            setIsLoading(false);
        };

        fetchAllData();

    }, [brandCampaigns, creatorOfferCampaigns, firestore, user, userProfile, isUserLoading, isProfileLoading, isBrand, isLoadingCampaigns, isLoadingCreatorCampaigns, router]);

    const finalIsLoading = isLoading || isUserLoading || isProfileLoading;
    
    const emptyStateDescription = isBrand 
        ? t('notificationsPage.empty.description_brand') 
        : t('notificationsPage.empty.description');

    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="flex-1 px-4 md:px-10 lg:px-20 py-10 md:py-16">
                 <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                           {t('notificationsPage.title')}
                        </h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl text-foreground/60">
                            {t('notificationsPage.description')}
                        </p>
                    </div>

                    {finalIsLoading && (
                        <div className="space-y-4">
                            <NotificationCardSkeleton />
                            <NotificationCardSkeleton />
                            <NotificationCardSkeleton />
                        </div>
                    )}

                    {!finalIsLoading && notifications.length > 0 ? (
                        <div className="space-y-4">
                            {notifications.map(notification => (
                                <NotificationCard key={notification.id} notification={notification} />
                            ))}
                        </div>
                    ) : null}

                     {!finalIsLoading && notifications.length === 0 && (
                        <div className="text-center py-24 border-2 border-dashed rounded-lg bg-muted/30">
                             <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                                <Bell className="h-8 w-8 text-black" />
                            </div>
                            <h2 className="text-2xl font-semibold mt-4">{t('notificationsPage.empty.title')}</h2>
                            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">{emptyStateDescription}</p>
                             {isBrand && (
                                <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
                                    <Link href="/campaigns/create">
                                        <PlusCircle className="mr-2 h-5 w-5" />
                                        {t('brandDashboard.createButton')}
                                    </Link>
                                </Button>
                             )}
                        </div>
                    )}
                 </div>
            </main>
        </div>
    );
}
