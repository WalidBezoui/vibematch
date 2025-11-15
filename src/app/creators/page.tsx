'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

const CreatorCardSkeleton = () => (
    <Card>
        <CardHeader className="items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="w-full space-y-2 pt-4">
                <Skeleton className="h-6 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-1/3 mx-auto" />
            </div>
        </CardHeader>
        <CardContent className="text-center">
            <Skeleton className="h-10 w-2/3 mx-auto" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
);

type CreatorProfile = {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    trustScore: number;
};

export default function CreatorDiscoveryPage() {
    const firestore = useFirestore();
    const [creators, setCreators] = useState<CreatorProfile[]>([]);

    const creatorsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'users'), where('role', '==', 'creator')) : null,
        [firestore]
    );

    const { data: creatorDocs, isLoading } = useCollection(creatorsQuery);
    
    useEffect(() => {
        if (creatorDocs) {
            const creatorsWithScores = creatorDocs.map(doc => ({
                ...doc,
                // For now, trust score is random. In the future, this would come from the Trust Engine.
                trustScore: Math.floor(Math.random() * (98 - 75 + 1) + 75) 
            }));
            setCreators(creatorsWithScores);
        }
    }, [creatorDocs]);

    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="flex-1 px-4 md:px-10 lg:px-20 py-10 md:py-16 hero-bg">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                           Discover Creators
                        </h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl text-foreground/60">
                            Browse and connect with top-tier Moroccan creators for your next campaign.
                        </p>
                    </div>

                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           <CreatorCardSkeleton />
                           <CreatorCardSkeleton />
                           <CreatorCardSkeleton />
                           <CreatorCardSkeleton />
                        </div>
                    )}
                    
                    {!isLoading && creators && creators.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {creators.map(creator => (
                                <Card key={creator.id} className="flex flex-col text-center hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                                    <CardHeader className="items-center">
                                        <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary">
                                            <AvatarImage src={creator.photoURL} alt={creator.name} />
                                            <AvatarFallback>{creator.name?.[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                         <CardTitle className="pt-4">{creator.name.split(' ')[0]}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow flex flex-col justify-center items-center">
                                        <Badge variant="secondary" className="text-base">
                                            <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                                            Trust Score: {creator.trustScore}
                                        </Badge>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full">View Profile</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                     {!isLoading && (!creators || creators.length === 0) && (
                        <div className="text-center py-24 border-2 border-dashed rounded-lg">
                            <h2 className="text-2xl font-semibold">No Creators Found</h2>
                            <p className="text-muted-foreground mt-2">Check back soon as new creators join the platform!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
