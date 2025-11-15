'use client';

import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const statusStyles: { [key: string]: string } = {
    PENDING_CREATOR_APPROVAL: 'bg-yellow-100 text-yellow-800',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    REJECTED: 'bg-red-100 text-red-800',
};

const JobCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
        </CardContent>
    </Card>
)

export default function BrandDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const jobsQuery = useMemoFirebase(
    () => user && firestore ? query(collection(firestore, 'jobs'), where('brandId', '==', user.uid)) : null,
    [user, firestore]
  );
  const { data: jobs, isLoading } = useCollection(jobsQuery);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Jobs</h1>
        <Button asChild>
          <Link href="/jobs/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Job
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
        </div>
      )}

      {!isLoading && jobs && jobs.length > 0 && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link href={`/jobs/${job.id}`} key={job.id}>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <Badge className={cn('whitespace-nowrap', statusStyles[job.status])}>
                                {job.status.replace(/_/g, ' ')}
                            </Badge>
                        </div>
                         <CardDescription>to {job.creatorEmail}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                        <p className="text-lg font-bold mt-4">{job.price} DH</p>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && (!jobs || jobs.length === 0) && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No active jobs yet.</h2>
            <p className="text-muted-foreground mt-2">Ready to find your next collaboration?</p>
            <Button asChild className="mt-6">
                <Link href="/jobs/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Job
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
