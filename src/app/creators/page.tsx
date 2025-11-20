
'use client';

import { AppHeader } from '@/components/app-header';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShieldCheck, Instagram, ArrowRight, Send, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import InviteToCampaignDialog from '@/components/invite-to-campaign-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CreatorCardSkeleton = () => (
    <Card className="overflow-hidden">
        <div className="aspect-[4/5] bg-muted relative">
            <Skeleton className="w-full h-full" />
        </div>
        <CardContent className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-2" />
        </CardContent>
    </Card>
);

const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-muted-foreground" viewBox="0 0 16 16">
        <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
    </svg>
);


type CreatorProfile = {
    id: string;
    displayName?: string;
    name: string;
    photoURL?: string;
    tags?: string[];
    location?: string;
    trustScore: number;
    instagramFollowers: string;
    tiktokFollowers: string;
};

const CreatorCard = ({ creator, activeCampaigns }: { creator: CreatorProfile, activeCampaigns: any[] }) => (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col group">
        <div className="aspect-[4/5] bg-muted relative overflow-hidden">
            <Link href={`/creators/${creator.id}`} className="block w-full h-full">
                <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={creator.photoURL} alt={creator.displayName || creator.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                    <AvatarFallback className="text-6xl bg-muted rounded-none">
                        {creator.displayName?.[0]?.toUpperCase() || creator.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
            </Link>
        </div>
        <CardContent className="p-4 space-y-3 flex-grow">
             <div>
                <h3 className="text-xl font-bold">{creator.displayName || creator.name}</h3>
                 {creator.location && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{creator.location}</span>
                    </div>
                 )}
             </div>

             {creator.tags && creator.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {creator.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
             )}
             <div className="flex items-center justify-between text-sm font-semibold">
                <div className="flex items-center gap-1 text-green-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Trust Score: {creator.trustScore}</span>
                </div>
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>A measure of reliability, authenticity, and professionalism based on platform activity.</p>
                        </TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
             </div>
             <Separator className="my-3" />
             <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="font-bold">{creator.instagramFollowers}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                 </div>
                  <div className="flex items-center gap-2">
                    <TikTokIcon />
                    <div>
                        <p className="font-bold">{creator.tiktokFollowers}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                 </div>
             </div>
        </CardContent>
        <CardFooter className="p-3 border-t bg-muted/30 flex flex-col items-stretch gap-2">
             <InviteToCampaignDialog creator={creator} campaigns={activeCampaigns}>
                <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Invite to Campaign
                </Button>
            </InviteToCampaignDialog>
            <Button asChild className="w-full" variant="ghost">
                <Link href={`/creators/${creator.id}`}>
                    View Profile
                </Link>
            </Button>
        </CardFooter>
    </Card>
)

export default function CreatorDiscoveryPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const [creators, setCreators] = useState<CreatorProfile[]>([]);

    const creatorsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'users'), where('role', '==', 'creator')) : null,
        [firestore]
    );
    const { data: creatorDocs, isLoading: areCreatorsLoading } = useCollection(creatorsQuery);
    
    const campaignsQuery = useMemoFirebase(
        () => (user && firestore) ? query(collection(firestore, 'campaigns'), where('brandId', '==', user.uid), where('status', '==', 'OPEN_FOR_APPLICATIONS')) : null,
        [user, firestore]
    );
    const { data: activeCampaigns, isLoading: areCampaignsLoading } = useCollection(campaignsQuery);
    
    useEffect(() => {
        if (creatorDocs) {
            const creatorsWithMetrics = creatorDocs.map(doc => {
                const ig = Math.random() * 90 + 10;
                const tt = Math.random() * 200 + 5;
                return {
                    ...doc,
                    trustScore: Math.floor(Math.random() * (98 - 75 + 1) + 75),
                    instagramFollowers: `${ig.toFixed(1)}k`,
                    tiktokFollowers: `${tt.toFixed(1)}k`,
                }
            });
            setCreators(creatorsWithMetrics as CreatorProfile[]);
        }
    }, [creatorDocs]);

    const isLoading = areCreatorsLoading || areCampaignsLoading;

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
                                <CreatorCard key={creator.id} creator={creator} activeCampaigns={activeCampaigns || []} />
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
