
'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { PlusCircle, Users, Activity, FileText, CircleDollarSign, MoreVertical, Edit, Trash2, Sparkles, Wallet } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc, serverTimestamp, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
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

const statusStyles: { [key: string]: string } = {
    OPEN_FOR_APPLICATIONS: 'bg-green-100 text-green-800 border-green-200',
    PENDING_SELECTION: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PENDING_CREATOR_ACCEPTANCE: 'bg-blue-100 text-blue-800 border-blue-200',
    OFFER_PENDING: 'bg-blue-100 text-blue-800 border-blue-200',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse',
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

const CampaignCard = ({ campaign, onDelete, applicationCount }: { campaign: any, onDelete: (campaignId: string) => Promise<void>, applicationCount: number }) => {
    const { t } = useLanguage();
    const hiredCount = campaign.creatorIds?.length || 0;
    const totalNeeded = campaign.numberOfCreators || 1;
    const hiringProgress = totalNeeded > 0 ? (hiredCount / totalNeeded) * 100 : 0;
    const isAwaitingPayment = campaign.status === 'PENDING_PAYMENT';


    const manageButtonLink = `/campaigns/${campaign.id}/manage`;

    const formattedDate = campaign.createdAt && typeof campaign.createdAt.toDate === 'function' 
        ? format(campaign.createdAt.toDate(), 'MMM d, yyyy') 
        : 'Just now';

    return (
        <Card className={cn("hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card", isAwaitingPayment && "border-blue-500 shadow-blue-500/10 ring-2 ring-blue-500/20")}>
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
                        {isAwaitingPayment ? 'Awaiting Your Payment' : campaign.status.replace(/_/g, ' ')}
                    </Badge>
                 </div>
            </CardHeader>
            <CardContent className="flex-grow">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                        <span>{t('brandDashboard.hiringProgress')}</span>
                        <span>{hiredCount} / {totalNeeded}</span>
                    </div>
                    <Progress value={hiringProgress} className="h-2" />
                 </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-3">
                {isAwaitingPayment ? (
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white animate-pulse">
                        <Link href={`/campaigns/${campaign.id}/pay`}>
                            <Wallet className="mr-2 h-4 w-4" />
                            FUND NOW
                        </Link>
                    </Button>
                ) : (campaign.status !== 'COMPLETED' && campaign.status !== 'REJECTED_BY_CREATOR') ? (
                     <Button asChild variant="secondary" className="w-full">
                        <Link href={manageButtonLink}>
                            <Users className="mr-2 h-4 w-4" />
                            {t('brandDashboard.manageButton')}
                            {applicationCount > 0 && <Badge className="ml-2 bg-primary text-primary-foreground">{applicationCount}</Badge>}
                        </Link>
                    </Button>
                ) : (
                    <Button asChild className="w-full">
                        <Link href={`/campaigns/${campaign.id}`}>{t('brandDashboard.viewButton')}</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};


export default function BrandDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ activeCampaigns: 0, totalBudget: 0 });
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    if (user && firestore) {
      const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
          const q = query(collection(firestore, 'campaigns'), where('brandId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const campaignsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCampaigns(campaignsData);
        } catch (error) {
          console.error("Error fetching campaigns: ", error);
          setCampaigns([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCampaigns();
    }
  }, [user, firestore]);
  
  useEffect(() => {
    if (campaigns && firestore && user) {
        setIsStatsLoading(true);
        let totalBudget = 0;
        const activeCampaigns = campaigns.filter(c => c.status !== 'COMPLETED' && c.status !== 'REJECTED_BY_CREATOR').length;
        if (campaigns.length > 0) {
            totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0) * (c.numberOfCreators || 1), 0);
        }
        setStats({ activeCampaigns, totalBudget });
        setIsStatsLoading(false);

        const unsubscribes: Unsubscribe[] = campaigns.map(campaign => {
            const q = query(collection(firestore, 'campaigns', campaign.id, 'applications'), where('status', '==', 'APPLIED'));
            return onSnapshot(q, (snapshot) => {
                setApplicationCounts(prev => ({ ...prev, [campaign.id]: snapshot.size }));
            });
        });

        return () => unsubscribes.forEach(unsub => unsub());

    } else if (!isLoading) {
        setIsStatsLoading(false);
    }
  }, [campaigns, firestore, user, isLoading]);

  const totalApplications = Object.values(applicationCounts).reduce((sum, count) => sum + count, 0);

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!firestore) return;
    toast({ title: t('brandDashboard.deleteToast.deleting') });

    const campaignRef = doc(firestore, 'campaigns', campaignId);
    
    try {
        await deleteDoc(campaignRef);
        setCampaigns(prev => prev ? prev.filter(c => c.id !== campaignId) : null);
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

        const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
        const randomBrief = sampleBriefs[Math.floor(Math.random() * sampleBriefs.length)];
        const randomTags = sampleTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
        const randomBudget = Math.floor(Math.random() * 20 + 5) * 100; // 500 to 2500
        const randomCreators = Math.floor(Math.random() * 5) + 1;

        const testCampaign = {
            title: `(Test) ${randomTitle}`,
            campaignBrief: randomBrief,
            deliverables: ["1 Instagram Reel", "3 Instagram Stories"],
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
            const docRef = await addDoc(collection(firestore, 'campaigns'), testCampaign);
            setCampaigns(prev => prev ? [{ id: docRef.id, ...testCampaign }, ...prev] : [{ id: docRef.id, ...testCampaign }]);
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
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard isLoading={isStatsLoading} title={t('brandDashboard.stats.active')} value={stats.activeCampaigns} icon={<Activity className="h-4 w-4 text-muted-foreground" />} />
        <StatCard isLoading={isLoading} title={t('brandDashboard.stats.applications')} value={totalApplications} icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
        <StatCard isLoading={isStatsLoading} title={t('brandDashboard.stats.budget')} value={`${stats.totalBudget.toLocaleString()} DH`} icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />} />
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
            <CampaignCard 
                campaign={campaign} 
                key={campaign.id} 
                onDelete={handleDeleteCampaign}
                applicationCount={applicationCounts[campaign.id] || 0}
            />
          ))}
        </div>
      ) : null}

      {!isLoading && (!campaigns || campaigns.length === 0) && (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20 mt-8">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
              <PlusCircle className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold">{t('brandDashboard.emptyState.title')}</h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">{t('brandDashboard.emptyState.description')}</p>
            <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
                <Link href="/campaigns/create">
                    {t('brandDashboard.emptyState.cta')}
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
