
'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useUser, useMemoFirebase, useUserProfile } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Bell, MessageSquare, PlusCircle, Sparkles, CheckCircle, Handshake } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

type NotificationItem = {
  id: string; 
  type: 'NEW_APPLICATION' | 'CAMPAIGN_UPDATE' | 'DISCUSSION_OPENED';
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
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-muted/60">
                               <Avatar className="h-10 w-10 border">
                                  <AvatarImage src={profile?.photoURL} alt={profile?.name} />
                                  <AvatarFallback>{profile?.name?.[0]}</AvatarFallback>
                              </Avatar>
                            </div>
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

    if (notification.type === 'DISCUSSION_OPENED') {
        const { brandProfile, title, conversationId } = notification.data;
        return (
             <Card className="transition-all hover:shadow-md border-blue-500/30 bg-blue-500/5">
                <CardHeader className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 cursor-pointer">
                           <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-blue-100 text-blue-800")}>
                                <Handshake className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">
                                    <span className="font-semibold">{brandProfile?.name}</span> opened a discussion for the campaign <span className="font-semibold">"{title}"</span>.
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {notification.createdAt ? new Date(notification.createdAt.seconds * 1000).toLocaleString() : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center ml-auto sm:ml-0 pl-16 sm:pl-0">
                            <Button asChild variant="default" size="sm">
                                <Link href={`/chat?id=${conversationId}`}>
                                    Open Chat <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        )
    }

    if (notification.type === 'CAMPAIGN_UPDATE') {
         const { brandProfile, title, id: campaignId, status } = notification.data;
         const isOffer = status === 'OFFER_PENDING';
         const isStarted = status === 'IN_PROGRESS';

         let Icon, iconBg, text;

        if (isOffer) {
            Icon = Sparkles;
            iconBg = 'gradient-bg text-black';
            text = <>Offer from <span className="font-semibold">{brandProfile?.name}</span> for "{title}"</>;
        } else { // Assuming IN_PROGRESS or other active statuses
            Icon = CheckCircle;
            iconBg = 'bg-green-100 text-green-800';
            text = <>Campaign <span className="font-semibold">"{title}"</span> is now active!</>;
        }

         return (
            <Card className="transition-all hover:shadow-md border-primary/20 bg-primary/5">
                <CardHeader className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 cursor-pointer">
                           <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/30", iconBg)}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">
                                    {text}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {notification.createdAt ? new Date(notification.createdAt.seconds * 1000).toLocaleString() : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center ml-auto sm:ml-0 pl-16 sm:pl-0">
                            <Button asChild variant="default" size="sm">
                                <Link href={`/campaigns/${campaignId}`}>
                                    {isOffer ? "Review & Accept" : "View Campaign"} <ArrowRight className="h-4 w-4 ml-2" />
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
    
    const { user, isUserLoading } = useUser();
    const { userProfile, isLoading: isProfileLoading } = useUserProfile();
    const firestore = useFirestore();
    const router = useRouter();
    const { t } = useLanguage();

    const isBrand = userProfile?.role === 'brand';

    const brandCampaignsQuery = useMemoFirebase(
        () => (isBrand && user && firestore) ? query(collection(firestore, 'campaigns'), where('brandId', '==', user.uid)) : null,
        [user, firestore, isBrand]
    );
    const { data: brandCampaigns, isLoading: isLoadingCampaigns } = useCollection(brandCampaignsQuery);

    const creatorInvolvedCampaignsQuery = useMemoFirebase(
        () => (!isBrand && user && firestore) ? query(collection(firestore, 'campaigns'), where('creatorIds', 'array-contains', user.uid)) : null,
        [user, firestore, isBrand]
    );
    const { data: creatorInvolvedCampaigns, isLoading: isLoadingCreatorCampaigns } = useCollection(creatorInvolvedCampaignsQuery);

    const creatorConversationsQuery = useMemoFirebase(
        () => (!isBrand && user && firestore) ? query(collection(firestore, 'conversations'), where('creator_id', '==', user.uid), where('status', '==', 'NEGOTIATION')) : null,
        [user, firestore, isBrand]
    );
    const { data: creatorConversations, isLoading: isLoadingCreatorConversations } = useCollection(creatorConversationsQuery);


    useEffect(() => {
        const processNotifications = async () => {
             if (isUserLoading || isProfileLoading || !firestore || !user || !userProfile) return;

             const allNotifications: NotificationItem[] = [];

             if (isBrand) {
                if (isLoadingCampaigns || !brandCampaigns) return;
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
                                    campaignTitle: campaign.title || 'Unknown Campaign',
                                }
                            });
                        }
                    }
                }
             } else { // Logic for Creators
                 if (isLoadingCreatorCampaigns || isLoadingCreatorConversations || !creatorInvolvedCampaigns || !creatorConversations) return;
                 
                 // Notifications for campaign status updates (offers, started, etc.)
                 for(const campaign of creatorInvolvedCampaigns) {
                    if (['OFFER_PENDING', 'IN_PROGRESS'].includes(campaign.status)) {
                         const brandProfileRef = doc(firestore, 'users', campaign.brandId);
                         const brandProfileSnap = await getDoc(brandProfileRef);
                         allNotifications.push({
                             type: 'CAMPAIGN_UPDATE',
                             id: campaign.id,
                             createdAt: campaign.updatedAt,
                             data: {
                                 ...campaign,
                                 brandProfile: brandProfileSnap.exists() ? brandProfileSnap.data() : null
                             }
                         })
                    }
                }

                // Notifications for new discussions
                for (const convo of creatorConversations) {
                    const campaignRef = doc(firestore, 'campaigns', convo.campaign_id);
                    const brandRef = doc(firestore, 'users', convo.brand_id);
                    const [campaignSnap, brandSnap] = await Promise.all([getDoc(campaignRef), getDoc(brandRef)]);
                    
                    allNotifications.push({
                        type: 'DISCUSSION_OPENED',
                        id: convo.id,
                        createdAt: convo.updatedAt,
                        data: {
                            ...convo,
                            title: campaignSnap.exists() ? campaignSnap.data().title : "a campaign",
                            brandProfile: brandSnap.exists() ? brandSnap.data() : null,
                            conversationId: convo.id,
                        }
                    });
                }
             }

             setNotifications(allNotifications.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds));
        }
        processNotifications();

    }, [brandCampaigns, creatorInvolvedCampaigns, creatorConversations, firestore, user, userProfile, isUserLoading, isProfileLoading, isBrand, isLoadingCampaigns, isLoadingCreatorCampaigns, isLoadingCreatorConversations]);

    const isLoading = isUserLoading || isProfileLoading || (isBrand && isLoadingCampaigns) || (!isBrand && (isLoadingCreatorCampaigns || isLoadingCreatorConversations));

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);
    
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

                    {isLoading && (
                        <div className="space-y-4">
                            <NotificationCardSkeleton />
                            <NotificationCardSkeleton />
                            <NotificationCardSkeleton />
                        </div>
                    )}

                    {!isLoading && notifications.length > 0 ? (
                        <div className="space-y-4">
                            {notifications.map(notification => (
                                <NotificationCard key={`${notification.type}-${notification.id}`} notification={notification} />
                            ))}
                        </div>
                    ) : null}

                     {!isLoading && notifications.length === 0 && (
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
