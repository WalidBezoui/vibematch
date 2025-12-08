
'use client';
import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/context/language-context';

export default function CreatorTermsPage() {
    const { t } = useLanguage();
    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
                <div className="max-w-4xl mx-auto bg-background/80 dark:bg-background/80 backdrop-blur-xl border rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight gradient-text">
                            {t('creatorTermsPage.title')}
                        </h1>
                        <p className="mt-2 text-md text-muted-foreground">{t('termsPage.lastUpdated')}</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                        <h2 className="text-2xl font-bold pt-6">{t('creatorTermsPage.sections.object.title')}</h2>
                        <p>{t('creatorTermsPage.sections.object.p1')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('creatorTermsPage.sections.mandate.title')}</h2>
                        <p>{t('creatorTermsPage.sections.mandate.p1')}</p>
                         <ul className="list-decimal list-inside space-y-2 pl-4">
                            <li>{t('creatorTermsPage.sections.mandate.li1')}</li>
                            <li>{t('creatorTermsPage.sections.mandate.li2')}</li>
                            <li>{t('creatorTermsPage.sections.mandate.li3')}</li>
                        </ul>
                         <p>{t('creatorTermsPage.sections.mandate.p2')}</p>


                        <h2 className="text-2xl font-bold pt-6">{t('creatorTermsPage.sections.obligations.title')}</h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('creatorTermsPage.sections.obligations.li1')}</li>
                            <li>{t('creatorTermsPage.sections.obligations.li2')}</li>
                            <li>{t('creatorTermsPage.sections.obligations.li3')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold pt-6">{t('creatorTermsPage.sections.payments.title')}</h2>
                         <ul className="list-none p-0 space-y-2">
                          <li><strong>{t('creatorTermsPage.sections.payments.trigger_b')}</strong>{t('creatorTermsPage.sections.payments.trigger_t')}</li>
                           <li><strong>{t('creatorTermsPage.sections.payments.delay_b')}</strong>{t('creatorTermsPage.sections.payments.delay_t')}</li>
                            <li><strong>{t('creatorTermsPage.sections.payments.commission_b')}</strong>{t('creatorTermsPage.sections.payments.commission_t')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold pt-6">{t('creatorTermsPage.sections.circumvention.title')}</h2>
                        <p>{t('creatorTermsPage.sections.circumvention.p1')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('creatorTermsPage.sections.rights.title')}</h2>
                        <p>{t('creatorTermsPage.sections.rights.p1')}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

