
'use client';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, query, updateDoc, serverTimestamp, getDoc, writeBatch, getDocs, where, arrayUnion } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, CheckCircle, XCircle, ShieldCheck, User, MessageSquare, ArrowUpRight, UserCheck, Users, Hourglass, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
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
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/language-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreatorProfileSheet from '@/components/creator-profile-sheet';


type Applicant = {
    id: string; // application id
    campaignId: string;
    creatorId: string;
    brandId: string;
    coverLetter: string;
    bidAmount: number;
    status: 'APPLIED' | 'NEGOTIATING' | 'REJECTED' | 'OFFER_ACCEPTED';
    profile?: any; 
    trustScore: number;
    badge: 'Verified' | null;
};

const ApplicantCardSkeleton = () => (
    <Card>
        <CardHeader className="flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
            </div>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
        </CardContent>
        <CardFooter className="gap-2">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
        </CardFooter>
    </Card>
)

const HiringProgress = ({ campaign, hiredCreators }: { campaign: any, hiredCreators: any[] }) => {
    const { t } = useLanguage();
    if (!campaign) return null;
    const hiredCount = hiredCreators.length || 0;
    const totalNeeded = campaign.numberOfCreators || 1;
    const progress = totalNeeded > 0 ? Math.round((hiredCount / totalNeeded) * 100) : 0;

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{t('brandDashboard.hiringProgress')}</span>
                    <span className="text-lg font-bold">{hiredCount} / {totalNeeded}</span>
                </CardTitle>
                <CardDescription>{t('manageApplicationsPage.hiredDescription', { hired: hiredCount, total: totalNeeded })}</CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={progress} className="h-3" />
            </CardContent>
        </Card>
    )
}

export default function ManageApplicationsPage() {
    const { campaignId } = useParams();
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const { t } = useLanguage();
    const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const campaignRef = useMemoFirebase(() => firestore ? doc(firestore, 'campaigns', campaignId as string) : null, [firestore, campaignId]);
    const { data: campaign, isLoading: isCampaignLoading, mutate: mutateCampaign } = useDoc(campaignRef);

    const applicationsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'campaigns', campaignId as string, 'applications')) : null, [firestore, campaignId]);
    const { data: applications, isLoading: areApplicationsLoading, mutate: mutateApplications } = useCollection(applicationsQuery);

    const conversationsQuery = useMemoFirebase(() => firestore && user ? query(collection(firestore, 'conversations'), where('campaign_id', '==', campaignId), where('brand_id', '==', user.uid)) : null, [firestore, campaignId, user]);
    const { data: conversations, isLoading: areConversationsLoading } = useCollection(conversationsQuery);

    const [applicants, setApplicants] = useState<Applicant[]>([]);
    
    const handleViewProfile = (creatorId: string) => {
        setSelectedCreatorId(creatorId);
        setIsSheetOpen(true);
    };

    useEffect(() => {
        if (applications && firestore) {
            const fetchProfiles = async () => {
                const enrichedApplicants = await Promise.all(
                    applications.map(async (app) => {
                        const profileRef = doc(firestore, 'users', app.creatorId);
                        try {
                            const profileSnap = await getDoc(profileRef);
                            return { 
                                ...app,
                                profile: profileSnap.exists() ? profileSnap.data() : null,
                                trustScore: Math.floor(Math.random() * (98 - 75 + 1) + 75), // Random score
                                badge: Math.random() > 0.5 ? 'Verified' : null, // Random badge
                            };
                        } catch (error) {
                             const permissionError = new FirestorePermissionError({
                                path: profileRef.path,
                                operation: 'get',
                            });
                            errorEmitter.emit('permission-error', permissionError);
                            return { ...app, profile: null, trustScore: 0, badge: null };
                        }
                    })
                );
                setApplicants(enrichedApplicants as Applicant[]);
            };
            fetchProfiles();
        }
    }, [applications, firestore]);

    const handleShortlist = async (applicant: Applicant) => {
        if (!firestore || !user || !campaign) return;
        toast({ title: t('manageApplicationsPage.openingChatToast') });
        
        const batch = writeBatch(firestore);
        const applicationRef = doc(firestore, 'campaigns', campaignId as string, 'applications', applicant.id);
        batch.update(applicationRef, { status: 'NEGOTIATING' });
        
        const conversationDocRef = doc(collection(firestore, 'conversations'));
        const conversationData = {
            campaign_id: campaignId,
            application_id: applicant.id,
            brand_id: applicant.brandId,
            creator_id: applicant.creatorId,
            status: 'NEGOTIATION',
            agreed_budget: applicant.bidAmount,
            last_offer_by: applicant.creatorId, // Creator's bid is the first offer
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
            router.push(`/chat/${conversationDocRef.id}`);
        } catch(serverError) {
             const permissionError = new FirestorePermissionError({
                path: `BATCH_WRITE on /campaigns/${campaignId} and /conversations`,
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

    const handleAcceptAndHire = async (applicant: Applicant) => {
        if (!campaignRef || !firestore || !user || !campaign) return;
    
        toast({ title: t('manageApplicationsPage.hiringCreatorToast') });
        
        const currentHiredCount = campaign.creatorIds?.length || 0;
        const totalSeats = campaign.numberOfCreators || 1;
    
        if (currentHiredCount >= totalSeats) {
             toast({ variant: 'destructive', title: 'Campaign Full', description: 'You have already hired the maximum number of creators for this campaign.' });
            return;
        }
    
        try {
            const batch = writeBatch(firestore);
    
            // Update campaign: add creator and potentially change status
            const updates: any = {
                creatorIds: arrayUnion(applicant.creatorId),
                status: 'PENDING_CREATOR_ACCEPTANCE' // Always move to this state after an offer
            };

            batch.update(campaignRef, updates);
            
            // Update application status
            const applicationRef = doc(firestore, 'campaigns', campaignId as string, 'applications', applicant.id);
            batch.update(applicationRef, { status: 'OFFER_ACCEPTED' });
    
            await batch.commit();
    
            toast({ title: t('manageApplicationsPage.hiredToast.title'), description: t('manageApplicationsPage.hiredToast.description') });
            
            mutateCampaign(); // Re-fetch campaign data
            mutateApplications(); // Re-fetch applications
    
        } catch (error: any) {
             const permissionError = new FirestorePermissionError({
                path: campaignRef.path,
                operation: 'update',
                requestResourceData: {
                    creatorIds: arrayUnion(applicant.creatorId),
                    status: 'PENDING_CREATOR_ACCEPTANCE'
                }
            });
            errorEmitter.emit('permission-error', permissionError);
        }
    };
    
    const isLoading = isUserLoading || isCampaignLoading || areApplicationsLoading || (applications && applicants.length !== applications.length) || areConversationsLoading;

    if (isLoading) {
        return (
            <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8">
                    <Skeleton className="h-10 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-8" />
                    <div className="grid md:grid-cols-2 gap-6">
                        <ApplicantCardSkeleton />
                        <ApplicantCardSkeleton />
                    </div>
                </main>
            </>
        )
    }

    if (!user || !campaign || campaign.brandId !== user?.uid) {
         return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8 text-center">
                    <Alert variant="destructive">
                        <AlertTitle>{t('manageApplicationsPage.accessDenied.title')}</AlertTitle>
                        <AlertDescription>{t('manageApplicationsPage.accessDenied.description')}</AlertDescription>
                    </Alert>
                </main>
            </>
        )
    }

    const hiredCreators = applicants.filter(a => campaign.creatorIds?.includes(a.creatorId));
    const newApplicants = applicants.filter(a => a.status === 'APPLIED');
    const negotiatingApplicants = applicants.filter(a => a.status === 'NEGOTIATING');
    
    const canHireMore = (campaign.creatorIds?.length || 0) < campaign.numberOfCreators;

    const findConversationId = (applicantId: string) => {
        const convo = conversations?.find(c => c.application_id === applicantId);
        return convo ? convo.id : null;
    }

    const renderApplicantCard = (applicant: Applicant, type: 'hired' | 'discussion') => {
        const creatorName = applicant.profile?.displayName || applicant.profile?.name?.split(' ')[0] || t('manageApplicationsPage.creator');
        
        let badgeClass = 'bg-blue-100 text-blue-800';
        let badgeText = 'In Discussion';
        
        if (type === 'hired') {
            badgeClass = 'bg-green-100 text-green-800';
            badgeText = 'Hired';
        }

        const conversationId = findConversationId(applicant.id);

        return (
            <Card key={applicant.id} className="flex flex-col">
                <CardHeader className="flex-row items-start gap-4">
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={applicant.profile?.photoURL} alt={applicant.profile?.name} />
                        <AvatarFallback>{applicant.profile?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <CardTitle>{creatorName}</CardTitle>
                             <Badge variant="secondary" className={cn(badgeClass, 'font-semibold')}>
                                {badgeText}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            <span>{t('manageApplicationsPage.trustScore')}: {applicant.trustScore}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4" />{t('manageApplicationsPage.coverLetter')}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3 bg-muted/50 p-3 rounded-md border">{applicant.coverLetter}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-2 bg-muted/50 p-4 border-t">
                    {type === 'discussion' && conversationId && (
                         <Button asChild className="w-full">
                            <Link href={`/chat/${conversationId}`}>
                                Open Chat <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                         </Button>
                    )}
                     <Button variant="outline" className="w-full" onClick={() => handleViewProfile(applicant.creatorId)}>
                        <User className="mr-2 h-4 w-4" />
                        {t('manageApplicationsPage.viewProfileButton')}
                    </Button>
                </CardFooter>
            </Card>
        )
    };
    
    return (
        <>
            <AppHeader />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                 <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">{t('manageApplicationsPage.title')}</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        {t('manageApplicationsPage.description')} <strong>{campaign.title}</strong>
                    </p>
                </div>
                
                <HiringProgress campaign={campaign} hiredCreators={hiredCreators}/>

                {applicants.length > 0 ? (
                    <Tabs defaultValue="new" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="new">New<Badge variant="secondary" className="ml-2">{newApplicants.length}</Badge></TabsTrigger>
                        <TabsTrigger value="discussion">In Discussion<Badge variant="secondary" className="ml-2">{negotiatingApplicants.length}</Badge></TabsTrigger>
                        <TabsTrigger value="hired">Hired<Badge variant="secondary" className="ml-2">{hiredCreators.length}</Badge></TabsTrigger>
                      </TabsList>
                      <TabsContent value="new" className="mt-6">
                        {newApplicants.length > 0 ? (
                           <div className="grid md:grid-cols-2 gap-6">
                                {newApplicants.map(applicant => {
                                    const isBidHigher = campaign?.budget && applicant.bidAmount > campaign.budget;
                                    const creatorName = applicant.profile?.displayName || applicant.profile?.name?.split(' ')[0] || t('manageApplicationsPage.creator');
                                    return (
                                    <Card key={applicant.id} className="flex flex-col">
                                        <CardHeader className="flex-row items-start gap-4">
                                                <Avatar className="h-12 w-12">
                                                <AvatarImage src={applicant.profile?.photoURL} alt={applicant.profile?.name} />
                                                <AvatarFallback>{applicant.profile?.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <CardTitle>{creatorName}</CardTitle>
                                                        <Badge variant="secondary" className={cn(
                                                        isBidHigher ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-green-100 text-green-800 border-green-200'
                                                        )}>
                                                        {isBidHigher && <ArrowUpRight className="h-3 w-3 mr-1" />}
                                                            {applicant.bidAmount} MAD
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                                    <span>{t('manageApplicationsPage.trustScore')}: {applicant.trustScore}</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow space-y-4">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4" />{t('manageApplicationsPage.coverLetter')}</h4>
                                                <p className="text-sm text-muted-foreground line-clamp-3 bg-muted/50 p-3 rounded-md border">{applicant.coverLetter}</p>
                                            </div>
                                                <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="link" className="p-0 h-auto text-primary">
                                                        {t('manageApplicationsPage.readFullLetter')}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>{t('manageApplicationsPage.letterFrom', { name: creatorName })}</AlertDialogTitle>
                                                    <AlertDialogDescription className="max-h-[60vh] overflow-y-auto pt-4 whitespace-pre-wrap">
                                                        {applicant.coverLetter}
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogAction>{t('manageApplicationsPage.close')}</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </CardContent>
                                        <CardFooter className="flex-col items-stretch gap-2 bg-muted/50 p-4 border-t">
                                            <div className="flex gap-2">
                                                {isBidHigher ? (
                                                    <Button className="w-full flex-1" onClick={() => handleShortlist(applicant)} disabled={!canHireMore}>
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        {t('manageApplicationsPage.negotiateButton')}
                                                    </Button>
                                                ) : (
                                                    <Button className="w-full flex-1" onClick={() => handleAcceptAndHire(applicant)} disabled={!canHireMore}>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        {t('manageApplicationsPage.acceptButton')}
                                                    </Button>
                                                )}
                                                <Button variant="destructive" className="w-full flex-1" disabled={!canHireMore}>
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    {t('manageApplicationsPage.rejectButton')}
                                                </Button>
                                            </div>
                                                <Button asChild variant="ghost" className="w-full">
                                                <Link href={`/creators/${applicant.creatorId}`}>
                                                    <User className="mr-2 h-4 w-4" />
                                                    {t('manageApplicationsPage.viewProfileButton')}
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                    )
                                })}
                           </div>
                        ) : (
                             <div className="text-center py-20 border-2 border-dashed rounded-lg">
                                <h2 className="text-2xl font-semibold">No New Applications</h2>
                                <p className="text-muted-foreground mt-2">Check the other tabs for applicants who are in discussion or already hired.</p>
                            </div>
                        )}
                      </TabsContent>
                      <TabsContent value="discussion" className="mt-6">
                         {negotiatingApplicants.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {negotiatingApplicants.map(app => renderApplicantCard(app, 'discussion'))}
                            </div>
                        ) : (
                             <div className="text-center py-20 border-2 border-dashed rounded-lg">
                                <h2 className="text-2xl font-semibold">No Applicants in Discussion</h2>
                                <p className="text-muted-foreground mt-2">Shortlist new applicants to start negotiating.</p>
                            </div>
                        )}
                      </TabsContent>
                      <TabsContent value="hired" className="mt-6">
                         {hiredCreators.length > 0 ? (
                             <div className="grid md:grid-cols-2 gap-6">
                                {hiredCreators.map(app => renderApplicantCard(app, 'hired'))}
                            </div>
                        ) : (
                             <div className="text-center py-20 border-2 border-dashed rounded-lg">
                                <h2 className="text-2xl font-semibold">No Creators Hired Yet</h2>
                                <p className="text-muted-foreground mt-2">Accept an applicant's offer to hire them for this campaign.</p>
                            </div>
                        )}
                      </TabsContent>
                    </Tabs>
                ) : (
                     <div className="text-center py-20 border-2 border-dashed rounded-lg">
                        <h2 className="text-2xl font-semibold">{t('manageApplicationsPage.noApplications.title')}</h2>
                        <p className="text-muted-foreground mt-2">{t('manageApplicationsPage.noApplications.description')}</p>
                        <Button asChild variant="outline" className="mt-6">
                            <Link href="/dashboard">{t('manageApplicationsPage.noApplications.cta')}</Link>
                        </Button>
                    </div>
                )}
            </main>
             <CreatorProfileSheet 
                creatorId={selectedCreatorId}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </>
    )
}

    