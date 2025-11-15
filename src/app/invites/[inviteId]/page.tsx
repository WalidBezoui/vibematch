'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/app-header';
import { Check, AlertTriangle } from 'lucide-react';

export default function InvitePage() {
  const { inviteId } = useParams();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [invite, setInvite] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteId || !firestore) return;

    const fetchInviteAndJob = async () => {
      try {
        const inviteRef = doc(firestore, 'invites', inviteId as string);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
          setError('This invitation is not valid or has expired.');
          setIsLoading(false);
          return;
        }

        const inviteData = inviteSnap.data();
        setInvite(inviteData);

        if (inviteData.status !== 'pending') {
            setError('This invitation has already been responded to.');
            setIsLoading(false);
            return;
        }

        const jobRef = doc(firestore, 'jobs', inviteData.jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
          setJob(jobSnap.data());
        } else {
          setError('The campaign associated with this invitation could not be found.');
        }
      } catch (e) {
        console.error(e);
        setError('An error occurred while fetching the invitation.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInviteAndJob();
  }, [inviteId, firestore]);

  const handleAccept = async () => {
    if (!user || !firestore || !invite) {
        // This case should be handled by the UI disabling the button
        return;
    }

    setIsLoading(true);
    try {
        // Ensure the logged-in user is the one invited
        if(user.email !== invite.creatorEmail) {
            setError("You are not authorized to accept this invitation. Please log in with the correct account.");
            setIsLoading(false);
            return;
        }

        const jobRef = doc(firestore, 'jobs', invite.jobId);
        const inviteRef = doc(firestore, 'invites', inviteId as string);

        // Update Job
        await updateDoc(jobRef, {
            status: 'PENDING_PAYMENT',
            creatorId: user.uid,
            updatedAt: serverTimestamp(),
        });

        // Update Invite
        await updateDoc(inviteRef, {
            status: 'accepted',
        });

        router.push('/dashboard');
    } catch(e) {
        console.error(e);
        setError("Failed to accept the campaign. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const InviteSkeleton = () => (
    <div className="w-full max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-1/4 mt-4" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-12 w-full" />
            </CardFooter>
        </Card>
    </div>
  )

  return (
    <>
    <AppHeader />
    <main className="flex items-center justify-center min-h-screen hero-bg p-4">
      {isLoading ? (
        <InviteSkeleton />
      ) : error ? (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="w-full max-w-2xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">You're Invited!</CardTitle>
                    <CardDescription>A brand has invited you to collaborate on a new campaign.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-lg">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Campaign Title</h3>
                        <p className="text-2xl font-bold">{job?.title}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Campaign Brief</h3>
                        <p className="text-foreground/80 whitespace-pre-wrap">{job?.campaignBrief}</p>
                    </div>
                    {job?.deliverables && job.deliverables.length > 0 && (
                      <div className="space-y-2">
                          <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Deliverables</h3>
                          <ul className="space-y-2">
                              {job.deliverables.map((item: string, index: number) => (
                                  <li key={index} className="flex items-start gap-3">
                                      <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                      <span>{item}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                    )}
                     <div className="space-y-2">
                        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Payment</h3>
                        <p className="text-3xl font-bold gradient-text">{job?.price} DH</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    {isUserLoading ? (
                        <Skeleton className="h-12 w-full" />
                    ) : user ? (
                        <Button onClick={handleAccept} className="w-full" size="lg" disabled={isLoading}>
                            <Check className="mr-2 h-5 w-5" />
                            Accept Campaign & Notify Brand
                        </Button>
                    ) : (
                        <Button asChild className="w-full" size="lg">
                            <Link href={`/login?redirect=/invites/${inviteId}`}>Log In or Sign Up to Accept</Link>
                        </Button>
                    )}
                    {user && user.email !== invite.creatorEmail && (
                        <Alert variant="destructive" className="text-center">
                            <AlertDescription>
                                Please log in with the account for <strong>{invite.creatorEmail}</strong> to accept this campaign.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </div>
      )}
    </main>
    </>
  );
}
