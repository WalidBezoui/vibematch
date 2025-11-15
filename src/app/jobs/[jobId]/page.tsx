'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

const statusStyles: { [key: string]: string } = {
    PENDING_CREATOR_APPROVAL: 'bg-yellow-100 text-yellow-800',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    REJECTED: 'bg-red-100 text-red-800',
};


const JobDetailSkeleton = () => (
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

const CreatorWorkspace = ({ job }: { job: any }) => {
    // Placeholder for creator's view
    return (
        <Card>
            <CardHeader>
                <CardTitle>Creator Workspace</CardTitle>
                <CardDescription>Upload your deliverables here.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-8 border-2 border-dashed rounded-lg text-center">
                    <p>Upload Area</p>
                    {/* Placeholder for upload component */}
                </div>
                 <Button className="w-full mt-6" disabled={job.status !== 'IN_PROGRESS'}>Mark as Delivered</Button>
            </CardContent>
        </Card>
    )
}

const BrandWorkspace = ({ job, jobId }: { job: any, jobId: string }) => {
    // Placeholder for brand's view
    const router = useRouter();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand Workspace</CardTitle>
            </CardHeader>
            <CardContent>
                 {job.status === 'PENDING_PAYMENT' && (
                    <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800">Action Required</h3>
                        <p className="text-blue-700 mt-2">The creator has accepted the campaign. Please proceed with the payment to get started.</p>
                        <Button className="mt-6" onClick={() => router.push(`/jobs/${jobId}/pay`)}>
                            Proceed to Payment
                        </Button>
                    </div>
                )}
                 {job.status === 'DELIVERED' && (
                    <div className="text-center p-8 bg-purple-50 border border-purple-200 rounded-lg">
                        <h3 className="text-xl font-semibold text-purple-800">Deliverables Ready for Review</h3>
                        <p className="text-purple-700 mt-2">The creator has submitted the work. Please review and approve to release payment.</p>
                        <Button className="mt-6">
                           ✅ Validate & Release Payment
                        </Button>
                    </div>
                )}
                {job.status === 'IN_PROGRESS' && (
                     <p className="text-muted-foreground">The campaign is currently in progress. You will be notified when the creator submits the deliverables.</p>
                )}
                 {job.status === 'COMPLETED' && (
                     <p className="text-muted-foreground">This campaign is complete and payment has been released.</p>
                )}
            </CardContent>
        </Card>
    )
}


export default function JobPage() {
    const { jobId } = useParams();
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();

    const jobRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'jobs', jobId as string) : null,
        [firestore, jobId]
    );
    const { data: job, isLoading: isJobLoading, error } = useDoc(jobRef);

    if (isUserLoading || isJobLoading) {
        return (
             <>
                <AppHeader />
                <main className="max-w-4xl mx-auto p-8">
                   <JobDetailSkeleton />
                </main>
            </>
        )
    }

    if (!job) {
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

    const isBrand = user?.uid === job.brandId;
    const isCreator = user?.uid === job.creatorId;

    return (
        <>
            <AppHeader />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-3xl">{job.title}</CardTitle>
                                <Badge className={cn('whitespace-nowrap', statusStyles[job.status])}>
                                    {job.status.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                            <CardDescription className="text-lg">
                                Collaboration between Brand and Creator
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-muted-foreground text-sm uppercase">Campaign Brief</h3>
                                <p className="text-foreground/80 mt-1 whitespace-pre-wrap">{job.campaignBrief}</p>
                            </div>
                            {job.deliverables && job.deliverables.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-muted-foreground text-sm uppercase">Deliverables</h3>
                                    <ul className="space-y-2 mt-2">
                                        {job.deliverables.map((item: string, index: number) => (
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
                                <p className="text-xl font-bold gradient-text">{job.price} DH</p>
                            </div>
                        </CardContent>
                    </Card>

                    {isBrand && <BrandWorkspace job={job} jobId={jobId as string} />}
                    {isCreator && <CreatorWorkspace job={job} />}
                </div>
            </main>
        </>
    );
}
