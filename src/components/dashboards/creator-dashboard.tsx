'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import Link from 'next/link';
import { collection, query, where, or } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Compass } from 'lucide-react';

const statusStyles: { [key: string]: string } = {
    OPEN_FOR_APPLICATIONS: 'bg-green-100 text-green-800',
    PENDING_SELECTION: 'bg-yellow-100 text-yellow-800',
    PENDING_CREATOR_ACCEPTANCE: 'bg-blue-100 text-blue-800',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    APPLIED: 'bg-gray-100 text-gray-800', // Custom status for UI
};

const CampaignCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
        </CardContent>
    </Card>
)

export default function CreatorDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const campaignsQuery = useMemoFirebase(
    () => user && firestore ? query(
        collection(firestore, 'campaigns'), 
        or(
            where('creatorId', '==', user.uid),
            where('status', '==', 'PENDING_CREATOR_ACCEPTANCE') // Needs more specific query if we only want ones user is selected for
        )
    ) : null,
    [user, firestore]
  );

  const applicationsQuery = useMemoFirebase(
    () => user && firestore ? query(collection(firestore, 'campaigns'), where('applications', 'array-contains', user.uid)) : null,
    // This is a simplified query. A real implementation would need a subcollection query, 
    // which is more complex to set up with hooks for a list.
    // For now, we'll focus on campaigns the creator has been assigned to.
    [user, firestore]
  );
  
  const { data: activeCampaigns, isLoading: isLoadingCampaigns } = useCollection(campaignsQuery);
  const { data: appliedCampaigns, isLoading: isLoadingApplied } = useCollection(applicationsQuery); // This won't work as intended without more complex logic

  const isLoading = isLoadingCampaigns; // || isLoadingApplied;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Campaigns</h1>
        <Button asChild>
          <Link href="/discover">
            <Compass className="mr-2 h-4 w-4" />
            Discover Campaigns
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
        </div>
      )}

      {!isLoading && activeCampaigns && activeCampaigns.length > 0 && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeCampaigns.map((campaign) => {
            // Creators should only see campaigns they are assigned to or have an action on
            if(campaign.creatorId !== user?.uid && campaign.status !== 'PENDING_CREATOR_ACCEPTANCE') return null;

            return (
                <Link href={`/campaigns/${campaign.id}`} key={campaign.id}>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{campaign.title}</CardTitle>
                                <Badge className={cn('whitespace-nowrap', statusStyles[campaign.status])}>
                                    {campaign.status.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                            <CardDescription>From a Brand</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{campaign.campaignBrief}</p>
                            <p className="text-lg font-bold mt-4">{campaign.price} DH</p>
                        </CardContent>
                    </Card>
                </Link>
            )
          })}
        </div>
      )}

      {!isLoading && (!activeCampaigns || activeCampaigns.length === 0) && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No active campaigns yet.</h2>
            <p className="text-muted-foreground mt-2">When you apply for or are accepted to a campaign, it will appear here.</p>
             <Button asChild className="mt-6">
                <Link href="/discover">
                    <Compass className="mr-2 h-4 w-4" />
                    Discover New Campaigns
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
