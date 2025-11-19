'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';

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

  const isLoading = isCreatorLoading || isPortfolioLoading;

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
                            <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{creator.location}</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                {/* AdminBadgeDisplay can be added here if needed */}
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Collaboration Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Campaigns Completed</span>
                        <span className="font-bold">New Talent</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Joined VibeMatch</span>
                        <span className="font-bold">{creator.createdAt ? new Date(creator.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
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
                 <Button className="w-full">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Propose a Campaign
                </Button>
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
