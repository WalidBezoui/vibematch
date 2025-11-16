'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import Link from 'next/link';
import { collection, query, where, getDocs, collectionGroup, documentId } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Compass, Hourglass } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

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

const EmptyState = ({title, description, buttonText, buttonLink, icon: Icon}: any) => (
    <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mt-6">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
         <Button asChild className="mt-6">
            <Link href={buttonLink}>
                <Compass className="mr-2 h-4 w-4" />
                {buttonText}
            </Link>
        </Button>
    </div>
)

export default function CreatorDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(true);

  // Fetch active campaigns (where creator is assigned)
  const activeCampaignsQuery = useMemoFirebase(
    () => user && firestore ? query(
        collection(firestore, 'campaigns'), 
        where('creatorId', '==', user.uid)
    ) : null,
    [user, firestore]
  );
  const { data: activeCampaigns, isLoading: isLoadingActive } = useCollection(activeCampaignsQuery);
  
  // Fetch pending applications
  useEffect(() => {
    if (user && firestore) {
        setIsLoadingPending(true);
        const fetchPendingApplications = async () => {
            try {
                // 1. Find all applications by this creator
                const applicationsQuery = query(collectionGroup(firestore, 'applications'), where('creatorId', '==', user.uid));
                const appsSnapshot = await getDocs(applicationsQuery);
                const appliedCampaignIds = appsSnapshot.docs.map(doc => doc.data().campaignId);

                if (appliedCampaignIds.length > 0) {
                    // 2. Fetch the campaign details for those applications
                    const campaignsQuery = query(collection(firestore, 'campaigns'), where(documentId(), 'in', appliedCampaignIds));
                    const campaignsSnapshot = await getDocs(campaignsQuery);
                    const campaignsData = campaignsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setPendingCampaigns(campaignsData);
                } else {
                    setPendingCampaigns([]);
                }
            } catch (error) {
                console.error("Error fetching pending campaigns:", error);
                setPendingCampaigns([]);
            } finally {
                setIsLoadingPending(false);
            }
        };

        fetchPendingApplications();
    }
  }, [user, firestore]);

  const isLoading = isLoadingActive || isLoadingPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Dashboard</h1>
        <Button asChild>
          <Link href="/discover">
            <Compass className="mr-2 h-4 w-4" />
            Discover New Campaigns
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Campaigns</TabsTrigger>
            <TabsTrigger value="pending">Pending Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
            {isLoadingActive ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    <CampaignCardSkeleton />
                    <CampaignCardSkeleton />
                </div>
            ) : activeCampaigns && activeCampaigns.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
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
            ) : (
                <EmptyState 
                    title="No active campaigns yet."
                    description="When you are accepted to a campaign, it will appear here."
                    buttonText="Find Your First Campaign"
                    buttonLink="/discover"
                    icon={Compass}
                />
            )}
        </TabsContent>
        <TabsContent value="pending">
             {isLoadingPending ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    <CampaignCardSkeleton />
                    <CampaignCardSkeleton />
                </div>
            ) : pendingCampaigns && pendingCampaigns.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {pendingCampaigns.map((campaign) => (
                        <Card key={campaign.id} className="hover:shadow-md transition-shadow flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                                    <Badge variant="secondary">
                                        <Hourglass className="mr-2 h-3 w-3" />
                                        Application Sent
                                    </Badge>
                                </div>
                                <CardDescription>Collaboration Opportunity</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
                                <p className="text-lg font-bold mt-4 gradient-text">{campaign.price} DH</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" variant="outline">
                                  <Link href={`/campaigns/${campaign.id}`}>
                                    View Campaign
                                  </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                  )}
                </div>
            ) : (
                <EmptyState 
                    title="You haven't applied to any campaigns."
                    description="Browse open campaigns and apply to start collaborating."
                    buttonText="Discover Campaigns"
                    buttonLink="/discover"
                    icon={Compass}
                />
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
