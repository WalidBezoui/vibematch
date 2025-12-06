
'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, collectionGroup, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, CheckCircle, Trash2, Users, Hourglass, MessageSquare, Megaphone, FileVideo, ArrowLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { useNicheTranslation } from '@/hooks/use-niche-translation';

const CampaignCardSkeleton = () => (
    <Card className="flex flex-col">
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent className="flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-2" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
);


export default function DiscoverPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { t, dir } = useLanguage();
    const { getNicheLabel } = useNicheTranslation();
    const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

    // Fetch all open campaigns
    const campaignsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'campaigns'), where('status', '==', 'OPEN_FOR_APPLICATIONS')) : null,
        [firestore]
    );
    const { data: campaigns, isLoading: campaignsLoading, mutate: mutateCampaigns } = useCollection(campaignsQuery);
    
    // Fetch all applications for the current user
    const applicationsQuery = useMemoFirebase(
      () => user && firestore ? query(collectionGroup(firestore, 'applications'), where('creatorId', '==', user.uid)) : null,
      [user, firestore]
    );
    const { data: userApplications, isLoading: applicationsLoading, mutate: mutateApplications } = useCollection(applicationsQuery);

    // Fetch all conversations for the current user
    const conversationsQuery = useMemoFirebase(
        () => user && firestore ? query(collection(firestore, 'conversations'), where('creator_id', '==', user.uid)) : null,
        [user, firestore]
    );
    const { data: conversations, isLoading: conversationsLoading } = useCollection(conversationsQuery);

    const handleWithdrawApplication = async (campaignId: string) => {
        if (!firestore || !userApplications) return;
        
        const application = userApplications.find(app => app.campaignId === campaignId);
        if (!application) return;

        const applicationRef = doc(firestore, 'campaigns', campaignId, 'applications', application.id);
        
        try {
            await deleteDoc(applicationRef);
            toast({
                title: t('creatorDashboard.deleteToast.successTitle'),
                description: t('creatorDashboard.deleteToast.successDescription'),
            });
            // Optimistically update the UI by removing the application locally
            mutateApplications(prev => prev ? prev.filter(app => app.id !== application.id) : null);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Could not withdraw application: ${error.message}`,
            });
        }
    };
    
    const isLoading = campaignsLoading || applicationsLoading || conversationsLoading;


    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="flex-1 px-4 md:px-10 lg:px-20 py-10 md:py-16 hero-bg">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                           {t('discoverCampaigns.title')}
                        </h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl text-foreground/60">
                            {t('discoverCampaigns.description')}
                        </p>
                    </div>

                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           <CampaignCardSkeleton />
                           <CampaignCardSkeleton />
                           <CampaignCardSkeleton />
                        </div>
                    )}
                    
                    {!isLoading && campaigns && campaigns.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.map(campaign => {
                                const conversation = conversations?.find(convo => convo.campaign_id === campaign.id);
                                const application = userApplications?.find(app => app.campaignId === campaign.id);
                                const isFull = (campaign.creatorIds?.length || 0) >= (campaign.numberOfCreators || 1);

                                let status: 'new' | 'applied' | 'in_discussion' = 'new';
                                if (conversation) {
                                    status = 'in_discussion';
                                } else if (application) {
                                    status = 'applied';
                                }
                                
                                const isHighlighted = status === 'in_discussion';
                                const campaignType = campaign.campaignType || 'influence';
                                const typeInfo = {
                                    influence: { 
                                        badgeText: t('campaignTypes.influence.badge'), 
                                        badgeIcon: Megaphone,
                                        badgeClass: "bg-teal-100 text-teal-800 border-teal-200" 
                                    },
                                    ugc: { 
                                        badgeText: t('campaignTypes.ugc.badge'),
                                        badgeIcon: FileVideo,
                                        badgeClass: "bg-sky-100 text-sky-800 border-sky-200" 
                                    },
                                };
                                const TypeIcon = typeInfo[campaignType].badgeIcon;


                                return (
                                    <Card key={campaign.id} className={cn("flex flex-col hover:shadow-lg transition-shadow", isHighlighted && "border-primary/50 shadow-primary/10")}>
                                        <CardHeader>
                                            <Badge variant="secondary" className={cn("whitespace-nowrap text-xs w-fit mb-2", typeInfo[campaignType].badgeClass)}>
                                                <TypeIcon className="mr-1.5 h-3 w-3" />
                                                {typeInfo[campaignType].badgeText}
                                            </Badge>
                                            <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
                                            {campaign.tags && campaign.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {campaign.tags.slice(0, 3).map((tag: string) => (
                                                        <Badge key={tag} variant="secondary">{getNicheLabel(tag)}</Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </CardHeader>
                                        <CardContent className="flex-grow space-y-4">
                                            <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">
                                                {campaign.campaignBrief}
                                            </p>
                                            <div>
                                                <Badge variant="outline">{t('discoverCampaigns.budget')}</Badge>
                                                <p className="font-bold text-lg gradient-text mt-1">{campaign.budget} {t('currency')}</p>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex-col items-stretch gap-2">
                                            {status === 'in_discussion' ? (
                                                <Button asChild className="w-full">
                                                    <Link href={`/chat?id=${conversation.id}`}>
                                                        {t('creatorDashboard.actions.chat')} <Arrow className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                                                    </Link>
                                                </Button>
                                            ) : status === 'applied' ? (
                                                <>
                                                    <Button disabled className="w-full bg-green-600 hover:bg-green-600">
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        {t('discoverCampaigns.applied')}
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                                                <Trash2 className="mr-2 h-3 w-3" />
                                                                {t('creatorDashboard.actions.withdraw')}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>{t('creatorDashboard.deleteDialog.title')}</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {t('creatorDashboard.deleteDialog.description', { campaignTitle: campaign.title })}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>{t('brandDashboard.deleteDialog.cancel')}</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleWithdrawApplication(campaign.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                    {t('creatorDashboard.deleteDialog.confirm')}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            ) : isFull ? (
                                                <Button disabled className="w-full">
                                                    {t('discoverCampaigns.full')}
                                                </Button>
                                            ) : (
                                                <Button asChild className="w-full">
                                                    <Link href={`/campaigns/${campaign.id}`}>
                                                        {t('discoverCampaigns.viewAndApply')}
                                                        <Arrow className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                        </div>
                    )}

                     {!isLoading && (!campaigns || campaigns.length === 0) && (
                        <div className="text-center py-24 border-2 border-dashed rounded-lg">
                            <h2 className="text-2xl font-semibold">{t('discoverCampaigns.noCampaigns.title')}</h2>
                            <p className="text-muted-foreground mt-2">{t('discoverCampaigns.noCampaigns.description')}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
