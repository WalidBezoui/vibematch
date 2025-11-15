'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const statusStyles: { [key: string]: string } = {
    OPEN_FOR_APPLICATIONS: 'bg-green-100 text-green-800',
    PENDING_SELECTION: 'bg-yellow-100 text-yellow-800',
    PENDING_CREATOR_ACCEPTANCE: 'bg-yellow-100 text-yellow-800',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    REJECTED_BY_CREATOR: 'bg-red-100 text-red-800',
};


const CampaignDetailSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
            <Skeleton className="h-10 w-1/4 mt-4" />
        </CardContent>
    </Card>
)

const CreatorWorkspace = ({ campaign, campaignRef }: { campaign: any, campaignRef: any }) => {
    const { toast } = useToast();

    const handleDeliver = async () => {
        toast({ title: "Submitting work..." });
        // Simulate upload
        await new Promise(res => setTimeout(res, 1500));
        try {
            await updateDoc(campaignRef, {
                status: 'DELIVERED',
                updatedAt: serverTimestamp(),
            });
            toast({ title: "Deliverables submitted!", description: "The brand has been notified to review your work." });
        } catch (e: any) {
             toast({ variant: 'destructive', title: "Submission failed", description: e.message });
        }
    }

    if (campaign.status === 'PENDING_CREATOR_ACCEPTANCE') {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>You've Been Selected!</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                     <p className="mb-4">The brand has chosen you for this campaign. Please accept the offer to proceed.</p>
                     <Button onClick={async () => {
                         await updateDoc(campaignRef, { status: 'PENDING_PAYMENT', updatedAt: serverTimestamp() });
                     }}>Accept Campaign Offer</Button>
                     <Button variant="ghost" className="ml-2" onClick={async () => {
                         await updateDoc(campaignRef, { status: 'REJECTED_BY_CREATOR', updatedAt: serverTimestamp() });
                     }}>Decline</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Creator Workspace</CardTitle>
                <CardDescription>Upload your deliverables here once they are ready.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-8 border-2 border-dashed rounded-lg text-center bg-muted/50">
                    <p className="font-semibold">Upload Area</p>
                    <p className="text-sm text-muted-foreground mt-1">(File upload simulation)</p>
                </div>
                 <Button onClick={handleDeliver} className="w-full mt-6" disabled={campaign.status !== 'IN_PROGRESS'}>
                     <Send className="mr-2 h-4 w-4" />
                     Mark as Delivered
                </Button>
            </CardContent>
        </Card>
    )
}

const BrandWorkspace = ({ campaign, campaignId, campaignRef }: { campaign: any, campaignId: string, campaignRef: any }) => {
    const router = useRouter();
    const { toast } = useToast();

    const handleApprove = async () => {
        toast({ title: "Releasing Payment..." });
        // Simulate payment processing
        await new Promise(res => setTimeout(res, 1500));
         try {
            await updateDoc(campaignRef, {
                status: 'COMPLETED',
                updatedAt: serverTimestamp(),
            });
            toast({ title: "Campaign Complete!", description: "Payment has been released to the creator." });
        } catch (e: any) {
             toast({ variant: 'destructive', title: "Approval Failed", description: e.message });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand Workspace</CardTitle>
            </CardHeader>
            <CardContent>
                 {campaign.status === 'PENDING_PAYMENT' && (
                    <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800">Action Required</h3>
                        <p className="text-blue-700 mt-2">The creator has accepted the campaign. Please proceed with the payment to get started.</p>
                        <Button className="mt-6" onClick={() => router.push(`/campaigns/${campaignId}/pay`)}>
                            Proceed to Payment
                        </Button>
                    </div>
                )}
                 {campaign.status === 'DELIVERED' && (
                    <div className="text-center p-8 bg-purple-50 border border-purple-200 rounded-lg">
                        <h3 className="text-xl font-semibold text-purple-800">Deliverables Ready for Review</h3>
                        <p className="text-purple-700 mt-2">The creator has submitted the work. Please review and approve to release payment.</p>
                        <Button className="mt-6" onClick={handleApprove}>
                           ✅ Validate & Release Payment
                        </Button>
                    </div>
                )}
                {(campaign.status === 'OPEN_FOR_APPLICATIONS' || campaign.status === 'PENDING_SELECTION') && (
                     <Alert>
                        <AlertDescription className="text-center">
                            <Link href={`/campaigns/${campaignId}/manage`} className="font-semibold text-primary hover:underline">Manage applications</Link> to select a creator for this campaign.
                        </AlertDescription>
                    </Alert>
                )}
                {campaign.status === 'IN_PROGRESS' && (
                     <p className="text-muted-foreground">The campaign is currently in progress. You will be notified when the creator submits the deliverables.</p>
                )}
                 {campaign.status === 'COMPLETED' && (
                     <p className="text-muted-foreground">This campaign is complete and payment has been released.</p>
                )}
                 {campaign.status === 'PENDING_CREATOR_ACCEPTANCE' && (
                     <p className="text-muted-foreground">Waiting for the selected creator to accept the campaign offer.</p>
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

    const campaignRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'campaigns', campaignId as string) : null,
        [firestore, campaignId]
    );
    const { data: campaign, isLoading: isCampaignLoading, error } = useDoc(campaignRef);

    if (isUserLoading || isCampaignLoading) {
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

    const isBrand = user?.uid === campaign.brandId;
    const isCreator = user?.uid === campaign.creatorId;
    const canView = isBrand || isCreator || campaign.status === 'OPEN_FOR_APPLICATIONS' || campaign.status === 'PENDING_CREATOR_ACCEPTANCE' && user?.uid === campaign.creatorId;

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


    return (
        <>
            <AppHeader />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-3xl">{campaign.title}</CardTitle>
                                <Badge className={cn('whitespace-nowrap', statusStyles[campaign.status])}>
                                    {campaign.status.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                            <CardDescription className="text-lg">
                                Collaboration Campaign
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-muted-foreground text-sm uppercase">Campaign Brief</h3>
                                <p className="text-foreground/80 mt-1 whitespace-pre-wrap">{campaign.campaignBrief}</p>
                            </div>
                            {campaign.deliverables && campaign.deliverables.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-muted-foreground text-sm uppercase">Deliverables</h3>
                                    <ul className="space-y-2 mt-2">
                                        {campaign.deliverables.map((item: string, index: number) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                             <div>
                                <h3 className="font-semibold text-muted-foreground text-sm uppercase">Price</h3>
                                <p className="text-xl font-bold gradient-text">{campaign.price} DH</p>
                            </div>
                        </CardContent>
                    </Card>

                    {isBrand && <BrandWorkspace campaign={campaign} campaignId={campaignId as string} campaignRef={campaignRef} />}
                    {isCreator && <CreatorWorkspace campaign={campaign} campaignRef={campaignRef} />}
                </div>
            </main>
        </>
    );
}
