'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { PlusCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const statusStyles: { [key: string]: string } = {
    OPEN_FOR_APPLICATIONS: 'bg-green-100 text-green-800',
    PENDING_SELECTION: 'bg-yellow-100 text-yellow-800',
    PENDING_CREATOR_ACCEPTANCE: 'bg-blue-100 text-blue-800',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
};

const CampaignCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-2/3 mt-2" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-8 w-1/2" />
        </CardFooter>
    </Card>
)

const CampaignCard = ({ campaign }: { campaign: any }) => {
    const firestore = useFirestore();
    const [applicationCount, setApplicationCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            if (firestore && campaign.id) {
                const applicationsRef = collection(firestore, 'campaigns', campaign.id, 'applications');
                const snapshot = await getCountFromServer(applicationsRef);
                setApplicationCount(snapshot.data().count);
            }
        };
        fetchCount();
    }, [firestore, campaign.id]);

    return (
        <Card className="hover:shadow-md transition-shadow flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <Badge className={cn('whitespace-nowrap', statusStyles[campaign.status])}>
                        {campaign.status.replace(/_/g, ' ')}
                    </Badge>
                </div>
                <CardDescription>{campaign.price} DH</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
            </CardContent>
            <CardFooter>
                {campaign.status === 'OPEN_FOR_APPLICATIONS' || campaign.status === 'PENDING_SELECTION' ? (
                     <Button asChild variant="secondary" className="w-full">
                        <Link href={`/campaigns/${campaign.id}/manage`}>
                            <Users className="mr-2 h-4 w-4" />
                            Manage Applications ({applicationCount})
                        </Link>
                    </Button>
                ) : (
                    <Button asChild className="w-full">
                        <Link href={`/campaigns/${campaign.id}`}>View Campaign</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};


export default function BrandDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const campaignsQuery = useMemoFirebase(
    () => user && firestore ? query(collection(firestore, 'campaigns'), where('brandId', '==', user.uid)) : null,
    [user, firestore]
  );
  const { data: campaigns, isLoading } = useCollection(campaignsQuery);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Campaigns</h1>
        <Button asChild>
          <Link href="/campaigns/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Campaign
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
        </div>
      )}

      {!isLoading && campaigns && campaigns.length > 0 && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard campaign={campaign} key={campaign.id} />
          ))}
        </div>
      )}

      {!isLoading && (!campaigns || campaigns.length === 0) && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No active campaigns yet.</h2>
            <p className="text-muted-foreground mt-2">Ready to find your next collaboration?</p>
            <Button asChild className="mt-6">
                <Link href="/campaigns/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
