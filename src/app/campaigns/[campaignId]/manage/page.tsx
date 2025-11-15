'use client';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, query, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

type Applicant = {
    id: string;
    creatorId: string;
    coverLetter: string;
    status: 'pending' | 'accepted' | 'rejected';
    profile?: any; 
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
                        const profileSnap = await getDoc(profileRef);
                        return { ...app, profile: profileSnap.exists() ? profileSnap.data() : null };
                    })
                );
                setApplicants(enrichedApplicants);
            };
            fetchProfiles();
        }
    }, [applications, firestore]);

    const handleAccept = async (applicationId: string, creatorId: string) => {
        if (!campaignRef || !firestore) return;
        toast({ title: 'Accepting Application...' });
        
        const applicationRef = doc(firestore, 'campaigns', campaignId as string, 'applications', applicationId);
        const campaignUpdateData = {
            creatorId: creatorId,
            status: 'PENDING_CREATOR_ACCEPTANCE',
            updatedAt: serverTimestamp(),
        };
        const applicationUpdateData = {
            status: 'accepted',
        };

        // Non-blocking optimistic updates
        updateDoc(campaignRef, campaignUpdateData).catch(error => {
            const permissionError = new FirestorePermissionError({
                path: campaignRef.path,
                operation: 'update',
                requestResourceData: campaignUpdateData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });

        updateDoc(applicationRef, applicationUpdateData).catch(error => {
             const permissionError = new FirestorePermissionError({
                path: applicationRef.path,
                operation: 'update',
                requestResourceData: applicationUpdateData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });

        toast({ title: 'Creator Selected!', description: "They've been notified to accept the offer." });
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

                {campaign.status !== 'OPEN_FOR_APPLICATIONS' && campaign.status !== 'PENDING_SELECTION' && (
                    <Alert>
                        <AlertTitle>This campaign is no longer accepting applications.</AlertTitle>
                        <AlertDescription>
                            Its current status is: <Badge variant="secondary">{campaign.status.replace(/_/g, ' ')}</Badge>.
                            <Button asChild variant="link"><Link href={`/campaigns/${campaignId}`}>View Campaign</Link></Button>
                        </AlertDescription>
                    </Alert>
                )}
                
                {applicants.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {applicants.map(applicant => (
                             <Card key={applicant.id}>
                                <CardHeader className="flex-row items-center gap-4">
                                     <Avatar className="h-12 w-12">
                                        <AvatarImage src={applicant.profile?.photoURL} alt={applicant.profile?.name} />
                                        <AvatarFallback>{applicant.profile?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{applicant.profile?.name || 'Creator Profile'}</CardTitle>
                                        <CardDescription>{applicant.profile?.email}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /> Cover Letter</h4>
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border">{applicant.coverLetter}</p>
                                </CardContent>
                                <CardFooter className="gap-2">
                                    <Button className="w-full" onClick={() => handleAccept(applicant.id, applicant.creatorId)} disabled={campaign.status !== 'OPEN_FOR_APPLICATIONS'}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Accept Offer
                                    </Button>
                                    <Button variant="outline" className="w-full" disabled={campaign.status !== 'OPEN_FOR_APPLICATIONS'}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
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
