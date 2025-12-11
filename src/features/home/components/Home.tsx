
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import React, { useState } from 'react';
import * as lucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatedDashboardMockup, FloatingProfileCard, FloatingStatCard, AnimatedBrandPainpoint, AnimatedCreatorPainpoint, AnimatedEscrow } from './AnimatedDashboardMockup';


const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (lucideIcons as any)[name];
  if (!Icon) {
    return <lucideIcons.Sparkles className={className} />;
  }
  return <Icon className={className} />;
};

const HowItWorksCard = ({ step, title, description, icon }: { step: number; title: string; description: string; icon: string }) => (
    <div className="relative flex flex-col items-center text-center p-6 bg-card rounded-2xl border">
        <div className="absolute -top-6 w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-black font-bold text-xl border-4 border-background shadow-md">
        {step}
        </div>
        <div className="mt-8">
            <DynamicIcon name={icon} className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-2 text-foreground/70">{description}</p>
        </div>
    </div>
);


export function HomeComponent() {
  const { t, language, setUserInterest } = useLanguage();
  const [activeTab, setActiveTab] = useState('brands');

  const howItWorks = t('homePage.howItWorks', { returnObjects: true });
  const testimonials = t('homePage.testimonials', { returnObjects: true }) as { quote: string; name: string; role: string, image: string }[];
  

  return (
    <div className="flex flex-col max-w-[1200px] flex-1">
        
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 min-h-[calc(100vh-200px)] py-10">
            <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
                <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight ${language === 'AR' ? 'hero-title-ar' : ''}`}>
                    {t('homePage.hero.title1')}{' '}
                    <span className="gradient-text text-glow">{t('homePage.hero.title2')}</span>
                </h1>
                <h2 className="text-lg md:text-xl font-normal leading-relaxed max-w-2xl text-foreground/70">
                    {t('homePage.hero.subtitle')}
                </h2>
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                     <Button
                        asChild
                        size="lg"
                        className="h-14 px-8 gradient-bg text-black text-lg font-bold rounded-full"
                        onClick={() => setUserInterest('brand')}
                    >
                        <Link href="/brands/join">{t('homePage.hero.brandsButton')}</Link>
                    </Button>
                     <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-14 px-8 text-lg font-bold rounded-full"
                        onClick={() => setUserInterest('creator')}
                    >
                        <Link href="/creators/join">{t('homePage.hero.creatorsButton')}</Link>
                    </Button>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/50">
                    <div className="flex -space-x-4 rtl:space-x-reverse">
                        <Avatar className="w-10 h-10 border-2 border-background">
                           <AvatarFallback>GA</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-10 h-10 border-2 border-background">
                            <AvatarFallback>AF</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-10 h-10 border-2 border-background">
                            <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                    </div>
                    <p className="text-sm font-semibold text-foreground/70">{t('homePage.hero.trustText')}</p>
                </div>
            </div>
            <div className="relative w-full h-[500px] hidden md:flex items-center justify-center">
                 <div className="relative w-full h-full p-10">
                    <div className="absolute top-0 left-0 z-20">
                        <FloatingProfileCard />
                    </div>
                    <div className="absolute bottom-0 right-0 z-20">
                        <FloatingStatCard />
                    </div>
                    <div className="relative z-10 flex h-full w-full items-center justify-center">
                        <AnimatedDashboardMockup />
                    </div>
                 </div>
            </div>
        </div>

        {/* --- TRUST BAR --- */}
        <div className="py-16 text-center">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">{t('homePage.trustBar.title')}</h3>
             <div className="flex flex-col items-center gap-8">
                <div className="flex justify-center items-center gap-10 md:gap-16 flex-wrap">
                    <span className="font-mono text-xl font-medium text-foreground/60">CMI</span>
                    <span className="font-mono text-xl font-medium text-foreground/60">Stripe</span>
                    <span className="font-mono text-xl font-medium text-foreground/60">Google Cloud</span>
                </div>
                <div className="p-3 px-4 rounded-full bg-primary/10 text-primary font-semibold text-sm border border-primary/20">
                   {t('homePage.trustBar.metric')}
                </div>
            </div>
        </div>


        {/* --- PAIN POINT: BRANDS --- */}
        <div className="py-24 md:py-32 scroll-mt-16 bg-card rounded-3xl" id="brands">
            <div className="px-4 md:px-10 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight">
                        {t('homePage.brands.title1')}{' '}
                        <span className="gradient-text text-glow">
                            {t('homePage.brands.title2')}
                        </span>
                        </h2>
                        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                        {t('homePage.brands.description')}
                        </p>
                        <div className="mt-4 flex flex-col items-start gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 px-8 rounded-full gradient-bg text-black font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary"
                            onClick={() => setUserInterest('brand')}
                        >
                            <Link href="/brands/join">
                                <lucideIcons.ShieldCheck className="mr-2 h-5 w-5" />
                                {t('homePage.brands.joinButton')}
                            </Link>
                        </Button>
                        </div>
                    </div>
                    <div className="relative w-full h-80 flex items-center justify-center">
                       <AnimatedBrandPainpoint />
                    </div>
                </div>
            </div>
        </div>
        
        {/* --- PAIN POINT: CREATORS --- */}
        <div className="py-24 md:py-32 scroll-mt-16" id="creators">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                <div className="relative w-full h-80 flex items-center justify-center order-last md:order-first">
                    <AnimatedCreatorPainpoint />
                </div>
                <div className="flex flex-col gap-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight">
                    {t('homePage.creators.title1')}{' '}
                    <span className="gradient-text text-glow">
                        {t('homePage.creators.title2')}
                    </span>
                    </h2>
                    <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                    {t('homePage.creators.description')}
                    </p>
                    <div className="mt-4 flex flex-col items-start gap-4">
                    <Button
                        asChild
                        size="lg"
                        className="h-12 px-8 rounded-full gradient-bg text-black font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary"
                        onClick={() => setUserInterest('creator')}
                    >
                        <Link href="/creators/join">
                             <lucideIcons.Rocket className="mr-2 h-5 w-5" />
                            {t('homePage.creators.applyButton')}
                        </Link>
                    </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- HOW IT WORKS --- */}
        <div className="py-24 md:py-32 bg-muted/50 rounded-3xl">
             <div className="px-4 md:px-10 lg:px-12">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                        {howItWorks.title}
                    </h2>
                    <p className="text-lg md:text-xl text-foreground/70 mt-4">
                        {howItWorks.description}
                    </p>
                </div>
                 <div className="flex justify-center mb-12">
                    <div className="bg-background border p-1 rounded-full flex items-center gap-1">
                        <Button onClick={() => setActiveTab('brands')} variant={activeTab === 'brands' ? 'gradient' : 'ghost'} className="rounded-full px-6 text-base">
                            {t('homePage.faq.brandsTitle')}
                        </Button>
                        <Button onClick={() => setActiveTab('creators')} variant={activeTab === 'creators' ? 'gradient' : 'ghost'} className="rounded-full px-6 text-base">
                             {t('homePage.faq.creatorsTitle')}
                        </Button>
                    </div>
                </div>

                {activeTab === 'brands' && howItWorks.brands && (
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {howItWorks.brands.steps.map((step: any, index: number) => (
                            <HowItWorksCard key={index} step={index+1} title={step.title} description={step.description} icon={step.icon} />
                        ))}
                    </div>
                )}
                 {activeTab === 'creators' && howItWorks.creators && (
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {howItWorks.creators.steps.map((step: any, index: number) => (
                           <HowItWorksCard key={index} step={index+1} title={step.title} description={step.description} icon={step.icon} />
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* --- KILLER FEATURE: ESCROW --- */}
         <div className="py-24 md:py-32 scroll-mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                <div className="flex flex-col gap-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight">
                        {t('homePage.escrow.title')}{' '}
                        <span className="gradient-text text-glow">
                           {t('homePage.escrow.titleHighlight')}
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                        {t('homePage.escrow.description')}
                    </p>
                </div>
                <div className="relative w-full h-[400px] flex items-center justify-center">
                    <AnimatedEscrow />
                </div>
            </div>
        </div>


        {/* --- TESTIMONIALS --- */}
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
                            <Avatar className="w-12 h-12 border-2 border-background">
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-bold">{testimonial.name}</div>
                                <div className="text-sm text-foreground/70">{testimonial.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- FINAL CTA --- */}
         <div className="py-24 md:py-32">
            <div className="text-center bg-card border rounded-3xl p-10 md:p-16">
              <div className="max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
                  {t('homePage.finalCta.title')}
                </h2>
                <p className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-8">
                 {t('homePage.finalCta.description')}
                </p>
                <Button asChild size="lg" className="min-w-[220px] h-14 px-8 gradient-bg text-black text-lg font-bold tracking-wide hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary rounded-full">
                  <Link href="/brands/join">{t('homePage.finalCta.button')}</Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">{t('homePage.finalCta.reassurance')}</p>
              </div>
            </div>
        </div>

    </div>
  );
}
