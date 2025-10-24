'use client';

import Link from 'next/link';
import { HomeComponent } from '@/components/home';
import { AppHeader } from '@/components/app-header';
import { PromoBanner } from '@/components/promo-banner';
import { useLanguage } from '@/context/language-context';

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="flex h-auto w-full flex-col">
      <div className="flex h-full grow flex-col">
        <PromoBanner />
        <AppHeader />

        <main className="px-4 md:px-10 lg:px-20 py-10 md:py-20 hero-bg">
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
                href="#"
              >
                {t('footer.privacy')}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
