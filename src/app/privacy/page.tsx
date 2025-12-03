
'use client';
import { AppHeader } from '@/components/app-header';
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
                        <p className="mt-2 text-md text-foreground/60">{t('termsPage.lastUpdated', { date: '03/12/2025' })}</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                       <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.processing.title')}</h2>
                       <p>{t('privacyPage.sections.processing.content')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.data.title')}</h2>
                        <p>{t('privacyPage.sections.data.p1')}</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>{t('privacyPage.sections.data.li1_b')}</strong> {t('privacyPage.sections.data.li1_t')}</li>
                            <li><strong>{t('privacyPage.sections.data.li2_b')}</strong> {t('privacyPage.sections.data.li2_t')}</li>
                            <li><strong>{t('privacyPage.sections.data.li3_b')}</strong> {t('privacyPage.sections.data.li3_t')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.purpose.title')}</h2>
                        <p>{t('privacyPage.sections.purpose.p1')}</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('privacyPage.sections.purpose.li1')}</li>
                            <li>{t('privacyPage.sections.purpose.li2')}</li>
                            <li>{t('privacyPage.sections.purpose.li3')}</li>
                             <li>{t('privacyPage.sections.purpose.li4')}</li>
                        </ul>
                        
                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.sharing.title')}</h2>
                        <p>{t('privacyPage.sections.sharing.p1')}</p>
                         <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('privacyPage.sections.sharing.li1')}</li>
                            <li>{t('privacyPage.sections.sharing.li2')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.rights.title')}</h2>
                        <p>{t('privacyPage.sections.rights.p1')}</p>

                        <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.cookies.title')}</h2>
                        <p>{t('privacyPage.sections.cookies.p1')}</p>

                    </div>
                </div>
            </main>
        </div>
    );
}
