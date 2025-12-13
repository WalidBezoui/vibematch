
'use client';

import { HomeComponent } from '@/features/home/components/Home';
import { AppHeader } from '@/components/app-header';
import { PromoBanner } from '@/components/promo-banner';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => (
  <div className="flex h-auto w-full flex-col">
    <div className="flex h-full grow flex-col">
      <AppHeader />
      <main className="flex-1 px-4 md:px-10 lg:px-20 py-10 md:py-20">
        <div className="max-w-[1200px] mx-auto flex-1 space-y-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-2/3" />
          <div className="flex gap-4">
            <Skeleton className="h-14 w-48" />
            <Skeleton className="h-14 w-48" />
          </div>
        </div>
      </main>
    </div>
  </div>
);


export function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || user) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex h-auto w-full flex-col">
      <div className="flex h-full grow flex-col">
        <PromoBanner />
        <AppHeader />

        <main className="flex-1 px-4 md:px-10 lg:px-20 py-10 md:py-20 hero-bg">
          <div className="max-w-[1200px] mx-auto flex-1">
            <HomeComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

    