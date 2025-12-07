
'use client';

import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { useMemo } from 'react';

export function TermsPage() {
  const { t, language } = useLanguage();

  const sections = useMemo(() => ([
    { id: 'preamble', title: t('termsPage.preamble.title') },
    { id: 'brands', title: t('termsPage.brands.title'), subSections: [
        { id: 'brands-status', title: t('termsPage.brands.legalStatus.title') },
        { id: 'brands-obligations', title: t('termsPage.brands.obligations.title') },
        { id: 'brands-payments', title: t('termsPage.brands.payments.title') },
    ]},
    { id: 'creators', title: t('termsPage.creators.title'), subSections: [
        { id: 'creators-independence', title: t('termsPage.creators.independence.title') },
        { id: 'creators-mandate', title: t('termsPage.creators.billingMandate.title') },
        { id: 'creators-ip', title: t('termsPage.creators.ip.title') },
        { id: 'creators-confidentiality', title: t('termsPage.creators.confidentiality.title') },
    ]},
    { id: 'common', title: t('termsPage.common.title'), subSections: [
        { id: 'common-circumvention', title: t('termsPage.common.antiCircumvention.title') },
        { id: 'common-data', title: t('termsPage.common.personalData.title') },
        { id: 'common-liability', title: t('termsPage.common.liability.title') },
        { id: 'common-law', title: t('termsPage.common.law.title') },
        { id: 'common-survival', title: t('termsPage.common.survival.title') },
        { id: 'common-severability', title: t('termsPage.common.severability.title') },
        { id: 'common-modifications', title: t('termsPage.common.modifications.title') },
    ]},
  ]), [t]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl gradient-text">
                {t('termsPage.title')}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                {t('termsPage.lastUpdated')}
                </p>
                <p className="mt-2 text-sm text-muted-foreground font-semibold">
                {t('termsPage.discrepancyNotice')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                <aside className="md:col-span-3">
                     <nav className="sticky top-28">
                        <h3 className="font-bold text-lg mb-4">{t('faqPage.categories')}</h3>
                         <ul className="space-y-2">
                             {sections.map(section => (
                                <li key={section.id} className="space-y-2">
                                    <Link href={`#${section.id}`} className="font-semibold text-foreground/80 hover:text-primary transition-colors">{section.title}</Link>
                                     {section.subSections && (
                                        <ul className="pl-4 space-y-2 border-l">
                                            {section.subSections.map(sub => (
                                                <li key={sub.id}><Link href={`#${sub.id}`} className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors">{sub.title}</Link></li>
                                            ))}
                                        </ul>
                                     )}
                                </li>
                             ))}
                        </ul>
                    </nav>
                </aside>

                <div className="md:col-span-9 prose dark:prose-invert max-w-none space-y-12 text-foreground/80">
                     {/* Preamble */}
                    <section id="preamble">
                        <h2 className="text-2xl font-bold pt-6">{t('termsPage.preamble.title')}</h2>
                        <h3 className="font-semibold">{t('termsPage.preamble.editorIdentity.title')}</h3>
                        <p>{t('termsPage.preamble.editorIdentity.content')}</p>
                        <h3 className="font-semibold">{t('termsPage.preamble.acceptance.title')}</h3>
                        <p>{t('termsPage.preamble.acceptance.content')}</p>
                    </section>

                    {/* Brands */}
                    <section id="brands">
                        <h2 className="text-3xl font-extrabold tracking-tight pt-6 border-t">{t('termsPage.brands.title')}</h2>
                        <div id="brands-status" className="scroll-mt-24">
                           <h3 className="font-semibold">{t('termsPage.brands.legalStatus.title')}</h3>
                           <p>{t('termsPage.brands.legalStatus.content')}</p>
                            <ul>
                                <li>{t('termsPage.brands.legalStatus.item1')}</li>
                                <li>{t('termsPage.brands.legalStatus.item2')}</li>
                            </ul>
                        </div>
                        <div id="brands-obligations" className="scroll-mt-24">
                            <h3 className="font-semibold">{t('termsPage.brands.obligations.title')}</h3>
                            <p><strong>{t('termsPage.brands.obligations.brief_b')}</strong> {t('termsPage.brands.obligations.brief_t')}</p>
                            <p><strong>{t('termsPage.brands.obligations.validation_b')}</strong> {t('termsPage.brands.obligations.validation_t')}</p>
                        </div>
                         <div id="brands-payments" className="scroll-mt-24">
                            <h3 className="font-semibold">{t('termsPage.brands.payments.title')}</h3>
                            <p><strong>{t('termsPage.brands.payments.liberatory_b')}</strong> {t('termsPage.brands.payments.liberatory_t')}</p>
                            <p><strong>{t('termsPage.brands.payments.chargebacks_b')}</strong> {t('termsPage.brands.payments.chargebacks_t')}</p>
                            <h4 className="font-semibold">{t('termsPage.brands.payments.refunds.title')}</h4>
                            <ul>
                                <li>{t('termsPage.brands.payments.refunds.preWork')}</li>
                                <li>{t('termsPage.brands.payments.refunds.nonDelivery')}</li>
                            </ul>
                        </div>
                    </section>

                     {/* Creators */}
                    <section id="creators">
                        <h2 className="text-3xl font-extrabold tracking-tight pt-6 border-t">{t('termsPage.creators.title')}</h2>
                        <div id="creators-independence" className="scroll-mt-24">
                           <h3 className="font-semibold">{t('termsPage.creators.independence.title')}</h3>
                           <p>{t('termsPage.creators.independence.content')}</p>
                        </div>
                        <div id="creators-mandate" className="scroll-mt-24">
                           <h3 className="font-semibold">{t('termsPage.creators.billingMandate.title')}</h3>
                           <p>{t('termsPage.creators.billingMandate.content')}</p>
                            <ul>
                                <li>{t('termsPage.creators.billingMandate.item1')}</li>
                                <li>{t('termsPage.creators.billingMandate.item2')}</li>
                            </ul>
                        </div>
                        <div id="creators-ip" className="scroll-mt-24">
                           <h3 className="font-semibold">{t('termsPage.creators.ip.title')}</h3>
                           <p><strong>{t('termsPage.creators.ip.assignment_b')}</strong> {t('termsPage.creators.ip.assignment_t')}</p>
                           <p><strong>{t('termsPage.creators.ip.personality_b')}</strong> {t('termsPage.creators.ip.personality_t')}</p>
                           <p><strong>{t('termsPage.creators.ip.adaptation_b')}</strong> {t('termsPage.creators.ip.adaptation_t')}</p>
                           <p><strong>{t('termsPage.creators.ip.warranty_b')}</strong> {t('termsPage.creators.ip.warranty_t')}</p>
                        </div>
                        <div id="creators-confidentiality" className="scroll-mt-24">
                           <h3 className="font-semibold">{t('termsPage.creators.confidentiality.title')}</h3>
                           <p>{t('termsPage.creators.confidentiality.content')}</p>
                        </div>
                    </section>
                    
                     {/* Common */}
                    <section id="common">
                        <h2 className="text-3xl font-extrabold tracking-tight pt-6 border-t">{t('termsPage.common.title')}</h2>
                        <div id="common-circumvention" className="scroll-mt-24">
                           <h3 className="font-semibold">{t('termsPage.common.antiCircumvention.title')}</h3>
                           <p>{t('termsPage.common.antiCircumvention.content')}</p>
                           <p><strong>{t('termsPage.common.antiCircumvention.penalty_b')}</strong> {t('termsPage.common.antiCircumvention.penalty_t')}</p>
                        </div>
                        <div id="common-data" className="scroll-mt-24">
                           <h3 className="font-semibold">{t('termsPage.common.personalData.title')}</h3>
                           <p>{t('termsPage.common.personalData.content')}</p>
                        </div>
                        <div id="common-liability" className="scroll-mt-24">
                           <h3 className="font-semibold">{t('termsPage.common.liability.title')}</h3>
                           <p>{t('termsPage.common.liability.content')}</p>
                        </div>
                         <div id="common-law" className="scroll-mt-24">
                           <h3 className="font-semibold">{t('termsPage.common.law.title')}</h3>
                           <p>{t('termsPage.common.law.content')}</p>
                        </div>
                        <div id="common-survival" className="scroll-mt-24">
                            <h3 className="font-semibold">{t('termsPage.common.survival.title')}</h3>
                            <p>{t('termsPage.common.survival.content')}</p>
                        </div>
                        <div id="common-severability" className="scroll-mt-24">
                            <h3 className="font-semibold">{t('termsPage.common.severability.title')}</h3>
                            <p>{t('termsPage.common.severability.content')}</p>
                        </div>
                        <div id="common-modifications" className="scroll-mt-24">
                            <h3 className="font-semibold">{t('termsPage.common.modifications.title')}</h3>
                            <p>{t('termsPage.common.modifications.content')}</p>
                        </div>
                    </section>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
