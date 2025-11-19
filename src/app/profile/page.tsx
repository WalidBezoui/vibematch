'use client';

import { useUserProfile, useUser } from '@/firebase';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import BrandProfileEditor from '@/components/profile/brand-profile-editor';
import CreatorProfileEditor from '@/components/profile/creator-profile-editor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const ProfilePageSkeleton = () => (
  <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
      <div className="md:col-span-2">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading, error: profileError } = useUserProfile();
  const router = useRouter();

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <main>
          <ProfilePageSkeleton />
        </main>
      </>
    );
  }

  if (!user) {
    router.push('/login');
    return null; // or a loading skeleton
  }
  
  if (profileError) {
     return (
      <>
        <AppHeader />
        <main className="max-w-5xl mx-auto p-8 text-center">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Profile</AlertTitle>
            <AlertDescription>
                {profileError.message || "We couldn't load your profile. Please try again later."}
            </AlertDescription>
          </Alert>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {userProfile?.role === 'brand' && <BrandProfileEditor profile={userProfile} />}
        {userProfile?.role === 'creator' && <CreatorProfileEditor profile={userProfile} />}
      </main>
    </div>
  );
}
