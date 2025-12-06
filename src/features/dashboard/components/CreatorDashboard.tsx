
'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase, useUserProfile } from '@/firebase';
import Link from 'next/link';
import { collection, query, where, getDocs, collectionGroup, documentId, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Compass, Hourglass, Activity, ArrowRight, Wallet, Lock, Eye, Briefcase, UserCheck, Lightbulb, User, ImageIcon, MapPin, Tag, Type, Trash2, MessageSquare, ArrowLeft } from 'lucide-react';
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
import { useNicheTranslation } from '@/hooks/use-niche-translation';

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

const StatCard = ({ title, value, icon, isLoading, color = 'text-foreground', subtitle, cta }: { title: string; value: string | number; icon: React.ReactNode, isLoading: boolean, color?: string, subtitle?: string, cta?: { text: string; href: string; } }) => {
    const { dir } = useLanguage();
    const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

    return (
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
                            <Arrow className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                        </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};


const ProfileImpactCard = ({ isLoading }: { isLoading: boolean }) => {
    const { userProfile } = useUserProfile();
    const { t, dir } = useLanguage();
    const [motivationalTip, setMotivationalTip] = useState('');
    const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

     useEffect(() => {
        const tips = t('creatorProfile.completionTips', { returnObjects: true }) as string[];
        if (tips && tips.length > 0) {
            const randomIndex = Math.floor(Math.random() * tips.length);
            setMotivationalTip(tips[randomIndex]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]);


    const { percentage, nextStep } = useMemo(() => {
        if (!userProfile) return { percentage: 0, nextStep: { text: t('creatorProfile.steps.completeProfile'), icon: User } };
        
        const fields = [
            { key: 'photoURL', present: !!userProfile.photoURL, text: t('creatorProfile.steps.addPicture'), icon: ImageIcon },
            { key: 'displayName', present: !!userProfile.displayName, text: t('creatorProfile.steps.addName'), icon: User },
            { key: 'location', present: !!userProfile.location, text: t('creatorProfile.steps.addLocation'), icon: MapPin },
            { key: 'tags', present: userProfile.tags && userProfile.tags.length > 0, text: t('creatorProfile.steps.addTag'), icon: Tag },
            { key: 'bio', present: !!userProfile.bio, text: t('creatorProfile.steps.addBio'), icon: Type },
        ];

        const completedFields = fields.filter(f => f.present).length;
        const totalFields = fields.length;
        
        const percentage = 30 + Math.round((completedFields / totalFields) * 70);

        const firstIncompleteStep = fields.find(f => !f.present);
        const nextStep = firstIncompleteStep || { text: t('creatorProfile.steps.complete'), icon: User };

        return { percentage, nextStep };

    }, [userProfile, t]);

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
                                <p className="text-xs text-muted-foreground hover:text-primary"><Link href="/profile">{nextStep.text} &rarr;</Link></p>
                            </div>
                        </div>
                        {percentage < 100 && motivationalTip && (
                             <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg">
                                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>{motivationalTip}</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


const EmptyState = ({title, description, buttonText, buttonLink, icon: Icon}: any) => {
    const { dir } = useLanguage();
    const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

    return (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20 mt-8">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                <Icon className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">{description}</p>
            <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
                <Link href={buttonLink}>
                    {buttonText}
                    <Arrow className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                </Link>
            </Button>
        </div>
    );
}

const CampaignList = ({ campaigns, onWithdraw, listType }: { campaigns: any[], onWithdraw: (id: string) => void, listType: 'pending' | 'active' | 'discussion' | 'payment'}) => {
    const { t } = useLanguage();
    if (campaigns.length === 0) {
        let emptyStateProps;
        switch (listType) {
            case 'active':
                emptyStateProps = {
                    title: t('creatorDashboard.emptyStates.active.title'),
                    description: t('creatorDashboard.emptyStates.active.description'),
                    icon: Activity
                };
                break;
            case 'payment':
                 emptyStateProps = {
                    title: t('creatorDashboard.emptyStates.payment.title'),
                    description: t('creatorDashboard.emptyStates.payment.description'),
                    icon: Wallet
                };
                break;
            case 'discussion':
                 emptyStateProps = {
                    title: t('creatorDashboard.emptyStates.discussion.title'),
                    description: t('creatorDashboard.emptyStates.discussion.description'),
                    icon: MessageSquare
                };
                break;
            case 'pending':
                 emptyStateProps = {
                    title: t('creatorDashboard.emptyStates.pending.title'),
                    description: t('creatorDashboard.emptyStates.pending.description'),
                    icon: Compass
                };
                break;
        }
        return (
            <EmptyState 
                {...emptyStateProps}
                buttonText={t('creatorDashboard.discoverButton')}
                buttonLink="/discover"
            />
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {campaigns.map(campaign => {
                let badgeStatus = campaign.status;
                let badgeText = t(`status.${badgeStatus}`, { default: badgeStatus.replace(/_/g, ' ') });
                 if (campaign.status === 'PENDING_CREATOR_ACCEPTANCE') {
                    badgeStatus = 'YOUR_ACCEPTANCE';
                    badgeText = t('status.YOUR_ACCEPTANCE');
                }
                const isActionRequired = badgeStatus === 'YOUR_ACCEPTANCE' || listType === 'discussion';

                return (
                    <Card key={campaign.id} className={cn("hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card", isActionRequired && "border-primary/30")}>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">{campaign.title}</CardTitle>
                            <div className="flex items-center justify-between pt-2">
                                <CardDescription className="gradient-text font-bold text-base">{campaign.budget} DH</CardDescription>
                                <Badge className={cn('whitespace-nowrap text-xs', statusStyles[badgeStatus])}>
                                    {badgeText}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-2 h-10">{campaign.campaignBrief}</p>
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-4 flex-col items-stretch gap-2">
                            {listType === 'discussion' && campaign.conversationId && (
                                <Button asChild className="w-full">
                                    <Link href={`/chat?id=${campaign.conversationId}`}>{t('creatorDashboard.actions.chat')}</Link>
                                </Button>
                            )}
                            {(listType === 'active' || listType === 'payment') && (
                                 <Button asChild className="w-full" variant={isActionRequired ? "default" : "secondary"}>
                                    <Link href={`/campaigns/${campaign.id}`}>{isActionRequired ? t('creatorDashboard.actions.review') : t('creatorDashboard.actions.view')}</Link>
                                </Button>
                            )}
                            {listType === 'pending' && (
                                <>
                                    <Button asChild className="w-full" variant="secondary">
                                        <Link href={`/campaigns/${campaign.id}`}>{t('creatorDashboard.actions.view')}</Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="mr-1 h-3 w-3" /> {t('creatorDashboard.actions.withdraw')}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t('creatorDashboard.deleteDialog.title')}</AlertDialogTitle>
                                                <AlertDialogDescription>{t('creatorDashboard.deleteDialog.description', { campaignTitle: campaign.title })}</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{t('brandDashboard.deleteDialog.cancel')}</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => onWithdraw(campaign.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('creatorDashboard.deleteDialog.confirm')}</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}

export function CreatorDashboard() {
  const { userProfile } = useUserProfile();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const { getNicheLabel } = useNicheTranslation();

  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [inDiscussionCampaigns, setInDiscussionCampaigns] = useState<any[]>([]);
  const [awaitingPaymentCampaigns, setAwaitingPaymentCampaigns] = useState<any[]>([]);
  const [matchingJobsCount, setMatchingJobsCount] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  const [stats, setStats] = useState({ escrow: 0 });
  const [userApplications, setUserApplications] = useState<Map<string, string>>(new Map());
  const [greeting, setGreeting] = useState('Welcome');
  const [activeFilter, setActiveFilter] = useState('active');


  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const name = userProfile?.displayName?.split(' ')[0] || userProfile?.name?.split(' ')[0] || '';

    if (hour < 12) {
      setGreeting(`${t('greetings.morning')}, ${name}`);
    } else if (hour < 18) {
      setGreeting(`${t('greetings.afternoon')}, ${name}`);
    } else {
      setGreeting(`${t('greetings.evening')}, ${name}`);
    }
  }, [userProfile, t]);

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
                const paymentConvos = conversations.filter(c => c.status === 'OFFER_ACCEPTED');

                const negotiationCampaignIds = negotiationConvos.map(c => c.campaign_id);
                const paymentCampaignIds = paymentConvos.map(c => c.campaign_id);
                
                // Get full campaign data for negotiations
                if (negotiationCampaignIds.length > 0) {
                     const negotiationCampaignsQuery = query(collection(firestore, 'campaigns'), where(documentId(), 'in', negotiationCampaignIds));
                     const negotiationCampaignsSnapshot = await getDocs(negotiationCampaignsQuery);
                     const discussionData = negotiationCampaignsSnapshot.docs.map(d => ({...d.data(), id: d.id, conversationId: negotiationConvos.find(c => c.campaign_id === d.id)?.id }));
                     setInDiscussionCampaigns(discussionData);
                } else {
                    setInDiscussionCampaigns([]);
                }
                
                 // Get full campaign data for payments
                if (paymentCampaignIds.length > 0) {
                     const paymentCampaignsQuery = query(collection(firestore, 'campaigns'), where(documentId(), 'in', paymentCampaignIds));
                     const paymentCampaignsSnapshot = await getDocs(paymentCampaignsQuery);
                     const paymentData = paymentCampaignsSnapshot.docs.map(d => ({...d.data(), id: d.id, conversationId: paymentConvos.find(c => c.campaign_id === d.id)?.id }));
                     setAwaitingPaymentCampaigns(paymentData);
                } else {
                    setAwaitingPaymentCampaigns([]);
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
                setAwaitingPaymentCampaigns([]);
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
  
  const inProgressCampaigns = useMemo(() => activeCampaigns?.filter(c => ['IN_PROGRESS', 'DELIVERED', 'PENDING_CREATOR_ACCEPTANCE'].includes(c.status)) || [], [activeCampaigns]);
  const allCampaigns = useMemo(() => [...inProgressCampaigns, ...awaitingPaymentCampaigns, ...inDiscussionCampaigns, ...pendingCampaigns], [inProgressCampaigns, awaitingPaymentCampaigns, inDiscussionCampaigns, pendingCampaigns]);

  const filteredCampaigns = useMemo(() => {
    switch(activeFilter) {
      case 'active': return inProgressCampaigns;
      case 'payment': return awaitingPaymentCampaigns;
      case 'discussion': return inDiscussionCampaigns;
      case 'pending': return pendingCampaigns;
      case 'all': 
      default:
        // Create a Set of unique campaigns based on ID
        const uniqueCampaigns = new Map();
        [...inProgressCampaigns, ...awaitingPaymentCampaigns, ...inDiscussionCampaigns, ...pendingCampaigns].forEach(c => {
            if (!uniqueCampaigns.has(c.id)) {
                uniqueCampaigns.set(c.id, c);
            }
        });
        return Array.from(uniqueCampaigns.values());
    }
  }, [activeFilter, inProgressCampaigns, awaitingPaymentCampaigns, inDiscussionCampaigns, pendingCampaigns]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{greeting}</h1>
        <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
          <Link href="/discover">
            <Compass className="mr-2 rtl:mr-0 rtl:ml-2 h-5 w-5" />
            {t('creatorDashboard.discoverButton')}
          </Link>
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-3 mb-8">
            {hasActiveContracts ? (
                <StatCard isLoading={isLoading} title={t('creatorDashboard.stats.escrow')} value={`${stats.escrow.toLocaleString()} DH`} icon={<Lock className="h-4 w-4 text-muted-foreground" />} color="text-green-500" subtitle={t('creatorDashboard.stats.escrowSubtitle')} />
            ) : (
                <ProfileImpactCard isLoading={isLoading} />
            )}
            <StatCard isLoading={isLoading} title={t('creatorDashboard.stats.matching')} value={matchingJobsCount} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} subtitle={t('creatorDashboard.stats.matchingSubtitle', { value: matchingJobsCount })} cta={{ text: t('creatorDashboard.discoverButton'), href: '/discover' }} />
            <StatCard isLoading={isLoading} title={t('creatorDashboard.stats.views')} value={profileViews} icon={<Eye className="h-4 w-4 text-muted-foreground" />} subtitle={t('creatorDashboard.stats.viewsSubtitle', { value: profileViews })} />
        </div>

      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full mb-8">
        <div className="relative">
            <TabsList className="p-1 h-auto bg-muted rounded-full w-full overflow-x-auto justify-start md:grid md:grid-cols-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                    {t('brandDashboard.filters.all')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{allCampaigns.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="active" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  {t('creatorDashboard.tabs.active')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{inProgressCampaigns.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="payment" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  {t('creatorDashboard.tabs.payment')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{awaitingPaymentCampaigns.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="discussion" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  {t('creatorDashboard.tabs.discussion')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{inDiscussionCampaigns.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  {t('creatorDashboard.tabs.pending')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{pendingCampaigns.length}</Badge>
                </TabsTrigger>
            </TabsList>
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background pointer-events-none md:hidden z-10"></div>
        </div>
        <TabsContent value="all">
          <CampaignList campaigns={filteredCampaigns} onWithdraw={handleWithdrawApplication} listType="pending" />
        </TabsContent>
        <TabsContent value="active">
          <CampaignList campaigns={inProgressCampaigns} onWithdraw={handleWithdrawApplication} listType="active" />
        </TabsContent>
        <TabsContent value="payment">
            <CampaignList campaigns={awaitingPaymentCampaigns} onWithdraw={handleWithdrawApplication} listType="payment" />
        </TabsContent>
        <TabsContent value="discussion">
             <CampaignList campaigns={inDiscussionCampaigns} onWithdraw={handleWithdrawApplication} listType="discussion" />
        </TabsContent>
        <TabsContent value="pending">
             <CampaignList campaigns={pendingCampaigns} onWithdraw={handleWithdrawApplication} listType="pending" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
