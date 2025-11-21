
'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ArrowDown, ArrowUp, ChevronDown, FileText, Inbox, MessageSquare, PlusCircle, X, ShieldCheck } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import CreatorProfileSheet from '@/components/creator-profile-sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

type Applicant = {
  id: string; // application id
  campaignId: string;
  creatorId: string;
  brandId: string;
  coverLetter: string;
  bidAmount: number;
  status: 'APPLIED' | 'NEGOTIATING' | 'REJECTED';
  profile?: any;
  createdAt: any;
  trustScore: number;
};

const ApplicantCard = ({ application, campaign, onSelectCreator, onStartDiscussion, onDecline }: { application: Applicant; campaign: any; onSelectCreator: (creatorId: string) => void; onStartDiscussion: (app: Applicant) => void; onDecline: (app: Applicant) => void; }) => {
    const {t} = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const isBidDifferent = application.bidAmount !== campaign.budget;
    const isBidHigher = application.bidAmount > campaign.budget;
    const budgetLabel = isBidDifferent ? "Proposed" : "Budget";
    const actionButtonText = isBidDifferent ? "Discuss & Negotiate" : "Accept & Discuss";
    const BudgetIcon = isBidDifferent ? (isBidHigher ? ArrowUp : ArrowDown) : null;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="transition-all hover:shadow-md">
                 <CardHeader className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CollapsibleTrigger asChild>
                            <div className="flex items-start gap-4 flex-1 cursor-pointer">
                                <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={application.profile?.photoURL} alt={application.profile?.name} />
                                    <AvatarFallback>{application.profile?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {application.profile?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{t('talentHub.card.appliedTo')} <span className="font-medium text-foreground">{campaign.title}</span></p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                            <ShieldCheck className="h-3 w-3 mr-1" />
                                            Trust Score: {application.trustScore}
                                        </Badge>
                                        <div className="text-sm flex items-center">
                                            <span className="text-muted-foreground mr-1.5">{budgetLabel}: </span>
                                            <span className={cn(
                                                "font-bold flex items-center",
                                                isBidDifferent && (isBidHigher ? "text-orange-500" : "text-green-600")
                                            )}>
                                                {BudgetIcon && <BudgetIcon className="h-4 w-4 mr-1" />}
                                                {application.bidAmount} {t('currency')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleTrigger>
                         <div className="flex items-center gap-2 self-start sm:self-center ml-auto sm:ml-0 pl-16 sm:pl-0">
                            <Button variant="outline" size="sm" onClick={() => onSelectCreator(application.creatorId)}>
                                View Profile <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                    <ChevronDown className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180")} />
                                    <span className="sr-only">Expand</span>
                                </Button>
                             </CollapsibleTrigger>
                         </div>
                    </div>
                </CardHeader>

                <CollapsibleContent>
                    <div className="border-t">
                        <div className="p-4 space-y-4">
                             <h4 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4" /> Why you?</h4>
                             <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border whitespace-pre-wrap">{application.coverLetter}</p>
                        </div>
                        <CardFooter className="bg-muted/50 p-3 border-t flex flex-col sm:flex-row items-stretch gap-2">
                             <Button className="w-full flex-1" onClick={() => onStartDiscussion(application)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {actionButtonText}
                            </Button>
                            <Button variant="destructive" className="w-full flex-1" onClick={() => onDecline(application)}>
                                <X className="mr-2 h-4 w-4" />
                                Decline
                            </Button>
                        </CardFooter>
                    </div>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    )
}


const CampaignApplicationsGroup = ({ campaign, applications, onSelectCreator, onStartDiscussion, onDecline }: { campaign: any, applications: any[], onSelectCreator: (creatorId: string) => void; onStartDiscussion: (app: Applicant) => void; onDecline: (app: Applicant) => void; }) => {
    if (applications.length === 0) return null;
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
                {campaign.title}
                <Badge variant="outline">{applications.length}</Badge>
            </h2>
            <div className="space-y-4">
                {applications.map(app => (
                    <ApplicantCard key={app.id} application={app} campaign={campaign} onSelectCreator={onSelectCreator} onStartDiscussion={onStartDiscussion} onDecline={onDecline} />
                ))}
            </div>
        </div>
    )
}

export default function TalentHubPage() {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useLanguage();

    const campaignsQuery = useMemoFirebase(
        () => (user && firestore) ? query(collection(firestore, 'campaigns'), where('brandId', '==', user.uid), where('status', '==', 'OPEN_FOR_APPLICATIONS')) : null,
        [user, firestore]
    );
    const { data: campaigns, isLoading: isLoadingCampaigns } = useCollection(campaignsQuery);

    useEffect(() => {
        if (isLoadingCampaigns || !campaigns || !firestore) return;

        const fetchAllData = async () => {
            setIsLoading(true);
            const enrichedApplications: any[] = [];

            for (const campaign of campaigns) {
                // Fetch only applications with 'APPLIED' status
                const appsRef = collection(firestore, 'campaigns', campaign.id, 'applications');
                const q = query(appsRef, where('status', '==', 'APPLIED'));
                const appsSnapshot = await getDocs(q);

                if (!appsSnapshot.empty) {
                    for (const appDoc of appsSnapshot.docs) {
                        const appData = { id: appDoc.id, ...appDoc.data() };
                        const profileRef = doc(firestore, 'users', appData.creatorId);
                        const profileSnap = await getDoc(profileRef);
                        enrichedApplications.push({
                            ...appData,
                            profile: profileSnap.exists() ? profileSnap.data() : null,
                            trustScore: Math.floor(Math.random() * (98 - 75 + 1) + 75), // Random score
                        });
                    }
                }
            }
            setApplicants(enrichedApplications.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds) as Applicant[]);
            setIsLoading(false);
        };

        fetchAllData();

    }, [campaigns, isLoadingCampaigns, firestore]);

    const campaignsWithApps = useMemo(() => {
        if (!campaigns) return [];
        return campaigns.filter(c => applicants.some(a => a.campaignId === c.id));
    }, [campaigns, applicants]);

    const handleSelectCreator = (creatorId: string) => {
        setSelectedCreatorId(creatorId);
        setIsSheetOpen(true);
    }
    
    const handleStartDiscussion = async (applicant: Applicant) => {
        if (!firestore || !user) return;
        toast({ title: t('manageApplicationsPage.openingChatToast') });
        
        const batch = writeBatch(firestore);
        const applicationRef = doc(firestore, 'campaigns', applicant.campaignId, 'applications', applicant.id);
        batch.update(applicationRef, { status: 'NEGOTIATING' });
        
        const conversationDocRef = doc(collection(firestore, 'conversations'));
        const campaign = campaigns?.find(c => c.id === applicant.campaignId);
        const conversationData = {
            campaign_id: applicant.campaignId,
            application_id: applicant.id,
            brand_id: applicant.brandId,
            creator_id: applicant.creatorId,
            status: 'NEGOTIATION',
            agreed_budget: applicant.bidAmount,
            last_offer_by: applicant.creatorId,
            is_funded: false,
            lastMessage: `Discussion opened. Creator's opening offer is ${applicant.bidAmount} MAD.`,
            updatedAt: serverTimestamp(),
        };
        batch.set(conversationDocRef, conversationData);

        const messageDocRef = doc(collection(firestore, 'conversations', conversationDocRef.id, 'messages'));
        const messageData = {
             conversation_id: conversationDocRef.id,
             sender_id: user.uid, 
             type: 'TEXT',
             content: `Discussion opened for campaign: "${campaign?.title}".\n\nCreator's opening offer is ${applicant.bidAmount} MAD and their cover letter is:\n\n"${applicant.coverLetter}"`,
             timestamp: serverTimestamp(),
        };
        batch.set(messageDocRef, messageData);
        
        try {
            await batch.commit();
            toast({ title: t('manageApplicationsPage.chatOpenedToast.title'), description: t('manageApplicationsPage.chatOpenedToast.description') });
            setApplicants(prev => prev.filter(a => a.id !== applicant.id));
            router.push(`/chat/${conversationDocRef.id}`);
        } catch (serverError) {
             const permissionError = new FirestorePermissionError({
                path: `BATCH_WRITE on /campaigns/${applicant.campaignId} and /conversations`,
                operation: 'write',
                requestResourceData: {
                    applicationUpdate: { status: 'NEGOTIATING' },
                    newConversation: conversationData,
                    newMessage: messageData
                }
            });
            errorEmitter.emit('permission-error', permissionError);
        }
    };
    
    const handleDecline = async (applicant: Applicant) => {
        if (!firestore) return;
        
        const appRef = doc(firestore, 'campaigns', applicant.campaignId, 'applications', applicant.id);
        try {
            await updateDoc(appRef, { status: 'REJECTED' });
            toast({
                variant: 'destructive',
                title: "Application Declined",
                description: `${applicant.profile?.name || 'Creator'}'s application has been declined.`,
            });
            setApplicants(prev => prev.filter(a => a.id !== applicant.id));
        } catch (serverError) {
            const permissionError = new FirestorePermissionError({
                path: appRef.path,
                operation: 'update',
                requestResourceData: { status: 'REJECTED' }
            });
            errorEmitter.emit('permission-error', permissionError);
        }
    };


    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="flex-1 px-4 md:px-10 lg:px-20 py-10 md:py-16">
                 <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                           {t('talentHub.title')}
                        </h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl text-foreground/60">
                            {t('talentHub.description')}
                        </p>
                    </div>

                    {isLoading && (
                        <div className="space-y-4">
                            <Skeleton className="h-28 w-full" />
                            <Skeleton className="h-28 w-full" />
                            <Skeleton className="h-28 w-full" />
                        </div>
                    )}

                    {!isLoading && applicants.length > 0 && campaigns ? (
                        <div className="space-y-12">
                            {campaignsWithApps.map(campaign => (
                                <CampaignApplicationsGroup
                                    key={campaign.id}
                                    campaign={campaign}
                                    applications={applicants.filter(a => a.campaignId === campaign.id)}
                                    onSelectCreator={handleSelectCreator}
                                    onStartDiscussion={handleStartDiscussion}
                                    onDecline={handleDecline}
                                />
                            ))}
                        </div>
                    ) : null}

                     {!isLoading && applicants.length === 0 && (
                        <div className="text-center py-24 border-2 border-dashed rounded-lg bg-muted/30">
                             <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                                <Inbox className="h-8 w-8 text-black" />
                            </div>
                            <h2 className="text-2xl font-semibold mt-4">{t('talentHub.empty.title')}</h2>
                            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">{t('talentHub.empty.description')}</p>
                            <Button asChild size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
                                <Link href="/campaigns/create">
                                    <PlusCircle className="mr-2 h-5 w-5" />
                                    {t('brandDashboard.createButton')}
                                </Link>
                            </Button>
                        </div>
                    )}
                 </div>
            </main>
             <CreatorProfileSheet 
                creatorId={selectedCreatorId} 
                open={isSheetOpen} 
                onOpenChange={setIsSheetOpen} 
            />
        </div>
    );
}
