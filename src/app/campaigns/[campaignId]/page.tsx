
'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase, useUserProfile } from '@/firebase';
import { doc, updateDoc, serverTimestamp, collection, query, where, getDocs, getDoc, writeBatch } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, Send, CheckCircle, Hand, Sparkles, UserCheck, Users, MessageSquare, Package, AlertCircle, FileText, CircleDollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { useLanguage } from '@/context/language-context';
import { Separator } from '@/components/ui/separator';

const statusStyles: { [key: string]: string } = {
    OPEN_FOR_APPLICATIONS: 'bg-green-100 text-green-800',
    PENDING_SELECTION: 'bg-yellow-100 text-yellow-800',
    YOUR_ACCEPTANCE: 'bg-blue-100 text-blue-800 animate-pulse',
    OFFER_PENDING: 'bg-yellow-100 text-yellow-800',
    PENDING_CREATOR_ACCEPTANCE: 'bg-blue-100 text-blue-800',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    REJECTED_BY_CREATOR: 'bg-red-100 text-red-800',
};


const CampaignDetailSkeleton = () => (
    <div className="grid gap-8">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
        </Card>
        <Skeleton className="h-48 w-full" />
    </div>
)

const CreatorInvitation = ({ campaign, campaignRef, brandProfile }: { campaign: any, campaignRef: any, brandProfile: any }) => {
    const { toast } = useToast();

    const handleAccept = async () => {
        try {
            await updateDoc(campaignRef, { 
                status: 'IN_PROGRESS', 
                updatedAt: serverTimestamp() 
            });
            toast({ title: 'Offer Accepted!', description: 'The campaign is now active. Good luck!'});
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Action Failed', description: e.message });
        }
    };
    
    const handleDecline = async () => {
        try {
            await updateDoc(campaignRef, { 
                status: 'REJECTED_BY_CREATOR', 
                updatedAt: serverTimestamp() 
            });
            toast({ title: 'Offer Declined', description: 'The brand has been notified.'});
        } catch (e: any) {
             toast({ variant: 'destructive', title: 'Action Failed', description: e.message });
        }
    };

    return (
        <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900/30 dark:via-background dark:to-blue-900/30 border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/10">
            <CardHeader className="text-center items-center">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-black mb-4 shadow-lg shadow-primary/30">
                    <Sparkles className="h-8 w-8" />
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight">You've Been Selected!</CardTitle>
                <CardDescription className="max-w-md mx-auto text-lg">
                    <span className="font-semibold">{brandProfile?.name || 'A brand'}</span> has chosen you for the campaign "{campaign.title}" and funded the escrow. Please confirm to start.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div>
                    <p className="text-sm uppercase font-semibold text-muted-foreground">Proposed Budget</p>
                    <p className="text-4xl font-bold gradient-text">{campaign.budget} DH</p>
                </div>
                <div className="flex justify-center gap-4">
                    <Button onClick={handleAccept} size="lg" className="gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
                        <Check className="mr-2 h-5 w-5" /> Accept & Start Mission
                    </Button>
                    <Button onClick={handleDecline} size="lg" variant="ghost">Decline</Button>
                </div>
            </CardContent>
        </Card>
    );
}

const BrandWorkspace = ({ campaign, campaignId, hiredCreators, conversations }: { campaign: any, campaignId: string, hiredCreators: any[], conversations: any[] }) => {
    const router = useRouter();

    const hiredCount = campaign.creatorIds?.length || 0;
    const totalNeeded = campaign.numberOfCreators || 1;
    const isHiringOpen = hiredCount < totalNeeded;

    const findConversationId = (creatorId: string) => {
        const convo = conversations.find(c => c.creator_id === creatorId);
        return convo ? convo.id : null;
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand Workspace</CardTitle>
                <CardDescription>Manage your campaign and hired creators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {campaign.status === 'PENDING_PAYMENT' && (
                    <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800">Action Required</h3>
                        <p className="text-blue-700 mt-2">The creator has accepted the campaign. Please proceed with the payment to get started.</p>
                        <Button className="mt-6" onClick={() => router.push(`/campaigns/${campaignId}/pay`)}>
                            Proceed to Payment
                        </Button>
                    </div>
                )}
                {campaign.status === 'OFFER_PENDING' && (
                    <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="text-xl font-semibold text-yellow-800">Offer Sent</h3>
                        <p className="text-yellow-700 mt-2">The creator has been notified. We are awaiting their final confirmation to start the contract.</p>
                    </div>
                )}
                 {campaign.status === 'DELIVERED' && (
                    <div className="text-center p-8 bg-purple-50 border border-purple-200 rounded-lg">
                        <h3 className="text-xl font-semibold text-purple-800">Deliverables Ready for Review</h3>
                        <p className="text-purple-700 mt-2">The creator has submitted the work. Please review and approve to release payment.</p>
                        <Button className="mt-6" onClick={() => { /* handleApprove */ }}>
                           ✅ Validate & Release Payment
                        </Button>
                    </div>
                )}
                {(campaign.status === 'OPEN_FOR_APPLICATIONS') && (
                     <Alert>
                        <Users className="h-4 w-4"/>
                        <AlertDescription className="text-center">
                            <Link href={`/campaigns/${campaignId}/manage`} className="font-semibold text-primary hover:underline">Manage incoming applications</Link> to find the perfect creator.
                        </AlertDescription>
                    </Alert>
                )}
                {campaign.status === 'IN_PROGRESS' && (
                     <p className="text-muted-foreground text-center">The campaign is in progress. You will be notified when creators submit their deliverables.</p>
                )}
                 {campaign.status === 'COMPLETED' && (
                     <p className="text-muted-foreground text-center">This campaign is complete.</p>
                )}
                 {hiredCreators.length > 0 && (
                     <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" /> Hired &amp; Contacted Creators ({hiredCount}/{totalNeeded})</h4>
                        <div className="flex flex-col gap-3">
                            {hiredCreators.map(creator => {
                                const isPending = campaign.status === 'PENDING_CREATOR_ACCEPTANCE' && campaign.creatorIds.includes(creator.uid);
                                const conversationId = findConversationId(creator.uid);

                                return (
                                <div key={creator.uid} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-muted/50 border">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={creator.photoURL} alt={creator.name} />
                                            <AvatarFallback>{creator.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <span className="text-sm font-medium">{creator.name}</span>
                                            <div><Badge variant={isPending ? 'outline' : 'secondary'} className={cn(isPending && 'border-blue-200 bg-blue-50 text-blue-800')}>{isPending ? 'Pending Acceptance' : 'Accepted'}</Badge></div>
                                        </div>
                                    </div>
                                     {conversationId && (
                                        <Button asChild size="sm" variant="ghost">
                                            <Link href={`/chat/${conversationId}`}>
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Chat
                                            </Link>
                                        </Button>
                                     )}
                                </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}


export default function CampaignPage() {
    const { campaignId } = useParams();
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const { userProfile } = useUserProfile();
    const { t } = useLanguage();
    const [isAlreadyApplied, setIsAlreadyApplied] = useState<boolean | null>(null);
    const [hiredCreators, setHiredCreators] = useState<any[]>([]);

    const campaignRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'campaigns', campaignId as string) : null,
        [firestore, campaignId]
    );
    const { data: campaign, isLoading: isCampaignLoading, error } = useDoc(campaignRef);

    const brandRef = useMemoFirebase(
        () => (firestore && campaign?.brandId) ? doc(firestore, 'users', campaign.brandId) : null,
        [firestore, campaign]
    );
    const { data: brandProfile, isLoading: isBrandLoading } = useDoc(brandRef);

    const conversationsQuery = useMemoFirebase(() => (firestore && campaignId) ? query(collection(firestore, 'conversations'), where('campaign_id', '==', campaignId)) : null, [firestore, campaignId]);
    const { data: conversations, isLoading: areConversationsLoading } = useCollection(conversationsQuery);


    useEffect(() => {
        if (user && firestore && campaignId) {
            const checkApplication = async () => {
                const applicationsRef = collection(firestore, 'campaigns', campaignId as string, 'applications');
                const q = query(applicationsRef, where("creatorId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                setIsAlreadyApplied(!querySnapshot.empty);
            };
            checkApplication();
        }
    }, [user, firestore, campaignId]);
    
    useEffect(() => {
        if (firestore && campaign?.creatorIds?.length > 0) {
            const fetchCreators = async () => {
                if(hiredCreators.length === campaign.creatorIds.length) return;

                const creatorPromises = campaign.creatorIds.map(async (creatorId: string) => {
                    const creatorRef = doc(firestore, 'users', creatorId);
                    const creatorSnap = await getDoc(creatorRef);
                     if (creatorSnap.exists()) {
                        return {uid: creatorId, ...creatorSnap.data()};
                    }
                    return null;
                });

                const creatorsData = (await Promise.all(creatorPromises)).filter(c => c !== null);
                setHiredCreators(creatorsData);
            };
            fetchCreators();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firestore, campaign]);


    const isLoading = isUserLoading || isCampaignLoading || isAlreadyApplied === null || isBrandLoading || areConversationsLoading;

    if (isLoading) {
        return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8">
                   <CampaignDetailSkeleton />
                </main>
            </>
        )
    }

    if (!campaign || error) {
        return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8 text-center">
                    <h1 className="text-2xl font-bold">Campaign not found</h1>
                    <p className="text-muted-foreground">The campaign you are looking for does not exist or you do not have permission to view it.</p>
                    <Button asChild className="mt-4"><Link href="/dashboard">Back to Dashboard</Link></Button>
                </main>
            </>
        )
    }

    const isBrandOwner = user?.uid === campaign.brandId;
    const isSelectedCreator = campaign.creatorIds?.includes(user?.uid);
    const isPotentialApplicant = userProfile?.role === 'creator' && !isBrandOwner && !isSelectedCreator;
    const canView = isBrandOwner || isSelectedCreator || campaign.status === 'OPEN_FOR_APPLICATIONS';

    if(!canView) {
         return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8 text-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="text-muted-foreground">You do not have permission to view this campaign.</p>
                    <Button asChild className="mt-4"><Link href="/dashboard">Back to Dashboard</Link></Button>
                </main>
            </>
        )
    }

    const showInvitation = isSelectedCreator && campaign.status === 'OFFER_PENDING';
    
    let badgeStatus = campaign.status;
    let badgeText = t(`status.${badgeStatus}`, { default: badgeStatus.replace(/_/g, ' ') });
    if (isSelectedCreator && campaign.status === 'OFFER_PENDING') {
        badgeStatus = 'YOUR_ACCEPTANCE';
        badgeText = t('status.YOUR_ACCEPTANCE');
    }
    
    const remainingSlots = Math.max(0, (campaign.numberOfCreators || 1) - (campaign.creatorIds?.length || 0));

    return (
        <>
            <AppHeader />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid gap-8">
                    {showInvitation && <CreatorInvitation campaign={campaign} campaignRef={campaignRef} brandProfile={brandProfile} />}
                    
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex-1">
                                    <Badge className={cn('whitespace-nowrap text-xs mb-2', statusStyles[badgeStatus])}>
                                        {badgeText}
                                    </Badge>
                                    <CardTitle className="text-3xl tracking-tight font-extrabold">{campaign.title}</CardTitle>
                                    <div className="flex items-center gap-2 mt-3">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={brandProfile?.photoURL || brandProfile?.logoUrl} alt={brandProfile?.name} />
                                            <AvatarFallback>{brandProfile?.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-muted-foreground">{t('campaignPage.postedBy')} {brandProfile?.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm flex-shrink-0">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CircleDollarSign className="h-4 w-4" />
                                        <span className="font-semibold text-foreground">{campaign.budget} {t('currency')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span className="font-semibold text-foreground">{remainingSlots} {t('campaignPage.slotsRemaining')}</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('campaignPage.briefTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-foreground/80 whitespace-pre-wrap">{campaign.campaignBrief}</p>
                        </CardContent>
                    </Card>

                    {campaign.deliverables && campaign.deliverables.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('campaignPage.deliverablesTitle')}</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <ul className="space-y-3">
                                    {campaign.deliverables.map((item: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                    
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><AlertCircle className="text-primary"/> {t('campaignPage.conditionsTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {campaign.productLogistics && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Package className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{t('campaignPage.logistics.title')}</h4>
                                        <p className="text-sm text-muted-foreground">{t(`logistics.${campaign.productLogistics}`)}</p>
                                    </div>
                                </div>
                            )}
                            {campaign.instructions && (
                                <div className="flex items-start gap-4">
                                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <FileText className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{t('campaignPage.instructions.title')}</h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{campaign.instructions}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                         {isPotentialApplicant && campaign.status === 'OPEN_FOR_APPLICATIONS' && (
                            <CardFooter>
                                {isAlreadyApplied ? (
                                     <Button disabled className="w-full bg-green-600 hover:bg-green-600">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {t('discoverCampaigns.applied')}
                                    </Button>
                                ) : (
                                    <Button asChild className="w-full">
                                        <Link href={`/campaigns/${campaignId}/apply`}>{t('discoverCampaigns.applyNow')}</Link>
                                    </Button>
                                )}
                            </CardFooter>
                        )}
                    </Card>


                    {isBrandOwner && <BrandWorkspace campaign={campaign} campaignId={campaignId as string} hiredCreators={hiredCreators} conversations={conversations || []} />}

                </div>
            </main>
        </>
    );
}
