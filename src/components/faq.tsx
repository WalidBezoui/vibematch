'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

const FaqGroup = ({
  title,
  icon,
  faqs,
  id,
}: {
  title: string;
  icon: string;
  faqs: { question: string; answer: string }[];
  id: string;
}) => (
  <section className="scroll-mt-24 mb-16" id={id}>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 flex items-center gap-3">
      <span className="material-symbols-outlined text-4xl gradient-text">
        {icon}
      </span>
      {title}
    </h2>
    <Accordion type="single" collapsible className="w-full space-y-6">
      {faqs.map((faq, index) => (
        <AccordionItem
          value={`item-${index}`}
          key={index}
          className="border-b pb-6 group"
        >
          <AccordionTrigger className="hover:no-underline py-0">
            <span className="text-lg font-semibold text-left">
              {faq.question}
            </span>
            <span className="material-symbols-outlined text-2xl text-foreground/50 group-data-[state=open]:rotate-45 group-hover:text-primary transition-transform duration-300">
              add
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-4 text-foreground/70 leading-relaxed pt-0">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export function FaqSection() {
  const { t } = useLanguage();

  const brandsFaq = t('faqPage.brandsFaq', { returnObjects: true }) as { question: string; answer: string }[];
  const creatorsFaq = t('faqPage.creatorsFaq', { returnObjects: true }) as { question: string; answer: string }[];
  const generalFaq = t('faqPage.generalFaq', { returnObjects: true }) as { question: string; answer: string }[];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
      <div className="md:col-span-3">
        <nav className="sticky top-32">
          <h3 className="font-bold text-lg mb-4">
            {t('faqPage.categories')}
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                className="flex items-center gap-2 p-2 rounded-md font-medium text-foreground/70 hover:bg-muted hover:text-primary transition-colors"
                href="#brands-faq"
              >
                <span className="material-symbols-outlined text-lg">
                  storefront
                </span>{' '}
                {t('faqPage.forBrands')}
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center gap-2 p-2 rounded-md font-medium text-foreground/70 hover:bg-muted hover:text-primary transition-colors"
                href="#creators-faq"
              >
                <span className="material-symbols-outlined text-lg">
                  person
                </span>{' '}
                {t('faqPage.forCreators')}
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center gap-2 p-2 rounded-md font-medium text-foreground/70 hover:bg-muted hover:text-primary transition-colors"
                href="#general-faq"
              >
                <span className="material-symbols-outlined text-lg">
                  help_outline
                </span>{' '}
                {t('faqPage.general')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="md:col-span-9">
        <FaqGroup
          id="brands-faq"
          title={t('faqPage.forBrands')}
          icon="storefront"
          faqs={brandsFaq}
        />
        <FaqGroup
          id="creators-faq"
          title={t('faqPage.forCreators')}
          icon="person"
          faqs={creatorsFaq}
        />
        <FaqGroup
          id="general-faq"
          title={t('faqPage.general')}
          icon="help_outline"
          faqs={generalFaq}
        />
      </div>
    </div>
  );
}
