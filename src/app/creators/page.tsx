'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const CreatorCardSkeleton = () => (
    <Card className="overflow-hidden">
        <div className="aspect-[4/5] bg-muted relative">
            <Skeleton className="w-full h-full" />
        </div>
        <CardContent className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </CardContent>
    </Card>
);

type CreatorProfile = {
    id: string;
    displayName?: string;
    name: string;
    photoURL?: string;
    tags?: string[];
    location?: string;
    trustScore: number;
};

const CreatorCard = ({ creator }: { creator: CreatorProfile }) => (
    <Link href={`/creators/${creator.id}`} className="block group">
        <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-2">
            <div className="aspect-[4/5] bg-muted relative">
                <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={creator.photoURL} alt={creator.displayName || creator.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                    <AvatarFallback className="text-6xl bg-muted rounded-none">
                        {creator.displayName?.[0]?.toUpperCase() || creator.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                     <h3 className="text-2xl font-bold text-white shadow-sm">{creator.displayName || creator.name}</h3>
                     {creator.location && (
                        <div className="flex items-center gap-1.5 text-sm text-white/90 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{creator.location}</span>
                        </div>
                     )}
                </div>
            </div>
            <CardContent className="p-4 space-y-3">
                 {creator.tags && creator.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {creator.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                 )}
                 <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Trust Score: {creator.trustScore}</span>
                 </div>
            </CardContent>
        </Card>
    </Link>
)

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
                trustScore: Math.floor(Math.random() * (98 - 75 + 1) + 75) 
            }));
            setCreators(creatorsWithScores as CreatorProfile[]);
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                           <CreatorCardSkeleton />
                           <CreatorCardSkeleton />
                           <CreatorCardSkeleton />
                           <CreatorCardSkeleton />
                        </div>
                    )}
                    
                    {!isLoading && creators && creators.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {creators.map(creator => (
                                <CreatorCard key={creator.id} creator={creator} />
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
