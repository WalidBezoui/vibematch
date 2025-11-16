'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import Link from 'next/link';
import { collection, query, where, getDocs, collectionGroup, documentId } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Compass, Hourglass, Activity, FileText, CircleDollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

const statusStyles: { [key: string]: string } = {
    PENDING_CREATOR_ACCEPTANCE: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    DELIVERED: 'bg-purple-100 text-purple-800 border-purple-200',
    COMPLETED: 'bg-gray-200 text-gray-800 border-gray-300',
    REJECTED_BY_CREATOR: 'bg-red-100 text-red-800 border-red-200',
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
);

const StatCard = ({ title, value, icon, isLoading }: { title: string; value: string | number; icon: React.ReactNode, isLoading: boolean }) => (
    <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
        </CardContent>
    </Card>
);


const EmptyState = ({title, description, buttonText, buttonLink, icon: Icon}: any) => (
    <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20 mt-8">
        <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
            <Icon className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">{description}</p>
         <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
            <Link href={buttonLink}>
                {buttonText}
            </Link>
        </Button>
    </div>
);

export default function CreatorDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  const [stats, setStats] = useState({ activeCollaborations: 0, pendingApplications: 0, totalEarnings: 0 });

  // Fetch active campaigns (where creator is assigned)
  const activeCampaignsQuery = useMemoFirebase(
    () => user && firestore ? query(
        collection(firestore, 'campaigns'), 
        where('creatorId', '==', user.uid),
        where('status', '!=', 'COMPLETED'),
        where('status', '!=', 'REJECTED_BY_CREATOR'),
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
                // 1. Find all application documents by this creator
                const applicationsQuery = query(collectionGroup(firestore, 'applications'), where('creatorId', '==', user.uid));
                const appsSnapshot = await getDocs(applicationsQuery);
                const appliedCampaignIds = appsSnapshot.docs.map(doc => doc.data().campaignId);

                if (appliedCampaignIds.length > 0) {
                    // 2. Fetch the campaign details for those applications
                    // We only want to show campaigns that are still open for applications
                    const campaignsQuery = query(
                        collection(firestore, 'campaigns'), 
                        where(documentId(), 'in', appliedCampaignIds),
                        where('status', '==', 'OPEN_FOR_APPLICATIONS')
                    );
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
  
  // Calculate stats
  useEffect(() => {
    if (!isLoadingActive && !isLoadingPending) {
        const activeCount = activeCampaigns?.length || 0;
        const pendingCount = pendingCampaigns?.length || 0;
        
        // This is a placeholder for total earnings. In a real app you'd query completed campaigns.
        const totalEarnings = activeCampaigns?.reduce((sum, c) => c.status === 'IN_PROGRESS' || c.status === 'DELIVERED' ? sum + c.price : sum, 0) || 0;

        setStats({
            activeCollaborations: activeCount,
            pendingApplications: pendingCount,
            totalEarnings: totalEarnings
        });
    }
  }, [isLoadingActive, isLoadingPending, activeCampaigns, pendingCampaigns]);


  const isLoading = isLoadingActive || isLoadingPending;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Creator Dashboard</h1>
        <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
          <Link href="/discover">
            <Compass className="mr-2 h-5 w-5" />
            Discover Campaigns
          </Link>
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-3 mb-8">
            <StatCard isLoading={isLoading} title="Active Collaborations" value={stats.activeCollaborations} icon={<Activity className="h-4 w-4 text-muted-foreground" />} />
            <StatCard isLoading={isLoading} title="Pending Applications" value={stats.pendingApplications} icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
            <StatCard isLoading={isLoading} title="Potential Earnings" value={`${stats.totalEarnings.toLocaleString()} DH`} icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />} />
        </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Campaigns <Badge variant="secondary" className="ml-2">{stats.activeCollaborations}</Badge></TabsTrigger>
            <TabsTrigger value="pending">Pending Applications <Badge variant="secondary" className="ml-2">{stats.pendingApplications}</Badge></TabsTrigger>
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
                        <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-lg font-bold line-clamp-1">{campaign.title}</CardTitle>
                                     {campaign.status && (
                                        <Badge className={cn('whitespace-nowrap text-xs', statusStyles[campaign.status])}>
                                            {campaign.status.replace(/_/g, ' ')}
                                        </Badge>
                                     )}
                                </div>
                                <CardDescription className="gradient-text font-bold text-base">{campaign.price} DH</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4">
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
                    title="No active campaigns yet"
                    description="Campaigns you are accepted for will appear here. Time to find your next collaboration!"
                    buttonText="Find Your First Campaign"
                    buttonLink="/discover"
                    icon={Activity}
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
                        <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-lg font-bold line-clamp-1">{campaign.title}</CardTitle>
                                    <Badge variant="secondary" className="border-yellow-200 bg-yellow-100 text-yellow-800">
                                        <Hourglass className="mr-1 h-3 w-3" />
                                        Application Sent
                                    </Badge>
                                </div>
                                <CardDescription className="gradient-text font-bold text-base">{campaign.price} DH</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4">
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
                    title="You haven't applied to any campaigns"
                    description="Browse open campaigns from top brands and apply to start collaborating."
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
