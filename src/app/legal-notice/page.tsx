
'use client';
import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';

export default function LegalNoticePage() {
    const { t } = useLanguage();
    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight gradient-text">
                            {t('legalNotice.title')}
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                         <aside className="md:col-span-3">
                            <nav className="sticky top-28">
                                <h3 className="font-bold text-lg mb-4">{t('legalNotice.navTitle')}</h3>
                                <ul className="space-y-3">
                                    <li><Link href="#editor" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">{t('legalNotice.sections.editor.title')}</Link></li>
                                    <li><Link href="#hosting" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">{t('legalNotice.sections.hosting.title')}</Link></li>
                                    <li><Link href="#ip" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">{t('legalNotice.sections.ip.title')}</Link></li>
                                </ul>
                            </nav>
                        </aside>

                        <div className="md:col-span-9 prose dark:prose-invert max-w-none space-y-8 text-foreground/80">
                            <section id="editor">
                                <h2 className="text-2xl font-bold pt-6">{t('legalNotice.sections.editor.title')}</h2>
                                <ul className="list-none p-0 space-y-2">
                                  <li><strong>{t('legalNotice.sections.editor.companyNameLabel')}</strong> {t('legalNotice.sections.editor.companyName')}</li>
                                  <li><strong>{t('legalNotice.sections.editor.legalStatusLabel')}</strong> {t('legalNotice.sections.editor.legalStatus')}</li>
                                  <li><strong>{t('legalNotice.sections.editor.hqLabel')}</strong> {t('legalNotice.sections.editor.hq')}</li>
                                  <li><strong>{t('legalNotice.sections.editor.emailLabel')}</strong> <a href={`mailto:${t('legalNotice.sections.editor.email')}`}>{t('legalNotice.sections.editor.email')}</a></li>
                                  <li><strong>{t('legalNotice.sections.editor.iceLabel')}</strong> {t('legalNotice.sections.editor.ice')}</li>
                                  <li><strong>{t('legalNotice.sections.editor.tpLabel')}</strong> {t('legalNotice.sections.editor.tp')}</li>
                                </ul>
                            </section>

                            <section id="hosting">
                                <h2 className="text-2xl font-bold pt-6">{t('legalNotice.sections.hosting.title')}</h2>
                                <ul className="list-none p-0 space-y-2">
                                   <li><strong>{t('legalNotice.sections.hosting.hostLabel')}</strong> {t('legalNotice.sections.hosting.host')}</li>
                                   <li><strong>{t('legalNotice.sections.hosting.addressLabel')}</strong> {t('legalNotice.sections.hosting.address')}</li>
                                </ul>
                            </section>

                            <section id="ip">
                                <h2 className="text-2xl font-bold pt-6">{t('legalNotice.sections.ip.title')}</h2>
                                <p>{t('legalNotice.sections.ip.content')}</p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

