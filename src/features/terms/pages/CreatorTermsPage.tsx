
'use client';
import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/context/language-context';

export function CreatorTermsPage() {
    const { t } = useLanguage();
    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
                <div className="max-w-4xl mx-auto bg-background/80 dark:bg-background/80 backdrop-blur-xl border rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight gradient-text">
                            {t('termsPage.creator.title')}
                        </h1>
                        <p className="mt-2 text-md text-muted-foreground">{t('termsPage.lastUpdated')}</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                        <h2 className="text-2xl font-bold pt-6">{t('termsPage.creator.sections.independence.title')}</h2>
                        <p>{t('termsPage.creator.sections.independence.content')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('termsPage.creator.sections.mandate.title')}</h2>
                        <p>{t('termsPage.creator.sections.mandate.p1')}</p>
                         <ul className="list-decimal list-inside space-y-2 pl-4">
                            <li>{t('termsPage.creator.sections.mandate.li1')}</li>
                            <li>{t('termsPage.creator.sections.mandate.li2')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold pt-6">{t('termsPage.creator.sections.obligations.title')}</h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('termsPage.creator.sections.obligations.li1')}</li>
                            <li>{t('termsPage.creator.sections.obligations.li2')}</li>
                            <li>{t('termsPage.creator.sections.obligations.li3')}</li>
                             <li>{t('termsPage.creator.sections.confidentiality.title')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold pt-6">{t('termsPage.creator.sections.payments.title')}</h2>
                         <ul className="list-none p-0 space-y-2">
                          <li><strong>{t('termsPage.creator.sections.payments.trigger_b')}</strong>{t('termsPage.creator.sections.payments.trigger_t')}</li>
                           <li><strong>{t('termsPage.creator.sections.payments.delay_b')}</strong>{t('termsPage.creator.sections.payments.delay_t')}</li>
                            <li><strong>{t('termsPage.creator.sections.payments.commission_b')}</strong>{t('termsPage.creator.sections.payments.commission_t')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold pt-6">{t('termsPage.creator.sections.circumvention.title')}</h2>
                        <p>{t('termsPage.creator.sections.circumvention.p1')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('termsPage.creator.sections.ip.title')}</h2>
                        <p><strong>{t('termsPage.creator.sections.ip.assignment.title')}</strong> {t('termsPage.creator.sections.ip.assignment.p1')}</p>
                        <p><strong>{t('termsPage.creator.sections.ip.personality.title')}</strong> {t('termsPage.creator.sections.ip.personality.p1')}</p>
                        <p><strong>{t('termsPage.creator.sections.ip.adaptation.title')}</strong> {t('termsPage.creator.sections.ip.adaptation.p1')}</p>
                        <p><strong>{t('termsPage.creator.sections.ip.warranty.title')}</strong> {t('termsPage.creator.sections.ip.warranty.p1')}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
