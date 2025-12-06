'use client';

import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/context/language-context';

export function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              {t('privacy.title')}
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              {t('privacy.lastUpdated')}
            </p>
            <div className="mt-8 prose prose-lg max-w-none">
              <p>{t('privacy.p1')}</p>
              <h2>{t('privacy.s1.title')}</h2>
              <p>{t('privacy.s1.p1')}</p>
              <h2>{t('privacy.s2.title')}</h2>
              <p>{t('privacy.s2.p1')}</p>
              <ul>
                <li>{t('privacy.s2.l1')}</li>
                <li>{t('privacy.s2.l2')}</li>
                <li>{t('privacy.s2.l3')}</li>
                <li>{t('privacy.s2.l4')}</li>
              </ul>
              <h2>{t('privacy.s3.title')}</h2>
              <p>{t('privacy.s3.p1')}</p>
              <ul>
                <li>{t('privacy.s3.l1')}</li>
                <li>{t('privacy.s3.l2')}</li>
                <li>{t('privacy.s3.l3')}</li>
                <li>{t('privacy.s3.l4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}