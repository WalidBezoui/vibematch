'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Compass } from 'lucide-react';

const statusStyles: { [key: string]: string } = {
    PENDING_CREATOR_ACCEPTANCE: 'bg-blue-100 text-blue-800',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    REJECTED_BY_CREATOR: 'bg-red-100 text-red-800',
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
        <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
)

export default function CreatorDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const campaignsQuery = useMemoFirebase(
    () => user && firestore ? query(
        collection(firestore, 'campaigns'), 
        where('creatorId', '==', user.uid)
    ) : null,
    [user, firestore]
  );
  
  const { data: activeCampaigns, isLoading } = useCollection(campaignsQuery);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Campaigns</h1>
        <Button asChild>
          <Link href="/discover">
            <Compass className="mr-2 h-4 w-4" />
            Discover New Campaigns
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
          {activeCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{campaign.title}</CardTitle>
                             {campaign.status && (
                                <Badge className={cn('whitespace-nowrap', statusStyles[campaign.status])}>
                                    {campaign.status.replace(/_/g, ' ')}
                                </Badge>
                             )}
                        </div>
                        <CardDescription>Collaboration</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
                        <p className="text-lg font-bold mt-4 gradient-text">{campaign.price} DH</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                          <Link href={`/campaigns/${campaign.id}`}>
                            View Details
                          </Link>
                        </Button>
                    </CardFooter>
                </Card>
            )
          )}
        </div>
      )}

      {!isLoading && (!activeCampaigns || activeCampaigns.length === 0) && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No active campaigns yet.</h2>
            <p className="text-muted-foreground mt-2">When you apply for or are accepted to a campaign, it will appear here.</p>
             <Button asChild className="mt-6">
                <Link href="/discover">
                    <Compass className="mr-2 h-4 w-4" />
                    Find Your First Campaign
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
