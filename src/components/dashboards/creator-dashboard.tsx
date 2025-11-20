'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase, useUserProfile } from '@/firebase';
import Link from 'next/link';
import { collection, query, where, getDocs, collectionGroup, documentId, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Compass, Hourglass, Activity, FileText, CircleDollarSign, Trash2, Wallet, Lock, Eye, Briefcase, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

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

const StatCard = ({ title, value, icon, isLoading, color = 'text-foreground', subtitle }: { title: string; value: string | number; icon: React.ReactNode, isLoading: boolean, color?: string, subtitle?: string }) => (
    <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <>
                    <Skeleton className="h-8 w-1/2" />
                    {subtitle && <Skeleton className="h-4 w-3/4 mt-2" />}
                </>
            ) : (
                <>
                    <div className={cn("text-2xl font-bold", color)}>{value}</div>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </>
            )}
        </CardContent>
    </Card>
);


const ProfileImpactCard = ({ isLoading }: { isLoading: boolean }) => {
    const { userProfile } = useUserProfile();

    const { percentage, nextStepText } = useMemo(() => {
        if (!userProfile) return { percentage: 0, nextStepText: "Complete your profile" };
        
        const fields = [
            { key: 'photoURL', present: !!userProfile.photoURL, text: "Add a profile picture" },
            { key: 'displayName', present: !!userProfile.displayName, text: "Add your display name" },
            { key: 'location', present: !!userProfile.location, text: "Add your location" },
            { key: 'tags', present: userProfile.tags && userProfile.tags.length > 0, text: "Choose at least one tag" },
            { key: 'bio', present: !!userProfile.bio, text: "Write a bio to tell your story" },
        ];

        const completedFields = fields.filter(f => f.present).length;
        const totalFields = fields.length;
        
        const percentage = Math.round((completedFields / totalFields) * 100);

        const firstIncompleteStep = fields.find(f => !f.present);
        const nextStepText = firstIncompleteStep ? firstIncompleteStep.text : "Add portfolio projects to reach the top 10%";

        return { percentage, nextStepText };
    }, [userProfile]);

    const circumference = 2 * Math.PI * 18;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

     return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Profile Impact (Quality)</CardTitle>
                 <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-1/2" />
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                            <svg className="w-full h-full" viewBox="0 0 40 40">
                                <circle className="text-muted/20" strokeWidth="4" stroke="currentColor" fill="transparent" r="18" cx="20" cy="20" />
                                <circle className="text-primary" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="18" cx="20" cy="20" transform="rotate(-90 20 20)" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{percentage}%</span>
                        </div>
                        <div className="flex-1">
                             <div className="font-bold text-lg">Profile Score</div>
                             <p className="text-xs text-muted-foreground">{nextStepText}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


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
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [matchingJobsCount, setMatchingJobsCount] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  const [stats, setStats] = useState({ escrow: 0, wallet: 1200 });
  const [userApplications, setUserApplications] = useState<Map<string, string>>(new Map());

  // Fetch active campaigns (where creator is assigned)
  const activeCampaignsQuery = useMemoFirebase(
    () => user && firestore ? query(
        collection(firestore, 'campaigns'), 
        where('creatorIds', 'array-contains', user.uid)
    ) : null,
    [user, firestore]
  );
  const { data: activeCampaigns, isLoading: isLoadingActive } = useCollection(activeCampaignsQuery);
  
  // Fetch pending applications and their associated campaign data
  useEffect(() => {
    if (user && firestore) {
        setIsLoadingPending(true);
        const fetchPendingAndMatching = async () => {
            try {
                const allOpenCampaignsQuery = query(collection(firestore, 'campaigns'), where('status', '==', 'OPEN_FOR_APPLICATIONS'));
                const [appsSnapshot, openCampaignsSnapshot] = await Promise.all([
                    getDocs(query(collectionGroup(firestore, 'applications'), where('creatorId', '==', user.uid))),
                    getDocs(allOpenCampaignsQuery)
                ]);
                
                const appMap = new Map<string, string>();
                appsSnapshot.docs.forEach(doc => appMap.set(doc.data().campaignId, doc.id));
                setUserApplications(appMap);

                const openCampaignsData = openCampaignsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const appliedCampaignIds = Array.from(appMap.keys());
                const pendingData = openCampaignsData.filter(c => appliedCampaignIds.includes(c.id));
                setPendingCampaigns(pendingData);
                
                // Calculate matching jobs
                const creatorTags = userProfile?.tags || [];
                if (creatorTags.length > 0) {
                    const matching = openCampaignsData.filter(c => 
                        !appliedCampaignIds.includes(c.id) && c.tags?.some((tag: string) => creatorTags.includes(tag))
                    );
                    setMatchingJobsCount(matching.length);
                } else {
                    setMatchingJobsCount(openCampaignsData.length - appliedCampaignIds.length);
                }

                // Mock profile views
                setProfileViews(Math.floor(Math.random() * 20) + 5);

            } catch (error) {
                console.error("Error fetching creator data:", error);
                setPendingCampaigns([]);
                setMatchingJobsCount(0);
            } finally {
                setIsLoadingPending(false);
            }
        };

        fetchPendingAndMatching();
    }
  }, [user, firestore, userProfile]);
  
  // Calculate stats
  useEffect(() => {
    if (!isLoadingActive) {
        const escrow = activeCampaigns?.reduce((sum, c) => 
            (c.status === 'IN_PROGRESS' || c.status === 'DELIVERED') ? sum + c.budget : sum
        , 0) || 0;

        setStats(prev => ({ ...prev, escrow }));
    }
  }, [isLoadingActive, activeCampaigns]);

  const handleWithdrawApplication = async (campaignId: string) => {
    if (!firestore || !userApplications.has(campaignId)) return;
    
    const applicationId = userApplications.get(campaignId);
    if (!applicationId) return;

    const applicationRef = doc(firestore, 'campaigns', campaignId, 'applications', applicationId);
    
    try {
        await deleteDoc(applicationRef);
        toast({
            title: 'Application Withdrawn',
            description: 'You can apply again in the future if you change your mind.',
        });
        setPendingCampaigns(prev => prev.filter(c => c.id !== campaignId));
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: `Could not withdraw application: ${error.message}`,
        });
    }
};

  const isLoading = isLoadingActive || isLoadingPending;
  const hasActiveContracts = activeCampaigns && activeCampaigns.length > 0;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Creator Command Center</h1>
        <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
          <Link href="/discover">
            <Compass className="mr-2 h-5 w-5" />
            Discover Campaigns
          </Link>
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-3 mb-8">
            {hasActiveContracts ? (
                <StatCard isLoading={isLoading} title="Fonds Séquestrés (En cours)" value={`${stats.escrow.toLocaleString()} DH`} icon={<Lock className="h-4 w-4 text-muted-foreground" />} color="text-green-500" />
            ) : (
                <ProfileImpactCard isLoading={isLoading} />
            )}
            <StatCard isLoading={isLoading} title="Jobs Correspondants" value={matchingJobsCount} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} subtitle={`${matchingJobsCount} campagnes cherchent votre profil.`} />
            <StatCard isLoading={isLoading} title="Vues du Profil (7j)" value={profileViews} icon={<Eye className="h-4 w-4 text-muted-foreground" />} subtitle={`${profileViews} marques ont vu votre carte.`} />
        </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Campaigns <Badge variant="secondary" className="ml-2">{activeCampaigns?.length || 0}</Badge></TabsTrigger>
            <TabsTrigger value="pending">Pending Applications <Badge variant="secondary" className="ml-2">{pendingCampaigns?.length || 0}</Badge></TabsTrigger>
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
                                <CardDescription className="gradient-text font-bold text-base">{campaign.budget} DH</CardDescription>
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
                                <CardDescription className="gradient-text font-bold text-base">{campaign.budget} DH</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4 flex-col items-stretch gap-2">
                                <Button asChild className="w-full" variant="outline">
                                  <Link href={`/campaigns/${campaign.id}`}>
                                    View Campaign
                                  </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
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
