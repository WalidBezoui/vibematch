
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (lucideIcons as any)[name];
  if (!Icon) {
    return <lucideIcons.Sparkles className={className} />;
  }
  return <Icon className={className} />;
};

const HowItWorksCard = ({ step, title, description, icon }: { step: number, title: string, description: string, icon: string }) => (
    <div className="flex items-start gap-6">
        <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full gradient-bg text-black flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30">
                {step}
            </div>
            {step < 3 && <div className="w-px h-16 bg-border"></div>}
        </div>
        <div>
            <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-primary">
                    <DynamicIcon name={icon} className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <p className="text-foreground/70 leading-relaxed">{description}</p>
        </div>
    </div>
)

export function HomeComponent() {
  const { t, language, setUserInterest } = useLanguage();
  const [activeTab, setActiveTab] = useState('brands');

  const testimonials = t('homePage.testimonials', { returnObjects: true }) as { quote: string; name: string; role: string, image: string }[];
  const brandsFaq = t('homePage.faq.brandsFaq', { returnObjects: true }) as { question: string; answer: string }[];
  const creatorsFaq = t('homePage.faq.creatorsFaq', { returnObjects: true }) as { question: string; answer: string }[];
  
  const dashboardScreenshot = getImage('dashboard-screenshot');
  const creatorAppScreenshot = getImage('creator-app-screenshot');
  const escrowDiagram = getImage('escrow-diagram');

  const howItWorks = {
      brands: t('homePage.howItWorks.brands', {returnObjects: true}) as any,
      creators: t('homePage.howItWorks.creators', {returnObjects: true}) as any,
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if(tab === 'brands') {
        setUserInterest('brand');
    } else {
        setUserInterest('creator');
    }
  }

  return (
    <div className="flex flex-col max-w-[1200px] flex-1">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-160px)] py-10">
        <div className="flex flex-col gap-6 items-center">
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight ${language === 'AR' ? 'hero-title-ar' : ''}`}>
             {t('homePage.hero.title')}
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl font-normal leading-relaxed max-w-4xl text-foreground/70">
            {t('homePage.hero.subtitle')}
          </h2>
        </div>
        {dashboardScreenshot && (
            <div className="mt-16 w-full max-w-4xl">
                 <Image
                    src={dashboardScreenshot.imageUrl}
                    alt={dashboardScreenshot.description}
                    width={1200}
                    height={750}
                    className="rounded-2xl border shadow-2xl shadow-primary/10"
                />
            </div>
        )}
      </div>

       {/* Segmentation Tabs */}
      <div className="py-24 md:py-32" id="start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className={cn("p-8 transition-all duration-300 cursor-pointer", activeTab === 'brands' ? 'border-primary shadow-2xl shadow-primary/20 -translate-y-2' : 'border-border hover:border-primary/50')} onClick={() => handleTabClick('brands')}>
                <CardHeader className="p-0">
                    <CardTitle className="text-3xl font-bold flex items-center gap-3">
                         <span className="material-symbols-outlined text-4xl gradient-text">storefront</span>
                         {t('homePage.segmentation.brands.tab')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                    <p className="text-lg text-foreground/80">{t('homePage.segmentation.brands.title')}</p>
                </CardContent>
            </Card>
            <Card className={cn("p-8 transition-all duration-300 cursor-pointer", activeTab === 'creators' ? 'border-primary shadow-2xl shadow-primary/20 -translate-y-2' : 'border-border hover:border-primary/50')} onClick={() => handleTabClick('creators')}>
                <CardHeader className="p-0">
                    <CardTitle className="text-3xl font-bold flex items-center gap-3">
                         <span className="material-symbols-outlined text-4xl gradient-text">person</span>
                         {t('homePage.segmentation.creators.tab')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                     <p className="text-lg text-foreground/80">{t('homePage.segmentation.creators.title')}</p>
                </CardContent>
            </Card>
        </div>
      </div>
      
       {/* Pain/Solution Section */}
      <div className="py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
              {t('homePage.brands.title1')}{' '}
              <span className="gradient-text text-glow">
                {t('homePage.brands.title2')}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              {t('homePage.brands.description')}
            </p>
          </div>
          {creatorAppScreenshot && (
            <div className="relative w-full aspect-square p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden">
                <Image
                    src={creatorAppScreenshot.imageUrl}
                    alt={creatorAppScreenshot.description}
                    data-ai-hint={creatorAppScreenshot.imageHint}
                    fill
                    className="object-contain"
                />
            </div>
           )}
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 mt-32">
           {escrowDiagram && (
            <div className="relative w-full aspect-square p-8 bg-gradient-to-bl from-accent/10 via-transparent to-transparent rounded-3xl shadow-2xl shadow-accent/10 overflow-hidden order-last md:order-first">
                <Image
                    src={escrowDiagram.imageUrl}
                    alt={escrowDiagram.description}
                    data-ai-hint={escrowDiagram.imageHint}
                    fill
                    className="object-contain"
                />
            </div>
           )}
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
              {t('homePage.creators.title1')}{' '}
              <span className="gradient-text text-glow">
                {t('homePage.creators.title2')}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              {t('homePage.creators.description')}
            </p>
          </div>
        </div>
      </div>
      
       {/* How it Works Section */}
        <div className="py-24 md:py-32 text-center">
             <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-16">
                 {t('homePage.howItWorks.title')}
             </h2>
             <div className="max-w-2xl mx-auto">
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

      {/* Trust Signals */}
      <div className="py-24 md:py-32 text-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">{t('homePage.trustedBy')}</h3>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                <p className="font-bold text-2xl text-foreground/80">CMI</p>
                <p className="font-bold text-2xl text-foreground/80">Stripe</p>
                <p className="font-bold text-2xl text-foreground/80">Google Cloud</p>
                <p className="font-bold text-2xl text-foreground/80">AWS</p>
            </div>
      </div>
      
      {/* Testimonials */}
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

       {/* FAQ Section */}
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
      
      {/* Final CTA */}
        <div className="py-24 md:py-32 text-center">
             <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                   {t('homePage.finalCta.title')}
                </h2>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      asChild
                      size="lg"
                      variant="gradient"
                      className="min-w-[220px] h-14 px-8 rounded-full"
                    >
                      <Link href={activeTab === 'brands' ? '/brands/join' : '/creators/join'}>{t('homePage.finalCta.ctaButton')}</Link>
                    </Button>
                 </div>
                 <p className="mt-4 text-sm text-muted-foreground">{t('homePage.finalCta.reassurance')}</p>
             </div>
        </div>
    </div>
  );
}
