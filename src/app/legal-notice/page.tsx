
'use client';
import { AppHeader } from '@/components/app-header';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

export default function LegalNoticePage() {
    const { t } = useLanguage();
    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
                <div className="max-w-4xl mx-auto bg-background/80 dark:bg-background/80 backdrop-blur-xl border rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight gradient-text">
                            {t('legalNotice.title')}
                        </h1>
                        <p className="mt-2 text-md text-foreground/60">{t('termsPage.lastUpdated', { date: new Date().toLocaleDateString() })}</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                        <h2 className="text-2xl font-bold pt-6">{t('legalNotice.sections.editor.title')}</h2>
                        <p>{t('legalNotice.sections.editor.content')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('legalNotice.sections.hosting.title')}</h2>
                        <p>{t('legalNotice.sections.hosting.content')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('legalNotice.sections.ip.title')}</h2>
                        <p>{t('legalNotice.sections.ip.content')}</p>
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
