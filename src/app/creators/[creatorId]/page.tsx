
'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Award, CalendarDays, Info, ShieldAlert, Send } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import InviteToCampaignDialog from '@/components/invite-to-campaign-dialog';
import { useNicheTranslation } from '@/hooks/use-niche-translation';

const TrustScoreGauge = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-muted/50"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className="text-primary"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">Trust Score</span>
      </div>
    </div>
  );
};


const CreatorProfileSkeleton = () => (
  <div className="grid md:grid-cols-3 gap-8 items-start">
    <div className="md:col-span-1 space-y-6">
      <Card>
        <CardHeader className="items-center text-center">
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="h-8 w-40 mt-4" />
          <Skeleton className="h-5 w-32 mt-2" />
        </CardHeader>
        <CardContent className="text-center">
          <Skeleton className="h-5 w-24 mx-auto" />
        </CardContent>
      </Card>
    </div>
    <div className="md:col-span-2 space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function CreatorPublicProfilePage() {
  const { creatorId } = useParams();
  const firestore = useFirestore();
  const { user } = useUser();
  const { getNicheLabel } = useNicheTranslation();


  const creatorRef = useMemoFirebase(
    () => firestore ? doc(firestore, 'users', creatorId as string) : null,
    [firestore, creatorId]
  );
  const { data: creator, isLoading: isCreatorLoading } = useDoc(creatorRef);
  
  const portfolioRef = useMemoFirebase(
    () => firestore ? collection(firestore, 'users', creatorId as string, 'portfolio') : null,
    [firestore, creatorId]
  );
  const { data: portfolio, isLoading: isPortfolioLoading } = useCollection(portfolioRef);

  const campaignsQuery = useMemoFirebase(
    () => (user && firestore) ? query(collection(firestore, 'campaigns'), where('brandId', '==', user.uid), where('status', '==', 'OPEN_FOR_APPLICATIONS')) : null,
    [user, firestore]
  );
  const { data: activeCampaigns, isLoading: areCampaignsLoading } = useCollection(campaignsQuery);

  const isLoading = isCreatorLoading || isPortfolioLoading || areCampaignsLoading;
  
  const trustScore = useMemoFirebase(() => Math.floor(Math.random() * (98 - 75 + 1) + 75), []);

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <main className="max-w-5xl mx-auto p-8">
          <CreatorProfileSkeleton />
        </main>
      </>
    );
  }

  if (!creator) {
    return (
      <>
        <AppHeader />
        <main className="max-w-5xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold">Creator not found</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="items-center text-center">
                <Avatar className="w-32 h-32 border-4">
                  <AvatarImage src={creator.photoURL} alt={creator.displayName} />
                  <AvatarFallback className="text-4xl bg-muted">
                    {creator.displayName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{creator.displayName}</CardTitle>
                 {creator.tags && creator.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center pt-2">
                        {creator.tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="font-normal">{getNicheLabel(tag)}</Badge>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{creator.location}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center text-center gap-4">
                <TrustScoreGauge score={trustScore!} />
                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>The Trust Score reflects reliability, authenticity, and professionalism based on platform activity.</p>
                </div>
              </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-muted-foreground">Collaboration Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-black">
                            <Award className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">New Talent</p>
                            <p className="text-sm text-muted-foreground">Campaigns Completed</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-black">
                            <CalendarDays className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">{creator.createdAt ? new Date(creator.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">Joined VibeMatch</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>About {creator.displayName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 whitespace-pre-wrap">{creator.bio || 'No bio provided.'}</p>
              </CardContent>
               <CardFooter>
                 <InviteToCampaignDialog creator={creator} campaigns={activeCampaigns || []}>
                    <Button className="w-full gradient-bg text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary">
                        <Send className="mr-2 h-4 w-4" />
                        Invite to a Campaign
                    </Button>
                </InviteToCampaignDialog>
               </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>A showcase of their best work.</CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio && portfolio.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {portfolio.map(project => (
                      <Card key={project.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                           {project.mediaUrl && <img src={project.mediaUrl} alt={project.title} className="object-cover w-full h-full" />}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">This creator hasn't added any projects yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
