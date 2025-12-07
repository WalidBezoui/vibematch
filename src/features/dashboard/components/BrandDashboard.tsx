
'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { PlusCircle, Users, Activity, FileText, CircleDollarSign, MoreVertical, Edit, Trash2, Sparkles, Wallet, Megaphone, FileVideo, AlertCircle, MessageSquare, ArrowRight, ArrowLeft, Archive, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDoc, doc, deleteDoc, addDoc, serverTimestamp, onSnapshot, Unsubscribe, documentId, getDocs } from 'firebase/firestore';
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
    DropdownMenuSeparator
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
import { CampaignDetailsDialog } from '@/features/campaigns';


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
    AWAITING_YOUR_PAYMENT: 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse',
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

const ActionRequiredItem = ({ type, typeText, text, metric, buttonText, href, campaignTitle }: { type: 'payment' | 'applicants' | 'message', typeText: string, text: React.ReactNode, metric: string | number, buttonText: string, href: string, campaignTitle: string }) => {
  const { dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const typeStyles = {
    payment: { icon: Wallet, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
    applicants: { icon: Users, iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' },
    message: { icon: MessageSquare, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' }
  };
  const styles = typeStyles[type];
  const Icon = styles.icon;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={cn("w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl", styles.iconBg)}>
                 <Icon className={cn("h-6 w-6", styles.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
                <Badge variant="secondary" className={cn("font-semibold", styles.iconBg, styles.iconColor)}>{typeText}</Badge>
                <div className="font-semibold text-foreground truncate mt-1">{campaignTitle}</div>
                <div className="text-sm text-muted-foreground truncate">{text}</div>
            </div>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2 pl-0 sm:pl-16 mt-2 sm:mt-0">
            {type === 'payment' && <div className="text-lg font-bold text-right sm:text-left">{metric}</div>}
            <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href={href}>{buttonText} <Arrow className="h-4 w-4 ml-2" /></Link>
            </Button>
        </div>
    </div>
  )
};

const EmptyState = ({title, description, icon: Icon, showCreateButton}: {title: string, description: string, icon: React.ComponentType<{className?: string}>, showCreateButton?: boolean}) => {
    const { t } = useLanguage();
    return (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20 mt-8">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                <Icon className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">{description}</p>
            {showCreateButton && (
                 <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
                    <Link href="/campaigns/create">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        {t('brandDashboard.createButton')}
                    </Link>
                </Button>
            )}
        </div>
    )
}


const ActionRequiredSection = ({ campaigns, applicationCounts, conversations, isLoading }: { campaigns: any[], applicationCounts: Record<string, number>, conversations: any[], isLoading: boolean }) => {
    const { t } = useLanguage();

    const actionItems = useMemo(() => {
        if (isLoading || !campaigns || !conversations) return [];
        const items = [];

        // 1. Awaiting Payment
        const paymentNeededFromConvo = conversations.filter(c => c.status === 'OFFER_ACCEPTED');
        paymentNeededFromConvo.forEach(convo => {
            const campaign = campaigns.find(c => c.id === convo.campaign_id);
            if(campaign){
                const creatorName = convo.otherUser?.name || t('brandDashboard.actions.aCreator');
                items.push({
                    type: 'payment' as const,
                    id: `payment-${campaign.id}`,
                    metric: `${convo.agreed_budget || campaign.budget} DH`,
                    typeText: t('brandDashboard.actions.payment'),
                    campaignTitle: campaign.title,
                    text: t('brandDashboard.actions.fundCreator', {name: creatorName}),
                    buttonText: t('brandDashboard.actions.pay'),
                    href: `/campaigns/${campaign.id}/pay`
                });
            }
        });
        
        // 2. New Applicants
        const applicantNeeded = campaigns.filter(c => (applicationCounts[c.id] || 0) > 0);
        applicantNeeded.forEach(c => {
            const count = applicationCounts[c.id];
            items.push({
                type: 'applicants' as const,
                id: `applicants-${c.id}`,
                metric: count,
                typeText: t('brandDashboard.actions.applicants'),
                campaignTitle: c.title,
                text: t('brandDashboard.actions.newApplicants', { count }),
                buttonText: t('brandDashboard.actions.review'),
                href: `/campaigns/${c.id}/manage`
            });
        });
        
        // 3. Unread Messages/Offers
        const unreadMessages = conversations.filter(c => c.status === 'NEGOTIATION' && c.last_offer_by !== campaigns.find(camp => camp.id === c.campaign_id)?.brandId);
        unreadMessages.forEach(c => {
            const campaignTitle = campaigns.find(camp => camp.id === c.campaign_id)?.title || "a campaign";
            const creatorName = c.otherUser?.name || 'A creator';
            items.push({
                type: 'message' as const,
                id: `message-${c.id}`,
                metric: '1',
                typeText: t('brandDashboard.actions.message'),
                campaignTitle: campaignTitle,
                text: t('brandDashboard.actions.newMessage', { name: creatorName }),
                buttonText: t('brandDashboard.actions.reply'),
                href: `/chat?id=${c.id}`
            });
        });


        return items;
    }, [campaigns, applicationCounts, conversations, t, isLoading]);

    if (isLoading) {
        return (
            <Card className="mb-8">
                <CardHeader>
                     <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (actionItems.length === 0) {
        return null;
    }

    return (
        <Card className="mb-8 shadow-sm border-t-4 border-amber-400">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle>
                        {t('brandDashboard.actions.title')}
                    </CardTitle>
                    <Badge variant="destructive" className="rounded-full">{actionItems.length}</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-2">
                <div className="space-y-1">
                    {actionItems.map(item => <ActionRequiredItem key={item.id} {...item} />)}
                </div>
            </CardContent>
        </Card>
    )
}

const CampaignCard = ({ campaign, onDelete, applicationCount, isAwaitingPayment, onViewDetails }: { campaign: any, onDelete: (campaignId: string) => Promise<void>, applicationCount: number, isAwaitingPayment: boolean, onViewDetails: (campaign: any) => void }) => {
    const { t } = useLanguage();
    const hiredCount = campaign.creatorIds?.length || 0;
    const totalNeeded = campaign.numberOfCreators || 1;
    const hiringProgress = totalNeeded > 0 ? (hiredCount / totalNeeded) * 100 : 0;


    const manageButtonLink = `/campaigns/${campaign.id}/manage`;

    const formattedDate = campaign.createdAt && typeof campaign.createdAt.toDate === 'function' 
        ? format(campaign.createdAt.toDate(), 'MMM d, yyyy') 
        : 'Just now';
        
    const statusKey = `status.${campaign.status}`;
    const statusText = t(statusKey, { defaultValue: campaign.status.replace(/_/g, ' ') });


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
                                <DropdownMenuItem onClick={() => onViewDetails(campaign)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
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
                     <Badge className={cn('whitespace-nowrap text-xs', statusStyles[isAwaitingPayment ? 'AWAITING_YOUR_PAYMENT' : campaign.status])}>
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


export function BrandDashboard() {
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
  const { data: rawConversations, isLoading: isLoadingConversations } = useCollection(conversationsQuery);


  const [stats, setStats] = useState({ plannedBudget: 0, escrowedFunds: 0 });
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);


  useEffect(() => {
    if (rawConversations && firestore) {
      const enrichConversations = async () => {
        const enriched = await Promise.all(rawConversations.map(async (convo) => {
          try {
            const userDocRef = doc(firestore, 'users', convo.creator_id);
            const userSnap = await getDoc(userDocRef);
            const otherUser = userSnap.exists() ? userSnap.data() : { name: 'Unknown User' };
            return { ...convo, otherUser };
          } catch (error) {
            console.error("Error enriching conversation:", error);
            return { ...convo, otherUser: { name: 'Error' } };
          }
        }));
        setConversations(enriched);
      };
      enrichConversations();
    }
  }, [rawConversations, firestore]);

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

  
  const { toFundCount, hiringCount, inProgressCount, archivedCount } = useMemo(() => {
    if (!campaigns || !conversations) return { toFundCount: 0, hiringCount: 0, inProgressCount: 0, archivedCount: 0 };
    
    const campaignsAwaitingPayment = new Set(
        conversations.filter(c => c.status === 'OFFER_ACCEPTED').map(c => c.campaign_id)
    );
    
    return {
      toFundCount: campaigns.filter(c => campaignsAwaitingPayment.has(c.id) || c.status === 'PENDING_PAYMENT').length,
      hiringCount: campaigns.filter(c => c.status === 'OPEN_FOR_APPLICATIONS' && (c.creatorIds?.length || 0) < (c.numberOfCreators || 1)).length,
      inProgressCount: campaigns.filter(c => ['IN_PROGRESS', 'DELIVERED', 'PENDING_CREATOR_ACCEPTANCE'].includes(c.status) || (c.status === 'OPEN_FOR_APPLICATIONS' && (c.creatorIds?.length || 0) >= (c.numberOfCreators || 1))).length,
      archivedCount: campaigns.filter(c => ['COMPLETED', 'REJECTED_BY_CREATOR'].includes(c.status)).length,
    }
  }, [campaigns, conversations]);
  
  const filteredCampaigns = useMemo(() => {
    if (!campaigns || !conversations) return [];
    
    const campaignsAwaitingPayment = new Set(
        conversations.filter(c => c.status === 'OFFER_ACCEPTED').map(c => c.campaign_id)
    );
    
    switch (activeFilter) {
      case 'to_fund':
        return campaigns.filter(c => campaignsAwaitingPayment.has(c.id) || c.status === 'PENDING_PAYMENT');
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
            randomDeliverables = [{ platform: 'instagram', type: 'Reel', quantity: 1 }, { platform: 'instagram', type: 'Story', quantity: 3 }];
        } else {
            randomDeliverables = [{ platform: 'instagram', type: 'UGC Video Vertical', quantity: 2 }];
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
    
  const handleViewDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsDetailsOpen(true);
  };

  const isLoading = isLoadingCampaigns || isLoadingConversations;

  const emptyStateIcons = {
      all: Search,
      to_fund: Wallet,
      hiring: Users,
      in_progress: Activity,
      archived: Archive,
  };

  const EmptyStateIcon = emptyStateIcons[activeFilter as keyof typeof emptyStateIcons] || FileText;

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
            <div className="relative">
                <TabsList className="p-1 h-auto bg-muted rounded-full w-full overflow-x-auto justify-start md:grid md:grid-cols-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                        {t('brandDashboard.filters.all')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{campaigns?.length || 0}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="to_fund" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                        {t('brandDashboard.filters.toFund')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 bg-blue-100 text-blue-800">{toFundCount}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="hiring" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                        {t('brandDashboard.filters.hiring')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 bg-green-100 text-green-800">{hiringCount}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="in_progress" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                        {t('brandDashboard.filters.inProgress')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{inProgressCount}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="archived" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                        {t('brandDashboard.filters.archived')} <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{archivedCount}</Badge>
                    </TabsTrigger>
                </TabsList>
                 <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background pointer-events-none md:hidden z-10"></div>
            </div>
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
                  onViewDetails={handleViewDetails}
              />
            )
          })}
        </div>
      ) : null}

      {!isLoading && (!filteredCampaigns || filteredCampaigns.length === 0) && (
        <EmptyState 
            title={t('brandDashboard.emptyFilter.title')}
            description={t('brandDashboard.emptyFilter.description')}
            icon={EmptyStateIcon}
            showCreateButton={activeFilter !== 'all'}
        />
      )}
      
      <CampaignDetailsDialog 
        campaign={selectedCampaign} 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}
