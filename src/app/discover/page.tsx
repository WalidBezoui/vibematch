'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, collectionGroup, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, CheckCircle, Trash2 } from 'lucide-react';
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
            <Skeleton className="h-10 w-1/2" />
        </CardFooter>
    </Card>
);


export default function DiscoverPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [appliedCampaigns, setAppliedCampaigns] = useState<Map<string, string>>(new Map());

    // Fetch all open campaigns
    const campaignsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'campaigns'), where('status', '==', 'OPEN_FOR_APPLICATIONS')) : null,
        [firestore]
    );
    const { data: campaigns, isLoading } = useCollection(campaignsQuery);
    
    // Fetch all applications for the current user
    const applicationsQuery = useMemoFirebase(
      () => user && firestore ? query(collectionGroup(firestore, 'applications'), where('creatorId', '==', user.uid)) : null,
      [user, firestore]
    );
    const { data: userApplications } = useCollection(applicationsQuery);

    useEffect(() => {
        if (userApplications) {
            const map = new Map<string, string>();
            userApplications.forEach(app => {
                map.set(app.campaignId, app.id);
            });
            setAppliedCampaigns(map);
        }
    }, [userApplications]);

    const handleWithdrawApplication = async (campaignId: string) => {
        if (!firestore || !appliedCampaigns.has(campaignId)) return;
        
        const applicationId = appliedCampaigns.get(campaignId);
        if (!applicationId) return;

        const applicationRef = doc(firestore, 'campaigns', campaignId, 'applications', applicationId);
        
        try {
            await deleteDoc(applicationRef);
            toast({
                title: 'Application Withdrawn',
                description: 'You can apply again in the future if you change your mind.',
            });
            // The local state will update automatically thanks to the real-time listener
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Could not withdraw application: ${error.message}`,
            });
        }
    };


    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="flex-1 px-4 md:px-10 lg:px-20 py-10 md:py-16 hero-bg">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                           Discover Campaigns
                        </h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl text-foreground/60">
                            Browse and apply for exclusive campaigns from top Moroccan brands.
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
                                const isApplied = appliedCampaigns.has(campaign.id);
                                return (
                                    <Card key={campaign.id} className="flex flex-col hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle>{campaign.title}</CardTitle>
                                            <CardDescription>A new opportunity awaits</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow space-y-4">
                                            <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">
                                                {campaign.campaignBrief}
                                            </p>
                                            <div>
                                                <Badge variant="secondary">Budget</Badge>
                                                <p className="font-bold text-lg gradient-text mt-1">{campaign.price} DH</p>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex-col items-stretch gap-2">
                                            {isApplied ? (
                                                <>
                                                    <Button disabled className="w-full bg-green-600 hover:bg-green-600">
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Application Sent
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                                                <Trash2 className="mr-2 h-3 w-3" />
                                                                Withdraw Application
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will remove your application for "{campaign.title}". The brand will no longer be able to see it. You can apply again later if the campaign is still open.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleWithdrawApplication(campaign.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                    Yes, Withdraw
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                </>
                                            ) : (
                                                <Button asChild className="w-full">
                                                    <Link href={`/campaigns/${campaign.id}/apply`}>
                                                        View & Apply
                                                        <ArrowRight className="ml-2 h-4 w-4" />
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
                            <h2 className="text-2xl font-semibold">No Open Campaigns Right Now</h2>
                            <p className="text-muted-foreground mt-2">Check back soon for new opportunities!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
