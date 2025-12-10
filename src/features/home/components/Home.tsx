
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/context/language-context';
import { getImage } from '@/lib/placeholder-images';
import React, { useEffect, useState } from 'react';
import * as lucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';


const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (lucideIcons as any)[name];
  if (!Icon) {
    return <lucideIcons.Sparkles className={className} />;
  }
  return <Icon className={className} />;
};

const HowItWorksCard = ({ step, title, description, icon }: { step: number, title: string, description: string, icon: string }) => {
    return (
        <div className="flex flex-col md:flex-row items-start gap-6 p-8 rounded-2xl bg-background border">
            <div className="flex items-center gap-4">
                <div className="text-5xl font-extrabold gradient-text">{step.toString().padStart(2, '0')}</div>
                <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center text-black flex-shrink-0">
                    <DynamicIcon name={icon} className="w-8 h-8" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-foreground/70 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};


export function HomeComponent() {
  const { t, language, setUserInterest } = useLanguage();
  const [activeTab, setActiveTab] = useState('brands');

  const brandsFaq = t('homePage.brandsFaq', { returnObjects: true }) as { question: string; answer: string }[];
  const creatorsFaq = t('homePage.creatorsFaq', { returnObjects: true }) as { question: string; answer: string }[];
  const testimonials = t('homePage.testimonials', { returnObjects: true }) as { quote: string; name:string; role: string, image: string }[];
  const howItWorks = t('homePage.howItWorks', { returnObjects: true }) as any;
  const painPoints = t('homePage.painPoints', { returnObjects: true }) as any;
  const trustSignals = t('homePage.trustSignals', { returnObjects: true }) as any;


  const fakeEngagementImg = getImage('fake-engagement');
  const guaranteedPaymentsImg = getImage('guaranteed-payments');
  const moroccanTeamImg = getImage('moroccan-team');

  return (
    <div className="flex flex-col max-w-[1200px] flex-1">
      <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-280px)] py-10">
        <div className="flex flex-col gap-6 items-center">
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight ${language === 'AR' ? 'hero-title-ar' : ''}`}>
            {t('homePage.hero.title1')}{' '}
            <span className="gradient-text text-glow">{t('homePage.hero.title2')}</span>
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl font-normal leading-relaxed max-w-4xl text-foreground/70">
            {t('homePage.hero.subtitle')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              asChild
              size="lg"
              variant="gradient"
              className="min-w-[220px] h-14 px-8 rounded-full"
              onClick={() => setUserInterest('brand')}
            >
              <Link href="/brands/join">{t('homePage.hero.brandsButton')}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[220px] h-14 px-8 text-base font-semibold tracking-wide rounded-full"
              onClick={() => setUserInterest('creator')}
            >
              <Link href="/creators/join">{t('homePage.hero.creatorsButton')}</Link>
            </Button>
          </div>
        </div>
      </div>
      
       <div className="py-24 text-center">
         <h3 className="text-sm font-semibold text-foreground/60 tracking-widest uppercase mb-8">{trustSignals.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="font-mono text-2xl font-bold text-foreground/50">CMI</div>
            <div className="font-mono text-2xl font-bold text-foreground/50">Stripe</div>
            <div className="font-mono text-2xl font-bold text-foreground/50">Google Cloud</div>
             <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-lg">
                {trustSignals.waitlist}
            </div>
        </div>
       </div>

       <div className="py-24 md:py-32" id="how-it-works">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                    {howItWorks.title}
                </h2>
                <p className="text-lg md:text-xl text-foreground/70 mt-4 max-w-3xl mx-auto">
                    {howItWorks.description}
                </p>
            </div>
            
            <div className="flex justify-center mb-12">
                 <div className="bg-muted p-1.5 rounded-full flex gap-2">
                    <Button 
                        onClick={() => setActiveTab('brands')}
                        variant={activeTab === 'brands' ? 'gradient' : 'ghost'}
                        className="rounded-full px-6 py-2.5 text-base font-semibold"
                    >
                        {howItWorks.brands.tabTitle}
                    </Button>
                    <Button 
                        onClick={() => setActiveTab('creators')}
                        variant={activeTab === 'creators' ? 'gradient' : 'ghost'}
                        className="rounded-full px-6 py-2.5 text-base font-semibold"
                    >
                        {howItWorks.creators.tabTitle}
                    </Button>
                </div>
            </div>

            <div>
                {activeTab === 'brands' ? (
                     <div className="flex flex-col gap-8">
                        {howItWorks.brands.steps.map((step: any, index: number) => (
                             <HowItWorksCard key={index} step={index+1} title={step.title} description={step.description} icon={step.icon} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                         {howItWorks.creators.steps.map((step: any, index: number) => (
                             <HowItWorksCard key={index} step={index+1} title={step.title} description={step.description} icon={step.icon} />
                        ))}
                    </div>
                )}
            </div>
        </div>


      <div className="py-24 md:py-32 scroll-mt-16" id="brands">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
              {painPoints.brands.title}
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              {painPoints.brands.description}
            </p>
          </div>
          <div className="relative w-full aspect-square p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden">
            {fakeEngagementImg && (
                <Image
                    src={fakeEngagementImg.imageUrl}
                    alt={fakeEngagementImg.description}
                    data-ai-hint={fakeEngagementImg.imageHint}
                    fill
                    className="object-contain"
                />
            )}
          </div>
        </div>
      </div>
      <div className="py-24 md:py-32 scroll-mt-16" id="creators-main">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
           <div className="relative w-full aspect-square p-8 bg-gradient-to-bl from-accent/10 via-transparent to-transparent rounded-3xl shadow-2xl shadow-accent/10 overflow-hidden order-last md:order-first">
             {guaranteedPaymentsImg && (
                <Image
                    src={guaranteedPaymentsImg.imageUrl}
                    alt={guaranteedPaymentsImg.description}
                    data-ai-hint={guaranteedPaymentsImg.imageHint}
                    fill
                    className="object-contain"
                />
            )}
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
              {painPoints.creators.title}
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              {painPoints.creators.description}
            </p>
          </div>
        </div>
      </div>
      <div
        className="py-24 md:py-32 bg-muted/50 rounded-3xl scroll-mt-16"
        id="creators"
      >
        <div className="px-4 md:px-10 lg:px-12">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
              {t('homePage.creating.title1')} <br className="hidden md:block" />{' '}
              {t('homePage.creating.title2')}{' '}
              <span className="gradient-text text-glow">{t('homePage.creating.title3')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-background border transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-black">
                  payments
                </span>
              </div>
              <h3 className="text-xl font-bold mt-2">{t('homePage.creatorFeatures.paycheck.title')}</h3>
              <p className="text-foreground/70 leading-relaxed">
                {t('homePage.creatorFeatures.paycheck.description')}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-background border transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-black">
                  lock
                </span>
              </div>
              <h3 className="text-xl font-bold mt-2">{t('homePage.creatorFeatures.confidence.title')}</h3>
              <p className="text-foreground/70 leading-relaxed">
                {t('homePage.creatorFeatures.confidence.description')}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-background border transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-black">
                  rule
                </span>
              </div>
              <h3 className="text-xl font-bold mt-2">{t('homePage.creatorFeatures.briefs.title')}</h3>
              <p className="text-foreground/70 leading-relaxed">
                {t('homePage.creatorFeatures.briefs.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-24 md:py-32 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-16">
          {t('homePage.testimonialsTitle1')}{' '}
          <span className="gradient-text text-glow">{t('homePage.testimonialsTitle2')}</span>{' '}
          {t('homePage.testimonialsTitle3')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
                <div key={index} className="flex flex-col gap-4 text-left p-8 rounded-3xl bg-muted/50 border transform transition-transform hover:scale-105 hover:shadow-xl hover:shadow-primary/10">
                    <p className="text-foreground/70 leading-relaxed text-lg">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="w-12 h-12 rounded-full bg-cover bg-center overflow-hidden">
                          {getImage(testimonial.image) && (
                            <Image
                              src={getImage(testimonial.image)!.imageUrl}
                              alt={getImage(testimonial.image)!.description}
                              width={48}
                              height={48}
                              className='object-cover w-full h-full'
                            />
                          )}
                        </div>
                        <div>
                            <div className="font-bold">{testimonial.name}</div>
                            <div className="text-sm text-foreground/70">{testimonial.role}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      <div className="py-24 md:py-32" id="faq">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
            {t('homePage.faq.title1')}{' '}
            <span className="gradient-text text-glow">{t('homePage.faq.title2')}</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 mt-4 max-w-3xl mx-auto">
            {t('homePage.faq.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="flex flex-col gap-6" onClick={() => setUserInterest('brand')}>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">
              {t('homePage.faq.brandsTitle')}
            </h3>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {brandsFaq.slice(0, 2).map((faq, index) => (
                <AccordionItem
                  value={`item-b-${index}`}
                  key={index}
                  className="bg-muted/50 border border-border/50 rounded-xl px-6 group"
                >
                  <AccordionTrigger className="hover:no-underline text-lg font-semibold" onClick={() => setUserInterest('brand')}>
                    <span className="rtl:text-right">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="flex flex-col gap-6" onClick={() => setUserInterest('creator')}>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">
              {t('homePage.faq.creatorsTitle')}
            </h3>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {creatorsFaq.slice(0, 2).map((faq, index) => (
                <AccordionItem
                  value={`item-c-${index}`}
                  key={index}
                  className="bg-muted/50 border border-border/50 rounded-xl px-6 group"
                >
                  <AccordionTrigger className="hover:no-underline text-lg font-semibold" onClick={() => setUserInterest('creator')}>
                    <span className="rtl:text-right">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <div className="text-center mt-16">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-semibold tracking-wide rounded-full"
          >
            <Link href="/faq">{t('homePage.faq.viewAllButton')}</Link>
          </Button>
        </div>
      </div>
      <div className="py-24 md:py-32">
        <div className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden group">
          {moroccanTeamImg && (
            <Image
                src={moroccanTeamImg.imageUrl}
                alt={moroccanTeamImg.description}
                data-ai-hint={moroccanTeamImg.imageHint}
                fill
                className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16">
            <h2 className="text-white text-4xl md:text-6xl font-extrabold tracking-tighter max-w-2xl">
              {t('homePage.connect.title')}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
