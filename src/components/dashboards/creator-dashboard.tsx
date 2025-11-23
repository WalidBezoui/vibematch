

'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase, useUserProfile } from '@/firebase';
import Link from 'next/link';
import { collection, query, where, getDocs, collectionGroup, documentId, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Compass, Hourglass, Activity, ArrowRight, Wallet, Lock, Eye, Briefcase, UserCheck, Lightbulb, User, ImageIcon, MapPin, Tag, Type, Trash2, MessageSquare } from 'lucide-react';
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
import { useLanguage } from '@/context/language-context';


const statusStyles: { [key: string]: string } = {
    YOUR_ACCEPTANCE: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse',
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

const StatCard = ({ title, value, icon, isLoading, color = 'text-foreground', subtitle, cta }: { title: string; value: string | number; icon: React.ReactNode, isLoading: boolean, color?: string, subtitle?: string, cta?: { text: string; href: string; } }) => (
    <Card className="shadow-sm flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent className="flex-grow">
            {isLoading ? (
                <>
                    <Skeleton className="h-8 w-1/2" />
                    {subtitle && <Skeleton className="h-4 w-3/4 mt-2" />}
                </>
            ) : (
                <>
                    <div className={cn("text-3xl font-bold", color)}>{value}</div>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </>
            )}
        </CardContent>
        {cta && !isLoading && (
            <CardFooter className="pt-0">
                 <Button asChild size="sm" className="w-full gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                    <Link href={cta.href}>
                        {cta.text}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        )}
    </Card>
);


const ProfileImpactCard = ({ isLoading }: { isLoading: boolean }) => {
    const { userProfile } = useUserProfile();
    const { t } = useLanguage();
    const [motivationalTip, setMotivationalTip] = useState('');

     useEffect(() => {
        const tips = t('creatorProfile.completionTips', { returnObjects: true }) as string[];
        if (tips && tips.length > 0) {
            const randomIndex = Math.floor(Math.random() * tips.length);
            setMotivationalTip(tips[randomIndex]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]);


    const { percentage, nextStepText } = useMemo(() => {
        if (!userProfile) return { percentage: 0, nextStepText: "Complete your profile" };
        
        let completedFields = 0;
        const totalFields = 5;
        let nextStep = "Add portfolio projects to reach the top 10%";

        const fields = [
            { key: 'photoURL', present: !!userProfile.photoURL, text: "Add a profile picture" },
            { key: 'displayName', present: !!userProfile.displayName, text: "Add your display name" },
            { key: 'location', present: !!userProfile.location, text: "Add your location" },
            { key: 'tags', present: userProfile.tags && userProfile.tags.length > 0, text: "Choose at least one tag" },
            { key: 'bio', present: !!userProfile.bio, text: "Write a bio to tell your story" },
        ];

        completedFields = fields.filter(f => f.present).length;
        const firstIncomplete = fields.find(f => !f.present);
        if(firstIncomplete) {
            nextStep = firstIncomplete.text;
        }
        
        const percentage = Math.round((completedFields / totalFields) * 100);

        return { percentage, nextStepText: nextStep };
    }, [userProfile]);

    const circumference = 2 * Math.PI * 18;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

     return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Profile Impact</CardTitle>
                 <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-1/2" />
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12">
                                <svg className="w-full h-full" viewBox="0 0 40 40">
                                    <circle className="text-muted/20" strokeWidth="4" stroke="currentColor" fill="transparent" r="18" cx="20" cy="20" />
                                    <circle className="text-primary" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="18" cx="20" cy="20" transform="rotate(-90 20 20)" />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{percentage}%</span>
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-lg">{percentage}% Complete</div>
                                <p className="text-xs text-muted-foreground hover:text-primary"><Link href="/profile">{nextStepText} &rarr;</Link></p>
                            </div>
                        </div>
                        {percentage < 100 && motivationalTip && (
                             <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg">
                                <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{motivationalTip}</span>
                            </div>
                        )}
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
  const { userProfile } = useUserProfile();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [inDiscussionCampaigns, setInDiscussionCampaigns] = useState<any[]>([]);
  const [matchingJobsCount, setMatchingJobsCount] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  const [stats, setStats] = useState({ escrow: 0 });
  const [userApplications, setUserApplications] = useState<Map<string, string>>(new Map());
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const name = userProfile?.displayName?.split(' ')[0] || userProfile?.name?.split(' ')[0] || '';

    if (hour < 12) {
      setGreeting(`Good morning, ${name}`);
    } else if (hour < 18) {
      setGreeting(`Good afternoon, ${name}`);
    } else {
      setGreeting(`Good evening, ${name}`);
    }
  }, [userProfile]);

  // Fetch active campaigns (where creator is assigned)
  const activeCampaignsQuery = useMemoFirebase(
    () => user && firestore ? query(
        collection(firestore, 'campaigns'), 
        where('creatorIds', 'array-contains', user.uid)
    ) : null,
    [user, firestore]
  );
  const { data: activeCampaigns, isLoading: isLoadingActive } = useCollection(activeCampaignsQuery);
  
   const conversationsQuery = useMemoFirebase(
    () => (user && firestore) ? query(collection(firestore, 'conversations'), where('creator_id', '==', user.uid)) : null,
    [user, firestore]
  );
  const { data: conversations, isLoading: conversationsLoading } = useCollection(conversationsQuery);
  
  // Fetch pending applications and their associated campaign data
  useEffect(() => {
    if (user && firestore && conversations) {
        setIsLoadingPending(true);
        const fetchPendingAndMatching = async () => {
            try {
                const allOpenCampaignsQuery = query(collection(firestore, 'campaigns'), where('status', '==', 'OPEN_FOR_APPLICATIONS'));
                
                const appQuery = query(collectionGroup(firestore, 'applications'), where('creatorId', '==', user.uid));
                
                const [appsSnapshot, openCampaignsSnapshot] = await Promise.all([
                    getDocs(appQuery),
                    getDocs(allOpenCampaignsQuery)
                ]);
                
                const appMap = new Map<string, string>();
                appsSnapshot.docs.forEach(doc => {
                    appMap.set(doc.data().campaignId, doc.id);
                });
                setUserApplications(appMap);

                const openCampaignsData = openCampaignsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const negotiationConvos = conversations.filter(c => c.status === 'NEGOTIATION');
                const negotiationCampaignIds = negotiationConvos.map(c => c.campaign_id);
                
                // Get full campaign data for negotiations
                if (negotiationCampaignIds.length > 0) {
                     const negotiationCampaignsQuery = query(collection(firestore, 'campaigns'), where(documentId(), 'in', negotiationCampaignIds));
                     const negotiationCampaignsSnapshot = await getDocs(negotiationCampaignsQuery);
                     const discussionData = negotiationCampaignsSnapshot.docs.map(d => ({...d.data(), id: d.id, conversationId: negotiationConvos.find(c => c.campaign_id === d.id)?.id }));
                     setInDiscussionCampaigns(discussionData);
                } else {
                    setInDiscussionCampaigns([]);
                }
                
                const pendingData = openCampaignsData.filter(c => appMap.has(c.id) && !negotiationCampaignIds.includes(c.id));
                setPendingCampaigns(pendingData);
                
                // Calculate matching jobs
                const creatorTags = userProfile?.tags || [];
                let matchingCount = 0;
                if (creatorTags.length > 0) {
                    const matching = openCampaignsData.filter(c => 
                        !appMap.has(c.id) && c.tags?.some((tag: string) => creatorTags.includes(tag))
                    );
                    matchingCount = matching.length;
                } else {
                    matchingCount = openCampaignsData.length - appMap.size;
                }
                setMatchingJobsCount(matchingCount);

                // Mock profile views with a "Fake Boost"
                setProfileViews(Math.floor(Math.random() * 20) + 2);

            } catch (error) {
                console.error("Error fetching creator data:", error);
                setPendingCampaigns([]);
                setInDiscussionCampaigns([]);
                setMatchingJobsCount(0);
            } finally {
                setIsLoadingPending(false);
            }
        };

        fetchPendingAndMatching();
    }
  }, [user, firestore, userProfile, conversations]);
  
  // Calculate stats
  useEffect(() => {
    if (!isLoadingActive && activeCampaigns) {
        const escrow = activeCampaigns.reduce((sum, c) => 
            (c.status === 'IN_PROGRESS' || c.status === 'DELIVERED') ? sum + c.budget : sum
        , 0);

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

  const isLoading = isLoadingActive || isLoadingPending || conversationsLoading;
  const hasActiveContracts = activeCampaigns && activeCampaigns.some(c => c.status === 'IN_PROGRESS' || c.status === 'DELIVERED');

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{greeting}</h1>
        <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
          <Link href="/discover">
            <Compass className="mr-2 h-5 w-5" />
            Discover Campaigns
          </Link>
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-3 mb-8">
            {hasActiveContracts ? (
                <StatCard isLoading={isLoading} title="Funds in Escrow" value={`${stats.escrow.toLocaleString()} DH`} icon={<Lock className="h-4 w-4 text-muted-foreground" />} color="text-green-500" subtitle="Money secured for active projects." />
            ) : (
                <ProfileImpactCard isLoading={isLoading} />
            )}
            <StatCard isLoading={isLoading} title="Matching Opportunities" value={matchingJobsCount} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} subtitle={`${matchingJobsCount} campaigns are looking for a profile like yours.`} cta={{ text: 'Discover Campaigns', href: '/discover' }} />
            <StatCard isLoading={isLoading} title="Profile Views (7d)" value={profileViews} icon={<Eye className="h-4 w-4 text-muted-foreground" />} subtitle={`${Math.floor(profileViews/3)} brands saw your profile today.`} />
        </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full justify-start overflow-x-auto p-1 h-auto lg:grid lg:grid-cols-3">
            <TabsTrigger value="active">Active <Badge variant="secondary" className="ml-2">{activeCampaigns?.length || 0}</Badge></TabsTrigger>
            <TabsTrigger value="discussion">In Discussion <Badge variant="secondary" className="ml-2">{inDiscussionCampaigns?.length || 0}</Badge></TabsTrigger>
            <TabsTrigger value="pending">Pending <Badge variant="secondary" className="ml-2">{pendingCampaigns?.length || 0}</Badge></TabsTrigger>
        </TabsList>
        <TabsContent value="active">
            {isLoadingActive ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    <CampaignCardSkeleton />
                    <CampaignCardSkeleton />
                </div>
            ) : activeCampaigns && activeCampaigns.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {activeCampaigns.map((campaign) => {
                        let badgeStatus = campaign.status;
                        let badgeText = campaign.status.replace(/_/g, ' ');
                        if (campaign.status === 'PENDING_CREATOR_ACCEPTANCE') {
                            badgeStatus = 'YOUR_ACCEPTANCE';
                            badgeText = 'YOUR ACCEPTANCE';
                        }
                        const isActionRequired = badgeStatus === 'YOUR_ACCEPTANCE';
                    
                    return (
                        <Card key={campaign.id} className={cn("hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card", isActionRequired && "border-blue-500 shadow-blue-500/10")}>
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-lg font-bold line-clamp-1">{campaign.title}</CardTitle>
                                     {campaign.status && (
                                        <Badge className={cn('whitespace-nowrap text-xs', statusStyles[badgeStatus])}>
                                            {badgeText}
                                        </Badge>
                                     )}
                                </div>
                                <CardDescription className="gradient-text font-bold text-base">{campaign.budget} DH</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4">
                                <Button asChild className="w-full" variant={isActionRequired ? 'default' : 'secondary'}>
                                  <Link href={`/campaigns/${campaign.id}`}>
                                    {isActionRequired ? "View Offer" : "View Details"}
                                    {isActionRequired && <ArrowRight className="ml-2 h-4 w-4" />}
                                  </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                  })}
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
        <TabsContent value="discussion">
             {isLoadingPending ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    <CampaignCardSkeleton />
                </div>
            ) : inDiscussionCampaigns && inDiscussionCampaigns.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {inDiscussionCampaigns.map((campaign) => (
                        <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card border-primary/30">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-lg font-bold line-clamp-1">{campaign.title}</CardTitle>
                                    <Badge variant="secondary" className="border-blue-200 bg-blue-100 text-blue-800">
                                        <MessageSquare className="mr-1 h-3 w-3" />
                                        In Discussion
                                    </Badge>
                                </div>
                                <CardDescription className="gradient-text font-bold text-base">{campaign.budget} DH</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4 flex-col items-stretch gap-2">
                                <Button asChild className="w-full">
                                  <Link href={`/chat/${campaign.conversationId}`}>
                                    Open Chat
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                  )}
                </div>
            ) : (
                <EmptyState 
                    title="No negotiations in progress"
                    description="When a brand is interested in your application, you can negotiate terms here."
                    buttonText="Discover More Campaigns"
                    buttonLink="/discover"
                    icon={MessageSquare}
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
