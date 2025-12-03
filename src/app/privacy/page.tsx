
'use client';
import { AppHeader } from '@/components/app-header';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

export default function PrivacyPage() {
    const { t } = useLanguage();
    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
                <div className="max-w-4xl mx-auto bg-background/80 dark:bg-background/80 backdrop-blur-xl border rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight gradient-text">
                            {t('privacyPage.title')}
                        </h1>
                        <p className="mt-2 text-md text-foreground/60">{t('termsPage.lastUpdated', { date: new Date().toLocaleDateString() })}</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                       <p>{t('privacyPage.intro')}</p>
                        
                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.information.title')}</h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>{t('privacyPage.sections.information.li1_b')}</strong> {t('privacyPage.sections.information.li1_t')}</li>
                            <li><strong>{t('privacyPage.sections.information.li2_b')}</strong> {t('privacyPage.sections.information.li2_t')}</li>
                            <li><strong>{t('privacyPage.sections.information.li3_b')}</strong> {t('privacyPage.sections.information.li3_t')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.use.title')}</h2>
                        <p>{t('privacyPage.sections.use.p1')}</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('privacyPage.sections.use.li1')}</li>
                            <li>{t('privacyPage.sections.use.li2')}</li>
                            <li>{t('privacyPage.sections.use.li3')}</li>
                        </ul>
                        
                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.sharing.title')}</h2>
                        <p>{t('privacyPage.sections.sharing.p1')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.security.title')}</h2>
                        <p>{t('privacyPage.sections.security.p1')}</p>

                         <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.rights.title')}</h2>
                        <p>{t('privacyPage.sections.rights.p1')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.changes.title')}</h2>
                        <p>{t('privacyPage.sections.changes.p1')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.contact.title')}</h2>
                        <p>{t('privacyPage.sections.contact.p1')} <a href="mailto:support@vibematch.ma" className="text-primary hover:underline">support@vibematch.ma</a>.</p>
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
