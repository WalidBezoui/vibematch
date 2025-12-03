
'use client';
import { AppHeader } from '@/components/app-header';
import Link from 'next/link';
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
                    <p className="mt-2 text-md text-foreground/60">{t('termsPage.lastUpdated', { date: new Date().toLocaleDateString() })}</p>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                    <p>{t('termsPage.sections.intro.p1')}</p>
                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.platform.title')}</h2>
                    <p>{t('termsPage.sections.platform.p1')}</p>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.eligibility.title')}</h2>
                    <p>{t('termsPage.sections.eligibility.p1')}</p>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.obligations.title')}</h2>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>{t('termsPage.sections.obligations.li1')}</li>
                        <li>{t('termsPage.sections.obligations.li2')}</li>
                        <li>{t('termsPage.sections.obligations.li3')}</li>
                        <li>{t('termsPage.sections.obligations.li4')}</li>
                    </ul>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.creators.title')}</h2>
                    <div className="space-y-4 p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
                        <h3 className="text-xl font-semibold">{t('termsPage.sections.creators.pledge.title')}</h3>
                        <p>{t('termsPage.sections.creators.pledge.p1')}</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><b>{t('termsPage.sections.creators.pledge.li1_b')}</b>{t('termsPage.sections.creators.pledge.li1_t')}</li>
                            <li><b>{t('termsPage.sections.creators.pledge.li2_b')}</b>{t('termsPage.sections.creators.pledge.li2_t')}</li>
                        </ul>
                    </div>
                    <p className="mt-4">{t('termsPage.sections.creators.p1')}</p>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.brands.title')}</h2>
                    <p>{t('termsPage.sections.brands.p1')}</p>
                    <p>{t('termsPage.sections.brands.p2')}</p>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.payments.title')}</h2>
                    <p>{t('termsPage.sections.payments.p1')}</p>

                    <h2 className="text-2xl font-bold pt-6">{t('termsPage.sections.disputes.title')}</h2>
                    <p>{t('termsPage.sections.disputes.p1')}</p>
                    
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

        <footer className="px-4 md:px-10 lg:px-20 py-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-foreground/60">
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
  );
}
