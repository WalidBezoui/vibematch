
'use client';
import { AppHeader } from '@/components/app-header';
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
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                        <h2 className="text-2xl font-bold pt-6">{t('legalNotice.sections.editor.title')}</h2>
                        <ul className="list-none p-0 space-y-2">
                          <li><strong>{t('legalNotice.sections.editor.companyNameLabel')}</strong> {t('legalNotice.sections.editor.companyName')}</li>
                          <li><strong>{t('legalNotice.sections.editor.legalStatusLabel')}</strong> {t('legalNotice.sections.editor.legalStatus')}</li>
                          <li><strong>{t('legalNotice.sections.editor.hqLabel')}</strong> {t('legalNotice.sections.editor.hq')}</li>
                          <li><strong>{t('legalNotice.sections.editor.emailLabel')}</strong> {t('legalNotice.sections.editor.email')}</li>
                          <li><strong>{t('legalNotice.sections.editor.iceLabel')}</strong> {t('legalNotice.sections.editor.ice')}</li>
                          <li><strong>{t('legalNotice.sections.editor.tpLabel')}</strong> {t('legalNotice.sections.editor.tp')}</li>
                        </ul>


                        <h2 className="text-2xl font-bold pt-6">{t('legalNotice.sections.hosting.title')}</h2>
                        <ul className="list-none p-0 space-y-2">
                           <li><strong>{t('legalNotice.sections.hosting.hostLabel')}</strong> {t('legalNotice.sections.hosting.host')}</li>
                           <li><strong>{t('legalNotice.sections.hosting.addressLabel')}</strong> {t('legalNotice.sections.hosting.address')}</li>
                        </ul>

                        <h2 className="text-2xl font-bold pt-6">{t('legalNotice.sections.ip.title')}</h2>
                        <p>{t('legalNotice.sections.ip.content')}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
