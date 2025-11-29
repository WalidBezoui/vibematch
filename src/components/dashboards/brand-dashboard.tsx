
'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { PlusCircle, Users, Activity, FileText, CircleDollarSign, MoreVertical, Edit, Trash2, Sparkles, Wallet, Megaphone, FileVideo, AlertCircle, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc, serverTimestamp, onSnapshot, Unsubscribe, documentId } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const statusStyles: { [key: string]: string } = {
    OPEN_FOR_APPLICATIONS: 'bg-green-100 text-green-800 border-green-200',
    PENDING_SELECTION: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PENDING_CREATOR_ACCEPTANCE: 'bg-blue-100 text-blue-800 border-blue-200',
    OFFER_PENDING: 'bg-blue-100 text-blue-800 border-blue-200',
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse',
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

const StatCard = ({ title, value, icon, isLoading, subtitle, color = 'text-foreground' }: { title: string; value: string | number; icon: React.ReactNode, isLoading: boolean, subtitle?: string, color?: string }) => (
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

const ActionRequiredItem = ({ icon, text, buttonText, href, type, typeText }: { icon: React.ReactNode, text: React.ReactNode, buttonText: string, href: string, type: string, typeText: string }) => {
  const typeStyles = {
    payment: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300',
    applicants: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300',
    message: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300'
  };

  return (
    <div className="flex items-center justify-between gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={cn("w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full", typeStyles[type as keyof typeof typeStyles])}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                    <Badge variant="secondary" className={cn("mr-2 font-bold text-xs", typeStyles[type as keyof typeof typeStyles])}>{typeText}</Badge>
                    {text}
                </p>
            </div>
        </div>
        <Button asChild size="sm" variant="ghost">
            <Link href={href}>{buttonText}</Link>
        </Button>
    </div>
  )
};


const ActionRequiredSection = ({ campaigns, applicationCounts, conversations, isLoading }: { campaigns: any[], applicationCounts: Record<string, number>, conversations: any[], isLoading: boolean }) => {
    const { t } = useLanguage();

    const actionItems = useMemo(() => {
        if (!campaigns || !conversations) return [];
        const items = [];

        // 1. Awaiting Payment (from accepted conversation offers)
        const paymentNeededFromConvo = conversations.filter(c => c.status === 'OFFER_ACCEPTED');
        paymentNeededFromConvo.forEach(c => {
            const campaign = campaigns.find(camp => camp.id === c.campaign_id);
            if(campaign){
                items.push({
                    type: 'payment',
                    typeText: t('brandDashboard.actions.payment'),
                    id: `payment-convo-${c.id}`,
                    icon: <Wallet className="h-5 w-5" />,
                    text: <>
                        <span className="font-semibold text-primary">{campaign.title}:</span> {t('brandDashboard.actions.fundCreator', {name: c.creator_name || 'A creator'})}
                    </>,
                    buttonText: t('brandDashboard.actions.pay'),
                    href: `/campaigns/${c.campaign_id}/pay`
                });
            }
        });
        
        // New Applicants
        const applicantNeeded = campaigns.filter(c => (applicationCounts[c.id] || 0) > 0);
        applicantNeeded.forEach(c => {
            items.push({
                type: 'applicants',
                typeText: t('brandDashboard.actions.applicants'),
                id: `applicants-${c.id}`,
                icon: <Users className="h-5 w-5" />,
                text: <><span className="font-semibold text-primary">{c.title}:</span> {t('brandDashboard.actions.newApplicants', { count: applicationCounts[c.id] })}</>,
                buttonText: t('brandDashboard.actions.review'),
                href: `/campaigns/${c.id}/manage`
            });
        });
        
        // Unread Messages/Offers
        const unreadMessages = conversations.filter(c => c.status === 'NEGOTIATION' && c.last_offer_by !== campaigns.find(camp => camp.id === c.campaign_id)?.brandId);
        unreadMessages.forEach(c => {
            const campaignTitle = campaigns.find(camp => camp.id === c.campaign_id)?.title || "a campaign";
            const creatorName = c.creator_name || 'A creator';
            items.push({
                type: 'message',
                typeText: t('brandDashboard.actions.message'),
                id: `message-${c.id}`,
                icon: <MessageSquare className="h-5 w-5" />,
                text: <><span className="font-semibold text-primary">{campaignTitle}:</span> {t('brandDashboard.actions.newMessage', { name: creatorName })}</>,
                buttonText: t('brandDashboard.actions.reply'),
                href: `/chat?id=${c.id}`
            });
        });


        return items;
    }, [campaigns, applicationCounts, conversations, t]);

    if (isLoading) {
        return (
            <Card className="mb-8">
                <CardHeader>
                     <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (actionItems.length === 0) {
        return null;
    }

    return (
        <Card className="mb-8 shadow-sm bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <AlertCircle />
                    {t('brandDashboard.actions.title')}
                    <Badge variant="destructive" className="rounded-full">{actionItems.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
                <div className="space-y-1">
                    {actionItems.map(item => <ActionRequiredItem key={item.id} {...item} />)}
                </div>
            </CardContent>
        </Card>
    )
}

const CampaignCard = ({ campaign, onDelete, applicationCount, isAwaitingPayment }: { campaign: any, onDelete: (campaignId: string) => Promise<void>, applicationCount: number, isAwaitingPayment: boolean }) => {
    const { t } = useLanguage();
    const hiredCount = campaign.creatorIds?.length || 0;
    const totalNeeded = campaign.numberOfCreators || 1;
    const hiringProgress = totalNeeded > 0 ? (hiredCount / totalNeeded) * 100 : 0;


    const manageButtonLink = `/campaigns/${campaign.id}/manage`;

    const formattedDate = campaign.createdAt && typeof campaign.createdAt.toDate === 'function' 
        ? format(campaign.createdAt.toDate(), 'MMM d, yyyy') 
        : 'Just now';
        
    const statusKey = `status.${campaign.status}`;
    const statusText = t(statusKey, { default: campaign.status.replace(/_/g, ' ') });

    const campaignType = campaign.campaignType || 'influence';
    const typeInfo = {
        influence: { 
            badgeText: t('campaignTypes.influence.badge'), 
            badgeIcon: Megaphone,
            badgeClass: "bg-teal-100 text-teal-800 border-teal-200" 
        },
        ugc: { 
            badgeText: t('campaignTypes.ugc.badge'),
            badgeIcon: FileVideo,
            badgeClass: "bg-sky-100 text-sky-800 border-sky-200" 
        },
    };
    const TypeIcon = typeInfo[campaignType].badgeIcon;


    return (
        <Card className={cn(
          "hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card",
          isAwaitingPayment && "border-blue-300 dark:border-blue-800 shadow-lg shadow-blue-500/10"
        )}>
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                     <div className='flex-1'>
                        <CardTitle className="text-lg font-bold line-clamp-1">{campaign.title}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-1">
                            {t('brandDashboard.createdOn', { date: formattedDate })}
                        </CardDescription>
                     </div>
                     <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/campaigns/${campaign.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>{t('brandDashboard.editAction')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>{t('brandDashboard.deleteAction')}</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('brandDashboard.deleteDialog.title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('brandDashboard.deleteDialog.description')}
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>{t('brandDashboard.deleteDialog.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(campaign.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('brandDashboard.deleteDialog.confirm')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                 <div className="flex items-center justify-between pt-4">
                    <span className="gradient-text font-bold text-lg">{campaign.budget} DH</span>
                     <Badge className={cn('whitespace-nowrap text-xs', statusStyles[campaign.status])}>
                        {isAwaitingPayment ? t('status.AWAITING_YOUR_PAYMENT') : statusText}
                    </Badge>
                 </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                 <Badge variant="secondary" className={cn("whitespace-nowrap text-xs", typeInfo[campaignType].badgeClass)}>
                    <TypeIcon className="mr-1.5 h-3 w-3" />
                    {typeInfo[campaignType].badgeText}
                </Badge>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                        <span>{t('brandDashboard.hiringProgress')}</span>
                        <span>{hiredCount} / {totalNeeded}</span>
                    </div>
                    <Progress value={hiringProgress} className="h-2" />
                 </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4">
                 <div className="w-full flex flex-col items-center gap-2">
                    {isAwaitingPayment && (
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white animate-pulse-button">
                            <Link href={`/campaigns/${campaign.id}/pay`}>
                                <Wallet className="mr-2 h-4 w-4" />
                                {t('brandDashboard.fundNowButton')}
                            </Link>
                        </Button>
                    )}
                    
                    {(campaign.status !== 'COMPLETED' && campaign.status !== 'REJECTED_BY_CREATOR') ? (
                        <Button asChild variant={applicationCount > 0 ? "default" : "outline"} size="sm" className="w-full">
                            <Link href={manageButtonLink}>
                                <Users className="mr-2 h-4 w-4" />
                                {t('brandDashboard.manageButton')}
                                {applicationCount > 0 && <Badge variant="secondary" className="ml-2">{applicationCount}</Badge>}
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild className="w-full">
                            <Link href={`/campaigns/${campaign.id}`}>{t('brandDashboard.viewButton')}</Link>
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};


export default function BrandDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const campaignsQuery = useMemoFirebase(
    () => (user && firestore) ? query(collection(firestore, 'campaigns'), where('brandId', '==', user.uid)) : null,
    [user, firestore]
  );
  const { data: campaigns, isLoading: isLoadingCampaigns } = useCollection(campaignsQuery);

  const conversationsQuery = useMemoFirebase(
    () => (user && firestore) ? query(collection(firestore, 'conversations'), where('brand_id', '==', user.uid)) : null,
    [user, firestore]
  );
  const { data: conversations, isLoading: isLoadingConversations } = useCollection(conversationsQuery);


  const [stats, setStats] = useState({ plannedBudget: 0, escrowedFunds: 0 });
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');


  useEffect(() => {
    if (campaigns && firestore && user) {
        setIsStatsLoading(true);
        const activeCampaigns = campaigns.filter(c => c.status !== 'COMPLETED' && c.status !== 'REJECTED_BY_CREATOR');
        const plannedBudget = activeCampaigns.reduce((sum, c) => sum + (c.budget || 0) * (c.numberOfCreators || 1), 0);
        const escrowedFunds = activeCampaigns.reduce((sum, c) => c.status === 'IN_PROGRESS' || c.status === 'DELIVERED' ? sum + c.budget * (c.creatorIds?.length || 0) : sum, 0);

        setStats({ plannedBudget, escrowedFunds });
        setIsStatsLoading(false);

        const unsubscribes: Unsubscribe[] = campaigns.map(campaign => {
            const q = query(collection(firestore, 'campaigns', campaign.id, 'applications'), where('status', '==', 'APPLIED'));
            return onSnapshot(q, (snapshot) => {
                setApplicationCounts(prev => ({ ...prev, [campaign.id]: snapshot.size }));
            }, (error) => {
                // Ignore permissions errors, as they are expected for some queries.
                if (error.code !== 'permission-denied') {
                  console.error("Error fetching application counts:", error);
                }
            });
        });

        return () => unsubscribes.forEach(unsub => unsub());

    } else if (!isLoadingCampaigns) {
        setIsStatsLoading(false);
    }
  }, [campaigns, firestore, user, isLoadingCampaigns]);

  
  const filteredCampaigns = useMemo(() => {
    if (!campaigns || !conversations) return [];
    
    const campaignsAwaitingPayment = new Set(
        conversations.filter(c => c.status === 'OFFER_ACCEPTED').map(c => c.campaign_id)
    );
    
    switch (activeFilter) {
      case 'to_fund':
        return campaigns.filter(c => campaignsAwaitingPayment.has(c.id));
      case 'hiring':
        return campaigns.filter(c => c.status === 'OPEN_FOR_APPLICATIONS' && (c.creatorIds?.length || 0) < (c.numberOfCreators || 1));
      case 'in_progress':
        return campaigns.filter(c => ['IN_PROGRESS', 'DELIVERED', 'PENDING_CREATOR_ACCEPTANCE'].includes(c.status) || (c.status === 'OPEN_FOR_APPLICATIONS' && (c.creatorIds?.length || 0) >= (c.numberOfCreators || 1)));
      case 'archived':
        return campaigns.filter(c => ['COMPLETED', 'REJECTED_BY_CREATOR'].includes(c.status));
      default:
        return campaigns;
    }
  }, [campaigns, conversations, activeFilter]);


  const handleDeleteCampaign = async (campaignId: string) => {
    if (!firestore) return;
    toast({ title: t('brandDashboard.deleteToast.deleting') });

    const campaignRef = doc(firestore, 'campaigns', campaignId);
    
    try {
        await deleteDoc(campaignRef);
        toast({
            title: t('brandDashboard.deleteToast.successTitle'),
            description: t('brandDashboard.deleteToast.successDescription'),
        });
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: t('brandDashboard.deleteToast.errorTitle'),
            description: error.message,
        });
    }
  };
  
    const handleGenerateTestCampaign = async () => {
        if (!firestore || !user) return;

        const sampleTitles = ["Summer Glow Up", "Urban Explorer Series", "Eco-Friendly Living", "Tech Unboxed 2024", "Gourmet at Home"];
        const sampleBriefs = [
            "We're looking for vibrant creators to showcase our new line of summer skincare products. Emphasis on natural light and authentic, glowing skin.",
            "A campaign focused on exploring hidden gems in Moroccan cities. We want to see your unique perspective on urban life.",
            "Join us in promoting sustainable living with our new range of eco-friendly home goods. Authenticity and a passion for the environment are key.",
            "Unbox and review the latest gadgets in our 2024 tech lineup. We need honest, in-depth reviews for a tech-savvy audience.",
            "Showcase how you can create five-star meals right in your own kitchen with our new line of gourmet food products."
        ];
        const sampleTags = ["Fashion", "Beauty", "Food", "Travel", "Lifestyle", "Tech", "Gaming", "UGC"];
        const sampleInstructions = "Please ensure all content is filmed in high resolution (4K if possible). Avoid using copyrighted music. All posts must include the hashtag #VibeMatchTest and tag our brand profile.";
        const logisticsOptions: ['shipping', 'digital'] = ['shipping', 'digital'];
        const campaignTypes: ['influence', 'ugc'] = ['influence', 'ugc'];

        const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
        const randomBrief = sampleBriefs[Math.floor(Math.random() * sampleBriefs.length)];
        const randomTags = sampleTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
        const randomBudget = Math.floor(Math.random() * 20 + 5) * 100; // 500 to 2500
        const randomCreators = Math.floor(Math.random() * 5) + 1;
        const randomLogistics = logisticsOptions[Math.floor(Math.random() * logisticsOptions.length)];
        const randomCampaignType = campaignTypes[Math.floor(Math.random() * campaignTypes.length)];

        let randomDeliverables = [];
        if (randomCampaignType === 'influence') {
            randomDeliverables = ["1 Instagram Reel", "3 Instagram Stories"];
        } else {
            const ugcTypes = ['UGC_Video_Vertical', 'UGC_Video_Horizontal', 'UGC_Photo_Pack'];
            const selectedType = ugcTypes[Math.floor(Math.random() * ugcTypes.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            randomDeliverables = [`${quantity} ${selectedType}`];
        }

        const testCampaign = {
            title: `(Test) ${randomTitle}`,
            campaignBrief: randomBrief,
            instructions: sampleInstructions,
            productLogistics: randomLogistics,
            campaignType: randomCampaignType,
            deliverables: randomDeliverables,
            budget: randomBudget,
            numberOfCreators: randomCreators,
            tags: randomTags,
            brandId: user.uid,
            status: 'OPEN_FOR_APPLICATIONS',
            creatorIds: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        try {
            await addDoc(collection(firestore, 'campaigns'), testCampaign);
            toast({
                title: "Test Campaign Created",
                description: `Successfully generated and saved "${testCampaign.title}".`,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: error.message,
            });
        }
    };
    
  const isLoading = isLoadingCampaigns || isLoadingConversations;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{t('brandDashboard.title')}</h1>
        <div className="flex gap-2">
             <Button onClick={handleGenerateTestCampaign} variant="outline" className="rounded-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Test Campaign
            </Button>
            <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
            <Link href="/campaigns/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                {t('brandDashboard.createButton')}
            </Link>
            </Button>
        </div>
      </div>
      
      <ActionRequiredSection campaigns={campaigns || []} applicationCounts={applicationCounts} conversations={conversations || []} isLoading={isLoading} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard isLoading={isStatsLoading} title={t('brandDashboard.stats.budget')} value={`${stats.plannedBudget.toLocaleString()} DH`} icon={<FileText className="h-4 w-4 text-muted-foreground" />} subtitle={t('brandDashboard.stats.plannedBudgetSubtitle')} />
        <StatCard isLoading={isStatsLoading} title={t('brandDashboard.stats.escrow')} value={`${stats.escrowedFunds.toLocaleString()} DH`} icon={<Wallet className="h-4 w-4 text-muted-foreground" />} color="text-green-500" subtitle={t('brandDashboard.stats.escrowSubtitle')} />
        <StatCard isLoading={isLoadingCampaigns} title={t('brandDashboard.stats.active')} value={campaigns ? campaigns.filter(c => c.status !== 'COMPLETED').length : 0} icon={<Activity className="h-4 w-4 text-muted-foreground" />} />
      </div>

       <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full mb-8">
            <TabsList className="w-full justify-start overflow-x-auto p-1 h-auto lg:grid lg:grid-cols-5">
                <TabsTrigger value="all">{t('brandDashboard.filters.all')} ({campaigns?.length || 0})</TabsTrigger>
                <TabsTrigger value="to_fund" className="text-blue-600">{t('brandDashboard.filters.toFund')}</TabsTrigger>
                <TabsTrigger value="hiring" className="text-green-600">{t('brandDashboard.filters.hiring')}</TabsTrigger>
                <TabsTrigger value="in_progress">{t('brandDashboard.filters.inProgress')}</TabsTrigger>
                <TabsTrigger value="archived">{t('brandDashboard.filters.archived')}</TabsTrigger>
            </TabsList>
        </Tabs>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
        </div>
      )}

      {!isLoading && filteredCampaigns && conversations ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => {
            const isAwaitingPayment = conversations?.some(c => c.campaign_id === campaign.id && c.status === 'OFFER_ACCEPTED') || campaign.status === 'PENDING_PAYMENT';
            return (
              <CampaignCard 
                  campaign={campaign} 
                  key={campaign.id} 
                  onDelete={handleDeleteCampaign}
                  applicationCount={applicationCounts[campaign.id] || 0}
                  isAwaitingPayment={isAwaitingPayment}
              />
            )
          })}
        </div>
      ) : null}

      {!isLoading && (!filteredCampaigns || filteredCampaigns.length === 0) && (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20 mt-8">
            <h2 className="text-2xl font-bold">{t('brandDashboard.emptyFilter.title')}</h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">{t('brandDashboard.emptyFilter.description')}</p>
        </div>
      )}
    </div>
  );
}
