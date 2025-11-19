'use client';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, query, updateDoc, serverTimestamp, getDoc, writeBatch, getDocs, where } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, CheckCircle, XCircle, ShieldCheck, User, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { FirestorePermissionError } from '@/firebase/errors';
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

type Applicant = {
    id: string;
    creatorId: string;
    brandId: string;
    coverLetter: string;
    bidAmount: number;
    status: 'APPLIED' | 'NEGOTIATING' | 'REJECTED';
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

export default function ManageApplicationsPage() {
    const { campaignId } = useParams();
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();

    const campaignRef = useMemoFirebase(() => firestore ? doc(firestore, 'campaigns', campaignId as string) : null, [firestore, campaignId]);
    const { data: campaign, isLoading: isCampaignLoading } = useDoc(campaignRef);

    const applicationsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'campaigns', campaignId as string, 'applications')) : null, [firestore, campaignId]);
    const { data: applications, isLoading: areApplicationsLoading } = useCollection(applicationsQuery);

    const [applicants, setApplicants] = useState<Applicant[]>([]);

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
        if (!firestore || !user) return;
        toast({ title: 'Opening discussion...' });
        
        try {
            const batch = writeBatch(firestore);
            const applicationRef = doc(firestore, 'campaigns', campaignId as string, 'applications', applicant.id);
            batch.update(applicationRef, { status: 'NEGOTIATING' });
            
            // Create Conversation linked to Application
            const conversationDocRef = doc(collection(firestore, 'conversations'));
            batch.set(conversationDocRef, {
                campaign_id: campaignId,
                application_id: applicant.id,
                brand_id: applicant.brandId,
                creator_id: applicant.creatorId,
                status: 'NEGOTIATION', // Set status to NEGOTIATION
                agreed_budget: applicant.bidAmount,
                is_funded: false,
                lastMessage: `You opened a discussion with ${applicant.profile?.name || 'this creator'}.`,
                updatedAt: serverTimestamp(),
            });

             // Create initial system message in conversation
            const messageDocRef = doc(collection(firestore, 'conversations', conversationDocRef.id, 'messages'));
            batch.set(messageDocRef, {
                 conversation_id: conversationDocRef.id,
                 sender_id: user.uid,
                 type: 'TEXT',
                 content: `Discussion opened for campaign: "${campaign?.title}". The creator's cover letter is: \n\n"${applicant.coverLetter}"`,
                 timestamp: serverTimestamp(),
            });
            
            await batch.commit();

            toast({ title: 'Chat opened!', description: "You can now negotiate the terms with the creator." });
            router.push(`/chat/${conversationDocRef.id}`);
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Action Failed', description: error.message });
        }
    };
    
    const isLoading = isUserLoading || isCampaignLoading || areApplicationsLoading || (applications && applicants.length !== applications.length);

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
                        <AlertTitle>Access Denied</AlertTitle>
                        <AlertDescription>You do not have permission to manage this campaign.</AlertDescription>
                    </Alert>
                </main>
            </>
        )
    }

    const newApplicants = applicants.filter(a => a.status === 'APPLIED');
    const negotiatingApplicants = applicants.filter(a => a.status === 'NEGOTIATING');


    return (
        <>
            <AppHeader />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                 <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Manage Applications</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Review and select the best creator for your campaign: <strong>{campaign.title}</strong>
                    </p>
                </div>

                {campaign.status !== 'OPEN_FOR_APPLICATIONS' && (
                    <Alert>
                        <AlertTitle>This campaign is no longer accepting applications.</AlertTitle>
                        <AlertDescription>
                            Its current status is: <Badge variant="secondary">{campaign.status.replace(/_/g, ' ')}</Badge>.
                            <Button asChild variant="link"><Link href={`/campaigns/${campaignId}`}>View Campaign</Link></Button>
                        </AlertDescription>
                    </Alert>
                )}
                
                {applicants.length > 0 ? (
                    <div className="space-y-8">
                        {newApplicants.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">New Applicants</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {newApplicants.map(applicant => {
                                        const isBidHigher = campaign?.budget && applicant.bidAmount > campaign.budget;
                                        return (
                                        <Card key={applicant.id} className="flex flex-col">
                                            {/* Card content */}
                                            <CardHeader className="flex-row items-start gap-4">
                                                 <Avatar className="h-12 w-12">
                                                    <AvatarImage src={applicant.profile?.photoURL} alt={applicant.profile?.name} />
                                                    <AvatarFallback>{applicant.profile?.name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <CardTitle>{applicant.profile?.name?.split(' ')[0] || 'Creator'}</CardTitle>
                                                         <Badge variant="secondary" className={cn(
                                                            isBidHigher ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-green-100 text-green-800 border-green-200'
                                                         )}>
                                                            {isBidHigher && <ArrowUpRight className="h-3 w-3 mr-1" />}
                                                             {applicant.bidAmount} MAD
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <ShieldCheck className="h-4 w-4 text-green-500" />
                                                        <span>Trust Score: {applicant.trustScore}</span>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-grow space-y-4">
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4" /> Cover Letter</h4>
                                                    <p className="text-sm text-muted-foreground line-clamp-3 bg-muted/50 p-3 rounded-md border">{applicant.coverLetter}</p>
                                                </div>
                                                 <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="link" className="p-0 h-auto text-primary">
                                                            Read Full Letter
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Cover Letter from {applicant.profile?.name?.split(' ')[0] || 'Creator'}</AlertDialogTitle>
                                                        <AlertDialogDescription className="max-h-[60vh] overflow-y-auto pt-4 whitespace-pre-wrap">
                                                            {applicant.coverLetter}
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogAction>Close</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </CardContent>
                                            <CardFooter className="flex-col items-stretch gap-2 bg-muted/50 p-4 border-t">
                                                <div className="flex gap-2">
                                                    <Button className="w-full flex-1" onClick={() => handleShortlist(applicant)} disabled={campaign.status !== 'OPEN_FOR_APPLICATIONS'}>
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Discuss & Negotiate
                                                    </Button>
                                                    <Button variant="destructive" className="w-full flex-1" disabled={campaign.status !== 'OPEN_FOR_APPLICATIONS'}>
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                </div>
                                                 <Button asChild variant="ghost" className="w-full">
                                                    <Link href={`/creators/${applicant.creatorId}`}>
                                                        <User className="mr-2 h-4 w-4" />
                                                        View Profile
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        {/* Here we can list shortlisted/negotiating applicants later */}
                    </div>
                ) : (
                     <div className="text-center py-20 border-2 border-dashed rounded-lg">
                        <h2 className="text-2xl font-semibold">No Applications Yet</h2>
                        <p className="text-muted-foreground mt-2">Your campaign is live. Check back soon to see who has applied!</p>
                        <Button asChild variant="outline" className="mt-6">
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                )}
            </main>
        </>
    )
}
