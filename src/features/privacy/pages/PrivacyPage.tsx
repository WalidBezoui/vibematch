
'use client';

import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { useMemo } from 'react';

export function PrivacyPage() {
  const { t } = useLanguage();

  const sections = useMemo(() => ([
    { id: 'preamble', title: t('privacyPage.sections.preamble.title') },
    { id: 'data', title: t('privacyPage.sections.data.title') },
    { id: 'purpose', title: t('privacyPage.sections.purpose.title') },
    { id: 'sharing', title: t('privacyPage.sections.sharing.title') },
    { id: 'transfers', title: t('privacyPage.sections.transfers.title') },
    { id: 'rights', title: t('privacyPage.sections.rights.title') },
    { id: 'retention', title: t('privacyPage.sections.retention.title') },
    { id: 'security', title: t('privacyPage.sections.security.title') },
    { id: 'cookies', title: t('privacyPage.sections.cookies.title') },
  ]), [t]);

  return (
    <div className="flex h-auto w-full flex-col">
        <AppHeader />
        <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
            <div className="max-w-5xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {t('privacyPage.title')}
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                    {t('privacyPage.lastUpdated')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    <aside className="md:col-span-3">
                        <nav className="sticky top-28">
                            <h3 className="font-bold text-lg mb-4">{t('faqPage.categories')}</h3>
                            <ul className="space-y-2">
                                {sections.map(section => (
                                    <li key={section.id}>
                                        <Link href={`#${section.id}`} className="font-semibold text-foreground/80 hover:text-primary transition-colors">{section.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    <div className="md:col-span-9 prose dark:prose-invert max-w-none space-y-12 text-foreground/80">
                        <section id="preamble" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.preamble.title')}</h2>
                            <p>{t('privacyPage.sections.preamble.p1')}</p>
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg border not-prose">
                                <h4 className="font-semibold text-foreground">{t('privacyPage.sections.preamble.controller.title')}</h4>
                                <ul className="list-none p-0 mt-2 text-sm">
                                    <li><strong>{t('privacyPage.sections.preamble.controller.identity_b')}</strong> {t('privacyPage.sections.preamble.controller.identity_t')}</li>
                                    <li><strong>{t('privacyPage.sections.preamble.controller.hq_b')}</strong> {t('privacyPage.sections.preamble.controller.hq_t')}</li>
                                    <li><strong>{t('privacyPage.sections.preamble.controller.contact_b')}</strong> {t('privacyPage.sections.preamble.controller.contact_t')}</li>
                                </ul>
                            </div>
                        </section>

                        <section id="data" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.data.title')}</h2>
                            <p>{t('privacyPage.sections.data.p1')}</p>
                            <h3 className="font-semibold text-lg">{t('privacyPage.sections.data.direct.title')}</h3>
                            <ul>
                                <li><strong>{t('privacyPage.sections.data.direct.identity_b')}</strong> {t('privacyPage.sections.data.direct.identity_t')}</li>
                                <li><strong>{t('privacyPage.sections.data.direct.professional_b')}</strong> {t('privacyPage.sections.data.direct.professional_t')}</li>
                                <li><strong>{t('privacyPage.sections.data.direct.financial_b')}</strong> {t('privacyPage.sections.data.direct.financial_t')}</li>
                            </ul>
                            <h3 className="font-semibold text-lg">{t('privacyPage.sections.data.auto.title')}</h3>
                            <p>{t('privacyPage.sections.data.auto.p1')}</p>
                            <ul>
                                <li>{t('privacyPage.sections.data.auto.l1')}</li>
                                <li>{t('privacyPage.sections.data.auto.l2')}</li>
                            </ul>
                            <h3 className="font-semibold text-lg">{t('privacyPage.sections.data.technical.title')}</h3>
                             <ul>
                                <li>{t('privacyPage.sections.data.technical.l1')}</li>
                            </ul>
                        </section>

                         <section id="purpose" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.purpose.title')}</h2>
                            <p>{t('privacyPage.sections.purpose.p1')}</p>
                            <ul>
                                <li><strong>{t('privacyPage.sections.purpose.l1_b')}</strong> {t('privacyPage.sections.purpose.l1_t')}</li>
                                <li><strong>{t('privacyPage.sections.purpose.l2_b')}</strong> {t('privacyPage.sections.purpose.l2_t')}</li>
                                <li><strong>{t('privacyPage.sections.purpose.l3_b')}</strong> {t('privacyPage.sections.purpose.l3_t')}</li>
                                <li><strong>{t('privacyPage.sections.purpose.l4_b')}</strong> {t('privacyPage.sections.purpose.l4_t')}</li>
                            </ul>
                        </section>

                        <section id="sharing" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.sharing.title')}</h2>
                            <p>{t('privacyPage.sections.sharing.p1')}</p>
                            <ul>
                                <li><strong>{t('privacyPage.sections.sharing.l1_b')}</strong> {t('privacyPage.sections.sharing.l1_t')}</li>
                                <li><strong>{t('privacyPage.sections.sharing.l2_b')}</strong> {t('privacyPage.sections.sharing.l2_t')}</li>
                                <li><strong>{t('privacyPage.sections.sharing.l3_b')}</strong> {t('privacyPage.sections.sharing.l3_t')}</li>
                            </ul>
                        </section>

                         <section id="transfers" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.transfers.title')}</h2>
                            <p>{t('privacyPage.sections.transfers.p1')}</p>
                        </section>

                        <section id="rights" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.rights.title')}</h2>
                            <p>{t('privacyPage.sections.rights.p1')}</p>
                             <ul>
                                <li><strong>{t('privacyPage.sections.rights.l1_b')}</strong> {t('privacyPage.sections.rights.l1_t')}</li>
                                <li><strong>{t('privacyPage.sections.rights.l2_b')}</strong> {t('privacyPage.sections.rights.l2_t')}</li>
                                <li><strong>{t('privacyPage.sections.rights.l3_b')}</strong> {t('privacyPage.sections.rights.l3_t')}</li>
                            </ul>
                            <p>{t('privacyPage.sections.rights.p2')}</p>
                        </section>

                        <section id="retention" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.retention.title')}</h2>
                             <ul>
                                <li><strong>{t('privacyPage.sections.retention.l1_b')}</strong> {t('privacyPage.sections.retention.l1_t')}</li>
                                <li><strong>{t('privacyPage.sections.retention.l2_b')}</strong> {t('privacyPage.sections.retention.l2_t')}</li>
                                <li><strong>{t('privacyPage.sections.retention.l3_b')}</strong> {t('privacyPage.sections.retention.l3_t')}</li>
                            </ul>
                        </section>

                        <section id="security" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.security.title')}</h2>
                            <p>{t('privacyPage.sections.security.p1')}</p>
                        </section>

                        <section id="cookies" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold pt-6">{t('privacyPage.sections.cookies.title')}</h2>
                            <p>{t('privacyPage.sections.cookies.p1')}</p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}
