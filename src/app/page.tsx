
'use client';

import Link from 'next/link';
import { HomeComponent } from '@/components/home';
import { AppHeader } from '@/components/app-header';
import { PromoBanner } from '@/components/promo-banner';
import { useLanguage } from '@/context/language-context';
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


export default function Home() {
  const { t } = useLanguage();
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

        <footer className="px-4 md:px-10 lg:px-20 py-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-center md:text-left text-foreground/60">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-6">
              <Link
                className="text-sm text-foreground/60 hover:text-primary"
                href="/terms"
              >
                {t('footer.terms')}
              </Link>
              <Link
                className="text-sm text-foreground/60 hover:text-primary"
                href="/privacy"
              >
                {t('footer.privacy')}
              </Link>
              <Link
                className="text-sm text-foreground/60 hover:text-primary"
                href="/legal-notice"
              >
                {t('footer.legal')}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
