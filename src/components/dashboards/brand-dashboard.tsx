'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { PlusCircle, Users, Activity, FileText, CircleDollarSign } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getCountFromServer, getDocs } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const statusStyles: { [key: string]: string } = {
    OPEN_FOR_APPLICATIONS: 'bg-green-100 text-green-800 border-green-200',
    PENDING_SELECTION: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PENDING_CREATOR_ACCEPTANCE: 'bg-blue-100 text-blue-800 border-blue-200',
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

const CampaignCard = ({ campaign }: { campaign: any }) => {
    const firestore = useFirestore();
    const [applicationCount, setApplicationCount] = useState(0);
    const [isLoadingCount, setIsLoadingCount] = useState(true);

    useEffect(() => {
        const fetchCount = async () => {
            if (firestore && campaign.id) {
                setIsLoadingCount(true);
                const applicationsRef = collection(firestore, 'campaigns', campaign.id, 'applications');
                const snapshot = await getCountFromServer(applicationsRef);
                setApplicationCount(snapshot.data().count);
                setIsLoadingCount(false);
            }
        };
        fetchCount();
    }, [firestore, campaign.id]);

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-bold line-clamp-1">{campaign.title}</CardTitle>
                    <Badge className={cn('whitespace-nowrap text-xs', statusStyles[campaign.status])}>
                        {campaign.status.replace(/_/g, ' ')}
                    </Badge>
                </div>
                <CardDescription className="gradient-text font-bold text-base">{campaign.budget} DH</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {campaign.tags && campaign.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {campaign.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4">
                {campaign.status === 'OPEN_FOR_APPLICATIONS' || campaign.status === 'PENDING_SELECTION' ? (
                     <Button asChild variant="secondary" className="w-full">
                        <Link href={`/campaigns/${campaign.id}/manage`}>
                            <Users className="mr-2 h-4 w-4" />
                            Manage Applications 
                            {isLoadingCount ? <Skeleton className="h-5 w-5 rounded-full ml-2" /> : <Badge className="ml-2 bg-primary text-primary-foreground">{applicationCount}</Badge>}
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
  const [stats, setStats] = useState({ activeCampaigns: 0, totalApplications: 0, totalBudget: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const campaignsQuery = useMemoFirebase(
    () => user && firestore ? query(collection(firestore, 'campaigns'), where('brandId', '==', user.uid)) : null,
    [user, firestore]
  );
  const { data: campaigns, isLoading } = useCollection(campaignsQuery);
  
  useEffect(() => {
    if (campaigns && firestore && user) {
        const calculateStats = async () => {
            setIsStatsLoading(true);
            let totalApplications = 0;
            let totalBudget = 0;
            const activeCampaigns = campaigns.filter(c => c.status !== 'COMPLETED').length;

            const applicationPromises = campaigns.map(c => 
                getDocs(query(collection(firestore, 'campaigns', c.id, 'applications')))
            );

            const allApplicationsSnapshots = await Promise.all(applicationPromises);
            allApplicationsSnapshots.forEach(snapshot => totalApplications += snapshot.size);

            totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);

            setStats({ activeCampaigns, totalApplications, totalBudget });
            setIsStatsLoading(false);
        };
        calculateStats();
    } else if (!isLoading) {
        setIsStatsLoading(false);
    }
  }, [campaigns, firestore, user, isLoading]);


  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Brand Dashboard</h1>
        <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
          <Link href="/campaigns/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Campaign
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard isLoading={isStatsLoading} title="Active Campaigns" value={stats.activeCampaigns} icon={<Activity className="h-4 w-4 text-muted-foreground" />} />
        <StatCard isLoading={isStatsLoading} title="Total Applications" value={stats.totalApplications} icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
        <StatCard isLoading={isStatsLoading} title="Total Budget Deployed" value={`${stats.totalBudget.toLocaleString()} DH`} icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />} />
      </div>


      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
        </div>
      )}

      {!isLoading && campaigns && campaigns.length > 0 ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard campaign={campaign} key={campaign.id} />
          ))}
        </div>
      ) : null}

      {!isLoading && (!campaigns || campaigns.length === 0) && (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20 mt-8">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
              <PlusCircle className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold">Launch Your First Campaign</h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">It's time to connect with amazing creators. Post a campaign to start receiving applications.</p>
            <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
                <Link href="/campaigns/create">
                    Create Campaign
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
