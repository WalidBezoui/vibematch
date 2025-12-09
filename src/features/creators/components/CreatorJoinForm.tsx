
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Check, AtSign, Phone, User, Loader2, Home, Info, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { validateSocialHandle } from '@/ai/flows/validate-social-handle';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFirestore, useAuth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { signInAnonymously } from 'firebase/auth';

const creatorApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  useDifferentWhatsapp: z.boolean(),
  whatsapp: z.string().optional(),
  instagram: z.string().min(1, "Instagram handle is required."),
  tiktok: z.string().optional(),
  niches: z.array(z.string()).min(1, "Please select at least one niche."),
  otherNiche: z.string().optional(),
  pledge: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the professionalism pledge." }),
  }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms and Agreements." }),
  }),
}).superRefine((data, ctx) => {
    if (data.useDifferentWhatsapp && !data.whatsapp) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['whatsapp'],
            message: "A valid WhatsApp number is required.",
        });
    }
});

type CreatorApplicationForm = z.infer<typeof creatorApplicationSchema>;

const WhatsAppIcon = () => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-foreground/40 dark:text-foreground/50 ml-4 rtl:ml-0 rtl:mr-4"
    >
      <path
        fill="currentColor"
        d="M12.04 2.01A10.02 10.02 0 0 0 2.02 12.03a10.02 10.02 0 0 0 10.02 10.02 10.02 10.02 0 0 0 10.02-10.02c0-5.52-4.5-10.02-10.02-10.02zm0 18.23c-4.53 0-8.21-3.68-8.21-8.21s3.68-8.21 8.21-8.21 8.21 3.68 8.21 8.21-3.68 8.21-8.21-8.21zm3.63-6.02c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.49.11-.14.22-.57.71-.7 1.04-.13.33-.26.37-.48.26-.22-.11-.93-.34-1.77-1.09-.65-.58-1.09-1.3-1.22-1.52s-.02-.33.09-.44c.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.14.04-.26-.01-.37-.06-.11-.49-1.18-.68-1.61-.18-.44-.37-.37-.5-.38h-.27c-.22 0-.48.07-.73.33-.25.26-.97.94-.97 2.3 0 1.36.99 2.67 1.13 2.85.14.18 1.94 2.96 4.7 4.14.65.28 1.17.45 1.57.57.69.21 1.32.18 1.8.11.53-.07 1.59-.65 1.81-1.28.22-.63.22-1.17.15-1.28-.07-.11-.26-.18-.48-.29z"
      />
    </svg>
);

export function CreatorJoinForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [socialStatus, setSocialStatus] = useState({ instagram: 'idle', tiktok: 'idle' });
  const router = useRouter();
  const { t, dir } = useLanguage();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<CreatorApplicationForm>({
    resolver: zodResolver(creatorApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      useDifferentWhatsapp: false,
      whatsapp: '',
      instagram: '',
      tiktok: '',
      niches: [],
      otherNiche: '',
      pledge: false,
      terms: false,
    }
  });

  const niches = t('creatorJoinForm.niches', { returnObjects: true }) as { id: string; label: string; icon: string }[];
  
  const steps = [
    { step: 1, title: t('creatorJoinForm.steps.1.title'), description: t('creatorJoinForm.steps.1.description'), progress: 20, fields: ['fullName', 'email', 'phone', 'useDifferentWhatsapp', 'whatsapp'] },
    { step: 2, title: t('creatorJoinForm.steps.2.title'), description: t('creatorJoinForm.steps.2.description'), progress: 40, fields: ['instagram'] },
    { step: 3, title: t('creatorJoinForm.steps.3.title'), description: t('creatorJoinForm.steps.3.description'), progress: 60, fields: ['niches'] },
    { step: 4, title: t('creatorJoinForm.steps.4.title'), description: t('creatorJoinForm.steps.4.description'), progress: 80, fields: ['pledge', 'terms'] },
    { step: 5, title: t('creatorJoinForm.steps.5.title'), description: t('creatorJoinForm.steps.5.description'), progress: 100 },
  ];
  
  const onSubmit: SubmitHandler<CreatorApplicationForm> = async (data) => {
    if (!firestore || !auth) return;
    try {
      await signInAnonymously(auth);
      const collectionRef = collection(firestore, 'creator-applications');
      const { useDifferentWhatsapp, ...submissionData } = data;
      await addDoc(collectionRef, {
        ...submissionData,
        createdAt: serverTimestamp(),
      });
      setCurrentStep(5);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message || "Could not submit your application.",
      });
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields as (keyof CreatorApplicationForm)[];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
    } else if (isValid && currentStep === 4) {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    if(currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSocialChange = async (platform: 'instagram' | 'tiktok', value: string) => {
    form.setValue(platform, value);
    if(value) {
        setSocialStatus(prev => ({...prev, [platform]: 'checking'}));
        try {
            const result = await validateSocialHandle({ platform, handle: value });
            if (result.exists) {
                setSocialStatus(prev => ({...prev, [platform]: 'connected'}));
            } else {
                setSocialStatus(prev => ({...prev, [platform]: 'error'}));
            }
        } catch (error) {
            console.error("Validation error", error);
            setSocialStatus(prev => ({...prev, [platform]: 'error'}));
        }
    } else {
        setSocialStatus(prev => ({...prev, [platform]: 'idle'}));
    }
  };
  
  const currentStepInfo = steps[currentStep - 1];

  if (currentStep === 5) {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-200/50 dark:bg-grid-gray-700/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary-darker,var(--primary)))/20,transparent)]"></div></div>
            <div className="w-full max-w-2xl text-center z-10">
                <div className="bg-white/80 dark:bg-background/80 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl shadow-primary/10 p-8 sm:p-12 space-y-8">
                    <div className="relative inline-block">
                        <div className="w-28 h-28 gradient-bg rounded-full flex items-center justify-center shadow-glow-primary animate-circle-grow">
                        <svg className="w-16 h-16 text-black animate-check-grow" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" viewBox="0 0 52 52">
                            <path d="M14 27l8.5 8.5L38 20"></path>
                        </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter sm:text-4xl lg:text-5xl gradient-text">{t('creatorJoinForm.finalStep.title')}</h1>
                    <p className="text-lg text-foreground/70 max-w-xl mx-auto">
                      {t('creatorJoinForm.finalStep.description')}
                    </p>
                    <div className="pt-4">
                        <Button asChild size="lg" className="gradient-bg text-black font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50">
                            <Link href="/">{t('creatorJoinForm.finalStep.backButton')}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
  }

  const getNextButtonText = () => {
    if (currentStep === 4) return t('creatorJoinForm.submitButton');
    const nextStepTitle = steps[currentStep]?.title;
    if (nextStepTitle) {
      return `${t('creatorJoinForm.nextButtonText')} ${t(`creatorJoinForm.steps.${currentStep + 1}.short_title`)}`;
    }
    return t('creatorJoinForm.nextButton');
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="font-semibold gradient-text">VibeMatch</p>
        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">{currentStepInfo.title}</h1>
        <p className="mt-4 text-lg text-foreground/70">{currentStepInfo.description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col gap-3">
              {currentStep < 5 && 
                  <>
                      <div className="flex gap-6 justify-between">
                          <p className="text-sm font-medium leading-normal text-foreground/70">{t('creatorJoinForm.stepCounter', { current: currentStep, total: 4 })}</p>
                      </div>
                      <Progress value={currentStepInfo.progress} className="h-2 [&>div]:gradient-bg" />
                  </>
              }
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">{t('creatorJoinForm.step1.header')}</h2>
                    <p className="mt-2 text-foreground/70">{t('creatorJoinForm.step1.description')}</p>
                </div>
                <div className="space-y-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="fullName" className="font-semibold text-sm">{t('creatorJoinForm.step1.nameLabel')}</FormLabel>
                          <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                              <User className="text-foreground/40 dark:text-foreground/50 w-5 h-5 ml-4 rtl:ml-0 rtl:mr-4" />
                              <FormControl>
                                <Input id="fullName" placeholder={t('creatorJoinForm.step1.namePlaceholder')} {...field} className="h-12 w-full bg-transparent p-3 pr-4 rtl:pr-3 rtl:pl-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0" />
                              </FormControl>
                          </div>
                          <FormMessage />
                      </FormItem>
                    )} />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                              <FormLabel htmlFor="email" className="font-semibold text-sm">{t('creatorJoinForm.step1.emailLabel')}</FormLabel>
                              <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                                  <AtSign className="text-foreground/40 dark:text-foreground/50 w-5 h-5 ml-4 rtl:ml-0 rtl:mr-4" />
                                  <FormControl>
                                    <Input id="email" type="email" placeholder={t('creatorJoinForm.step1.emailPlaceholder')} {...field} className="h-12 w-full bg-transparent p-3 pr-4 rtl:pr-3 rtl:pl-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0" />
                                  </FormControl>
                              </div>
                              <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                              <FormLabel htmlFor="phone" className="font-semibold text-sm">{t('creatorJoinForm.step1.phoneLabel')}</FormLabel>
                              <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                                  <Phone className="text-foreground/40 dark:text-foreground/50 w-5 h-5 ml-4 rtl:ml-0 rtl:mr-4" />
                                  <FormControl>
                                    <Input id="phone" type="tel" placeholder={t('creatorJoinForm.step1.phonePlaceholder')} {...field} className="h-12 w-full bg-transparent p-3 pr-4 rtl:pr-3 rtl:pl-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0" />
                                  </FormControl>
                              </div>
                              <FormMessage />
                          </FormItem>
                        )} />
                    </div>
                    <div className="space-y-4">
                        <FormField control={form.control} name="useDifferentWhatsapp" render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 rtl:space-x-reverse">
                              <FormControl>
                                <Checkbox id="different-whatsapp" checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <label htmlFor="different-whatsapp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  {t('creatorJoinForm.step1.differentWhatsappLabel')}
                              </label>
                          </FormItem>
                        )} />
                        {form.watch('useDifferentWhatsapp') && (
                            <FormField control={form.control} name="whatsapp" render={({ field }) => (
                              <FormItem>
                                  <FormLabel htmlFor="whatsapp" className="font-semibold text-sm">{t('creatorJoinForm.step1.whatsappLabel')}</FormLabel>
                                  <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                                      <WhatsAppIcon />
                                      <FormControl>
                                        <Input id="whatsapp" type="tel" placeholder={t('creatorJoinForm.step1.whatsappPlaceholder')} {...field} className="h-12 w-full bg-transparent p-3 pr-4 rtl:pr-3 rtl:pl-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0" />
                                      </FormControl>
                                  </div>
                                  <FormMessage />
                              </FormItem>
                            )} />
                        )}
                    </div>
                </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">{t('creatorJoinForm.step2.header')}</h2>
                <div className="space-y-4">
                    <FormField control={form.control} name="instagram" render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="instagram" className="text-sm font-medium">{t('creatorJoinForm.step2.instagramLabel')}</FormLabel>
                        <div className="relative flex items-center">
                            <AtSign className="absolute left-3.5 rtl:left-auto rtl:right-3.5 h-5 w-5 text-gray-400" />
                            <FormControl>
                              <Input 
                                  id="instagram" 
                                  placeholder={t('creatorJoinForm.step2.handlePlaceholder')}
                                  className="pl-10 rtl:pl-3 rtl:pr-10 h-12 pr-12 rtl:pr-3 rtl:pl-12"
                                  value={field.value}
                                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                               />
                            </FormControl>
                            <div className="absolute right-3 rtl:right-auto rtl:left-3 h-full flex items-center justify-center">
                                {socialStatus.instagram === 'checking' && <Loader2 data-testid="loader-spin" className="h-5 w-5 animate-spin text-gray-400" />}
                                {socialStatus.instagram === 'connected' && <Check className="h-5 w-5 text-green-500" />}
                                {socialStatus.instagram === 'error' && <span className="text-red-500 text-xs font-bold">Error</span>}
                            </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="tiktok" render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="tiktok" className="text-sm font-medium">{t('creatorJoinForm.step2.tiktokLabel')}</FormLabel>
                         <div className="relative flex items-center">
                            <AtSign className="absolute left-3.5 rtl:left-auto rtl:right-3.5 h-5 w-5 text-gray-400" />
                            <FormControl>
                              <Input 
                                  id="tiktok" 
                                  placeholder={t('creatorJoinForm.step2.handlePlaceholder')}
                                  className="pl-10 rtl:pl-3 rtl:pr-10 h-12 pr-12 rtl:pr-3 rtl:pl-12"
                                  value={field.value}
                                  onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                              />
                            </FormControl>
                            <div className="absolute right-3 rtl:right-auto rtl:left-3 h-full flex items-center justify-center">
                                {socialStatus.tiktok === 'checking' && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
                                {socialStatus.tiktok === 'connected' && <Check className="h-5 w-5 text-green-500" />}
                                {socialStatus.tiktok === 'error' && <span className="text-red-500 text-xs font-bold">Error</span>}
                            </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
                 <Collapsible className="mt-6 text-center">
                    <CollapsibleTrigger className="text-sm text-foreground/60 hover:text-primary transition-colors data-[state=open]:text-primary data-[state=open]:font-medium">
                        {t('creatorJoinForm.step2.whyConnectLink')}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Alert className="mt-4 text-left rtl:text-right">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                {t('creatorJoinForm.step2.whyConnectAnswer')}
                            </AlertDescription>
                        </Alert>
                    </CollapsibleContent>
                </Collapsible>
            </div>
          )}

          {currentStep === 3 && (
             <div className="space-y-6">
                <h2 className="text-2xl font-bold">{t('creatorJoinForm.step3.header')}</h2>
                <FormField control={form.control} name="niches" render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {niches.map((niche) => (
                        <FormItem key={niche.id} className="flex-1">
                          <FormControl>
                            <button 
                              type="button"
                              onClick={() => {
                                const newValue = field.value.includes(niche.id)
                                  ? field.value.filter(n => n !== niche.id)
                                  : [...field.value, niche.id];
                                field.onChange(newValue);
                              }}
                              className={cn(
                                "group flex flex-col items-center justify-center w-full h-full p-4 rounded-lg border-2 text-center transition-all duration-300",
                                field.value.includes(niche.id)
                                  ? 'border-primary bg-primary/10' 
                                  : 'border-border hover:border-primary/50'
                              )}
                            >
                              <span className="material-symbols-outlined !text-4xl mb-2 transition-colors duration-300 group-hover:text-primary"
                                style={{fontVariationSettings: "'FILL' 0, 'wght' 300"}}>
                                {niche.icon}
                              </span>
                              <span className={cn(
                                "font-semibold text-sm",
                                field.value.includes(niche.id) ? 'text-primary' : 'text-foreground/80'
                              )}>
                                {niche.label}
                              </span>
                            </button>
                          </FormControl>
                        </FormItem>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
                {form.watch('niches').includes('other') && (
                    <FormField control={form.control} name="otherNiche" render={({ field }) => (
                      <FormItem className="space-y-2 pt-4">
                          <FormLabel htmlFor="otherNiche" className="text-sm font-medium">{t('creatorJoinForm.step3.otherNicheLabel')}</FormLabel>
                          <FormControl>
                            <Input 
                                id="otherNiche"
                                placeholder={t('creatorJoinForm.step3.otherNichePlaceholder')}
                                {...field}
                            />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                    )} />
                )}
            </div>
          )}

          {currentStep === 4 && (
              <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-6 pt-6 pb-2">
                      <div className="relative w-24 h-24">
                          <div className="absolute inset-0 rounded-full gradient-bg opacity-20"></div>
                          <div className="absolute inset-2 rounded-full gradient-bg opacity-30"></div>
                          <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center !text-6xl gradient-text" style={{fontVariationSettings: "'FILL' 1, 'wght' 700"}}>
                              shield_person
                          </span>
                      </div>
                      <h2 className="text-2xl font-bold text-center">{t('creatorJoinForm.step4.header')}</h2>
                      <p className="text-center text-foreground/70 max-w-md">{t('creatorJoinForm.step4.description')}</p>
                  </div>
                  <div className="space-y-6 rounded-lg bg-muted/50 p-6">
                      <FormField control={form.control} name="pledge" render={({ field }) => (
                        <FormItem className="flex items-start space-x-4 rtl:space-x-reverse cursor-pointer">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} id="pledge" className="custom-checkbox mt-1" />
                            </FormControl>
                            <div className="grid gap-1.5 leading-none">
                              <label htmlFor="pledge" className="font-medium text-foreground/80 cursor-pointer">
                                  {t('creatorJoinForm.step4.pledge')}
                              </label>
                              <FormMessage />
                            </div>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="terms" render={({ field }) => (
                        <FormItem className="flex items-start space-x-4 rtl:space-x-reverse cursor-pointer">
                             <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" className="custom-checkbox mt-1" />
                            </FormControl>
                            <div className="grid gap-1.5 leading-none">
                              <label htmlFor="terms" className="font-medium text-foreground/80 cursor-pointer">
                                  {t('creatorJoinForm.step4.creatorMandate')}
                              </label>
                              <FormMessage />
                            </div>
                        </FormItem>
                      )} />
                  </div>
              </div>
          )}

          <div className="flex justify-between gap-4 mt-8">
              {currentStep === 1 ? (
                  <Button asChild variant="outline" className="rounded-full">
                      <Link href="/">
                          <Home className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
                          {t('header.home')}
                      </Link>
                  </Button>
              ) : (
                  <Button type="button" variant="outline" onClick={handleBack} className="rounded-full">
                      {t('creatorJoinForm.backButton')}
                  </Button>
              )}
              <Button type="button" onClick={handleNext} disabled={form.formState.isSubmitting} className="gradient-bg text-black font-semibold rounded-full disabled:opacity-50">
                  {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : getNextButtonText()}
                  {currentStep < 4 && !form.formState.isSubmitting && (dir === 'ltr' ? <ArrowRight className="h-4 w-4 ml-2" /> : <ArrowLeft className="h-4 w-4 mr-2" />)}
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
