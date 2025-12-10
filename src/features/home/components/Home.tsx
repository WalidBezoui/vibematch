
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { getImage } from '@/lib/placeholder-images';
import React, { useEffect, useState } from 'react';
import * as lucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (lucideIcons as any)[name];
  if (!Icon) {
    return <lucideIcons.Sparkles className={className} />;
  }
  return <Icon className={className} />;
};

const HowItWorksCard = ({ step, title, description, icon }: { step: number; title: string; description: string; icon: string }) => (
    <div className="relative flex flex-col items-center p-6 bg-background rounded-2xl shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
        <div className="absolute -top-5 -left-5 w-14 h-14 gradient-bg text-black flex items-center justify-center rounded-full text-2xl font-bold shadow-md">
            {step}
        </div>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 mt-8">
            <DynamicIcon name={icon} className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-center">{title}</h3>
        <p className="text-foreground/70 leading-relaxed text-center mt-2">{description}</p>
    </div>
);


export function HomeComponent() {
  const { t, language, setUserInterest } = useLanguage();
  const [activeTab, setActiveTab] = useState('brands');

  const heroImage = getImage('hero-dashboard');
  const howItWorks = t('homePage.howItWorks', { returnObjects: true });
  const painPoints = t('homePage.painPoints', { returnObjects: true });
  const testimonials = t('homePage.testimonials', { returnObjects: true }) as { quote: string; name: string; role: string, image: string }[];
  const finalCta = t('homePage.finalCta', { returnObjects: true });

  return (
    <div className="flex flex-col max-w-[1200px] flex-1">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-150px)] py-10">
        <div className="flex flex-col gap-6 items-center">
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight ${language === 'AR' ? 'hero-title-ar' : ''}`}>
                {t('homePage.hero.title1')}
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
            <div className="mt-16 w-full max-w-5xl">
                <div className="relative w-full aspect-video rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden border border-primary/20">
                     {heroImage && (
                        <Image
                            src={heroImage.imageUrl}
                            alt={heroImage.description}
                            data-ai-hint={heroImage.imageHint}
                            fill
                            className="object-cover object-top"
                        />
                     )}
                </div>
            </div>
        </div>
      </div>

       {/* Social Proof */}
      <div className="py-16 text-center">
        <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">{t('homePage.trustedBy')}</p>
         <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 items-center">
            <div className="w-full h-12 relative grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <Image src="https://vibematch-public.s3.eu-west-3.amazonaws.com/cmi-logo-full.svg" alt="CMI Logo" fill className="object-contain"/>
            </div>
             <div className="w-full h-12 relative grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <Image src="https://vibematch-public.s3.eu-west-3.amazonaws.com/stripe-logo.svg" alt="Stripe Logo" fill className="object-contain"/>
            </div>
             <div className="w-full h-12 relative grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <Image src="https://vibematch-public.s3.eu-west-3.amazonaws.com/google-cloud-logo.svg" alt="Google Cloud Logo" fill className="object-contain"/>
            </div>
            <div className="w-full h-12 relative grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <Image src="https://vibematch-public.s3.eu-west-3.amazonaws.com/aws-logo.svg" alt="AWS Logo" fill className="object-contain"/>
            </div>
        </div>
      </div>

      {/* Pain Points */}
      <div className="py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-muted/50 rounded-2xl">
                <h3 className="text-3xl font-bold tracking-tight">{painPoints.brands.title}</h3>
                <p className="mt-4 text-lg text-foreground/70">{painPoints.brands.description}</p>
            </div>
             <div className="p-8 bg-muted/50 rounded-2xl">
                <h3 className="text-3xl font-bold tracking-tight">{painPoints.creators.title}</h3>
                <p className="mt-4 text-lg text-foreground/70">{painPoints.creators.description}</p>
            </div>
        </div>
      </div>

        {/* How It Works */}
        <div className="py-24 md:py-32 text-center" id="how-it-works">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">{howItWorks.title}</h2>
            <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-12">{howItWorks.description}</p>
            
            <Tabs defaultValue="brands" className="w-full max-w-md mx-auto" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 p-1 h-auto rounded-full bg-muted/80">
                    <TabsTrigger value="brands" className="py-2 rounded-full data-[state=active]:gradient-bg data-[state=active]:text-black data-[state=active]:shadow-md">{howItWorks.brands.tabTitle}</TabsTrigger>
                    <TabsTrigger value="creators" className="py-2 rounded-full data-[state=active]:gradient-bg data-[state=active]:text-black data-[state=active]:shadow-md">{howItWorks.creators.tabTitle}</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="mt-16">
                {activeTab === 'brands' ? (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {howItWorks.brands.steps.map((step: any, index: number) => (
                             <HowItWorksCard key={index} step={index+1} title={step.title} description={step.description} icon={step.icon} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {howItWorks.creators.steps.map((step: any, index: number) => (
                            <HowItWorksCard key={index} step={index+1} title={step.title} description={step.description} icon={step.icon} />
                        ))}
                    </div>
                )}
            </div>
        </div>

      {/* Killer Feature */}
      <div className="py-24 md:py-32">
        <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
              {t('homePage.killerFeature.title')}
            </h2>
            <p className="mt-4 text-lg text-foreground/70">{t('homePage.killerFeature.description')}</p>
        </div>
        <div className="relative w-full max-w-4xl mx-auto p-8 aspect-video bg-muted/30 border rounded-2xl flex items-center justify-center">
            <p className="text-muted-foreground">(Placeholder for Escrow Visual)</p>
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

       {/* Final CTA */}
      <div className="py-24 md:py-32">
        <div className="text-center bg-muted/50 rounded-2xl p-10 md:p-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{finalCta.title}</h2>
            <p className="mt-4 text-lg text-foreground/70 mb-8">{finalCta.subtitle}</p>
            <Button asChild size="lg" className="h-14 px-8 rounded-full gradient-bg text-black font-bold">
                 <Link href="/brands/join">{finalCta.button}</Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">{finalCta.reassurance}</p>
        </div>
      </div>

    </div>
  );
}
