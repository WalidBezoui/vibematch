
'use client';
import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/context/language-context';

export default function TermsPage() {
    const { t } = useLanguage();
  return (
    <div className="flex h-auto w-full flex-col">
        <AppHeader />
        <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
            <div className="max-w-4xl mx-auto bg-background/80 dark:bg-background/80 backdrop-blur-xl border rounded-2xl p-8 md:p-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight gradient-text">
                        {t('termsPage.title')}
                    </h1>
                    <p className="mt-2 text-md text-foreground/60">{t('termsPage.lastUpdated', { date: '03/12/2025' })}</p>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.object.title')}</h2>
                    <p>{t('termsPage.sections.object.p1')}</p>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.mandate.title')}</h2>
                    <p>{t('termsPage.sections.mandate.p1')}</p>
                     <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>{t('termsPage.sections.mandate.li1')}</li>
                        <li>{t('termsPage.sections.mandate.li2')}</li>
                    </ul>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.obligations.title')}</h2>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>{t('termsPage.sections.obligations.li1')}</li>
                        <li>{t('termsPage.sections.obligations.li2')}</li>
                        <li>{t('termsPage.sections.obligations.li3')}</li>
                    </ul>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.payments.title')}</h2>
                    <p>{t('termsPage.sections.payments.p1')}</p>
                    
                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.termination.title')}</h2>
                    <p>{t('termsPage.sections.termination.p1')}</p>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.disclaimer.title')}</h2>
                    <p>{t('termsPage.sections.disclaimer.p1')}</p>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.law.title')}</h2>
                    <p>{t('termsPage.sections.law.p1')}</p>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.changes.title')}</h2>
                    <p>{t('termsPage.sections.changes.p1')}</p>
                </div>
            </div>
        </main>
    </div>
  );
}
