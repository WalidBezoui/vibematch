'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

const CampaignCardSkeleton = () => (
    <Card className="flex flex-col">
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent className="flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-2" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-1/2" />
        </CardFooter>
    </Card>
);


export default function DiscoverPage() {
    const firestore = useFirestore();

    const campaignsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'jobs'), where('status', '==', 'OPEN_FOR_APPLICATIONS')) : null,
        [firestore]
    );

    const { data: campaigns, isLoading } = useCollection(campaignsQuery);

    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="flex-1 px-4 md:px-10 lg:px-20 py-10 md:py-16 hero-bg">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                           Discover Campaigns
                        </h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl text-foreground/60">
                            Browse and apply for exclusive campaigns from top Moroccan brands.
                        </p>
                    </div>

                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           <CampaignCardSkeleton />
                           <CampaignCardSkeleton />
                           <CampaignCardSkeleton />
                        </div>
                    )}
                    
                    {!isLoading && campaigns && campaigns.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.map(campaign => (
                                <Card key={campaign.id} className="flex flex-col hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle>{campaign.title}</CardTitle>
                                        <CardDescription>A new opportunity awaits</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-4">
                                        <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">
                                            {campaign.campaignBrief}
                                        </p>
                                        <div>
                                            <Badge variant="secondary">Budget</Badge>
                                            <p className="font-bold text-lg gradient-text mt-1">{campaign.price} DH</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <Link href={`/jobs/${campaign.id}/apply`}>
                                                View & Apply
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                     {!isLoading && (!campaigns || campaigns.length === 0) && (
                        <div className="text-center py-24 border-2 border-dashed rounded-lg">
                            <h2 className="text-2xl font-semibold">No Open Campaigns Right Now</h2>
                            <p className="text-muted-foreground mt-2">Check back soon for new opportunities!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}