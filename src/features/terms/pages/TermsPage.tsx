'use client';

import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/context/language-context';

export function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              {t('terms.title')}
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              {t('terms.lastUpdated')}
            </p>
            <div className="mt-8 prose prose-lg max-w-none">
              <p>{t('terms.p1')}</p>
              <h2>{t('terms.s1.title')}</h2>
              <p>{t('terms.s1.p1')}</p>
              <h2>{t('terms.s2.title')}</h2>
              <p>{t('terms.s2.p1')}</p>
              <h2>{t('terms.s3.title')}</h2>
              <p>{t('terms.s3.p1')}</p>
              <h2>{t('terms.s4.title')}</h2>
              <p>{t('terms.s4.p1')}</p>
              <h2>{t('terms.s5.title')}</h2>
              <p>{t('terms.s5.p1')}</p>
              <h2>{t('terms.s6.title')}</h2>
              <p>{t('terms.s6.p1')}</p>
              <h2>{t('terms.s7.title')}</h2>
              <p>{t('terms.s7.p1')}</p>
              <h2>{t('terms.s8.title')}</h2>
              <p>{t('terms.s8.p1')}</p>
              <h2>{t('terms.s9.title')}</h2>
              <p>{t('terms.s9.p1')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}