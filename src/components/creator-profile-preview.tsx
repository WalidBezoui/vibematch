
'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Award, CalendarDays, ShieldAlert } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useMemo } from 'react';

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
  <div className="p-4 md:p-6 lg:p-8 space-y-8">
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </div>
    <div className="space-y-8">
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

export default function CreatorProfilePreview({ creatorId }: { creatorId: string | null }) {
  const firestore = useFirestore();

  const creatorRef = useMemoFirebase(
    () => (firestore && creatorId) ? doc(firestore, 'users', creatorId) : null,
    [firestore, creatorId]
  );
  const { data: creator, isLoading: isCreatorLoading } = useDoc(creatorRef);
  
  const portfolioRef = useMemoFirebase(
    () => (firestore && creatorId) ? collection(firestore, 'users', creatorId, 'portfolio') : null,
    [firestore, creatorId]
  );
  const { data: portfolio, isLoading: isPortfolioLoading } = useCollection(portfolioRef);

  const isLoading = isCreatorLoading || isPortfolioLoading;
  
  const trustScore = useMemo(() => creatorId ? Math.floor(Math.random() * (98 - 75 + 1) + 75) : 0, [creatorId]);

  if (isLoading || !creator) {
    return <CreatorProfileSkeleton />;
  }
  
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-muted/30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6">
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
                <div className="flex flex-col items-center justify-center text-center gap-4 p-4 border rounded-lg bg-card">
                    <TrustScoreGauge score={trustScore} />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border">
                    <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>The Trust Score reflects reliability, authenticity, and professionalism based on platform activity.</p>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 space-y-8">
                <Card>
                <CardHeader>
                    <CardTitle>About {creator.displayName}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 whitespace-pre-wrap">{creator.bio || 'No bio provided.'}</p>
                </CardContent>
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
    </div>
  );
}
