'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Check, AtSign, Phone, User, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { validateSocialHandle } from '@/ai/flows/validate-social-handle';

const WhatsAppIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-foreground/40 dark:text-foreground/50 ml-4"
  >
    <path
      fill="currentColor"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.165-.917-.223c-.246-.058-.496-.058-.744-.058-.247 0-.644.075-.99.422-.346.346-1.328 1.299-1.328 3.165 0 1.866 1.354 3.666 1.549 3.915.196.249 2.62 4.226 6.323 5.576.87.325 1.56.52 2.096.66.703.198 1.34.166 1.82.1.572-.075 1.758-.716 2.006-1.413.248-.697.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.487 5.468c-1.795 0-3.257-1.46-3.257-3.257 0-1.795 1.46-3.257 3.257-3.257 1.795 0 3.257 1.46 3.257 3.257 0 1.795-1.46 3.257-3.257 3.257m8.363-18.299c-3.15-3.15-8.26-3.15-11.41 0s-3.15 8.26 0 11.41c3.15 3.15 8.26 3.15 11.41 0 3.15-3.15 3.15-8.26 0-11.41M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"
    />
  </svg>
);

export function CreatorJoinForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [socialInputs, setSocialInputs] = useState({ instagram: '', tiktok: '' });
  const [socialStatus, setSocialStatus] = useState({ instagram: 'idle', tiktok: 'idle' });
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [otherNiche, setOtherNiche] = useState('');
  const [useDifferentWhatsapp, setUseDifferentWhatsapp] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleSocialChange = async (platform: 'instagram' | 'tiktok', value: string) => {
    setSocialInputs(prev => ({ ...prev, [platform]: value }));
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

  const handleNicheSelect = (niche: string) => {
    setSelectedNiches(prev => 
      prev.includes(niche) ? prev.filter(n => n !== niche) : [...prev, niche]
    );
  };
  
  const niches = t('creatorJoinForm.niches', { returnObjects: true }) as { id: string; label: string; icon: string }[];
  
  const steps = [
    { step: 1, title: t('creatorJoinForm.steps.1.title'), description: t('creatorJoinForm.steps.1.description'), progress: 20 },
    { step: 2, title: t('creatorJoinForm.steps.2.title'), description: t('creatorJoinForm.steps.2.description'), progress: 40 },
    { step: 3, title: t('creatorJoinForm.steps.3.title'), description: t('creatorJoinForm.steps.3.description'), progress: 60 },
    { step: 4, title: t('creatorJoinForm.steps.4.title'), description: t('creatorJoinForm.steps.4.description'), progress: 80 },
    { step: 5, title: t('creatorJoinForm.steps.5.title'), description: t('creatorJoinForm.steps.5.description'), progress: 100 },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if(currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
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
                        <Button size="lg" className="gradient-bg text-black font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50" onClick={() => router.push('/')}>
                            {t('creatorJoinForm.finalStep.backButton')}
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

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
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
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fullName" className="font-semibold text-sm">{t('creatorJoinForm.step1.nameLabel')}</Label>
                        <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                            <User className="text-foreground/40 dark:text-foreground/50 w-5 h-5 ml-4" />
                            <Input id="fullName" placeholder={t('creatorJoinForm.step1.namePlaceholder')} className="h-12 w-full bg-transparent p-3 pr-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="font-semibold text-sm">{t('creatorJoinForm.step1.emailLabel')}</Label>
                            <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                                <AtSign className="text-foreground/40 dark:text-foreground/50 w-5 h-5 ml-4" />
                                <Input id="email" type="email" placeholder={t('creatorJoinForm.step1.emailPlaceholder')} className="h-12 w-full bg-transparent p-3 pr-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone" className="font-semibold text-sm">{t('creatorJoinForm.step1.phoneLabel')}</Label>
                            <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                                <Phone className="text-foreground/40 dark:text-foreground/50 w-5 h-5 ml-4" />
                                <Input id="phone" type="tel" placeholder={t('creatorJoinForm.step1.phonePlaceholder')} className="h-12 w-full bg-transparent p-3 pr-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="different-whatsapp" checked={useDifferentWhatsapp} onCheckedChange={(checked) => setUseDifferentWhatsapp(checked as boolean)} />
                            <label htmlFor="different-whatsapp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t('creatorJoinForm.step1.differentWhatsappLabel')}
                            </label>
                        </div>
                        {useDifferentWhatsapp && (
                             <div className="flex flex-col gap-2">
                                <Label htmlFor="whatsapp" className="font-semibold text-sm">{t('creatorJoinForm.step1.whatsappLabel')}</Label>
                                <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                                    <WhatsAppIcon />
                                    <Input id="whatsapp" type="tel" placeholder={t('creatorJoinForm.step1.whatsappPlaceholder')} className="h-12 w-full bg-transparent p-3 pr-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {currentStep === 2 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">{t('creatorJoinForm.step2.header')}</h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="instagram" className="text-sm font-medium">{t('creatorJoinForm.step2.instagramLabel')}</Label>
                        <div className="relative flex items-center">
                            <AtSign className="absolute left-3.5 h-5 w-5 text-gray-400" />
                            <Input 
                                id="instagram" 
                                placeholder={t('creatorJoinForm.step2.handlePlaceholder')}
                                className="pl-10 h-12 pr-12"
                                value={socialInputs.instagram}
                                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                             />
                            <div className="absolute right-3 h-full flex items-center justify-center">
                                {socialStatus.instagram === 'checking' && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
                                {socialStatus.instagram === 'connected' && <Check className="h-5 w-5 text-green-500" />}
                                {socialStatus.instagram === 'error' && <span className="text-red-500 text-xs font-bold">Error</span>}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tiktok" className="text-sm font-medium">{t('creatorJoinForm.step2.tiktokLabel')}</Label>
                         <div className="relative flex items-center">
                            <AtSign className="absolute left-3.5 h-5 w-5 text-gray-400" />
                            <Input 
                                id="tiktok" 
                                placeholder={t('creatorJoinForm.step2.handlePlaceholder')}
                                className="pl-10 h-12 pr-12"
                                value={socialInputs.tiktok}
                                onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                            />
                            <div className="absolute right-3 h-full flex items-center justify-center">
                                {socialStatus.tiktok === 'checking' && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
                                {socialStatus.tiktok === 'connected' && <Check className="h-5 w-5 text-green-500" />}
                                {socialStatus.tiktok === 'error' && <span className="text-red-500 text-xs font-bold">Error</span>}
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="mt-6 text-center">
                    <a className="text-sm text-foreground/60 hover:text-primary" href="#">{t('creatorJoinForm.step2.whyConnectLink')}</a>
                </div>
            </div>
        )}

        {currentStep === 3 && (
             <div className="space-y-6">
                <h2 className="text-2xl font-bold">{t('creatorJoinForm.step3.header')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {niches.map((niche) => (
                    <button 
                      key={niche.id}
                      onClick={() => handleNicheSelect(niche.id)}
                      className={cn(
                        "group flex flex-col items-center justify-center p-4 rounded-lg border-2 text-center transition-all duration-300",
                        selectedNiches.includes(niche.id) 
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
                        selectedNiches.includes(niche.id) ? 'text-primary' : 'text-foreground/80'
                      )}>
                        {niche.label}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedNiches.includes('other') && (
                    <div className="space-y-2 pt-4">
                        <Label htmlFor="otherNiche" className="text-sm font-medium">{t('creatorJoinForm.step3.otherNicheLabel')}</Label>
                        <Input 
                            id="otherNiche"
                            placeholder={t('creatorJoinForm.step3.otherNichePlaceholder')}
                            value={otherNiche}
                            onChange={(e) => setOtherNiche(e.target.value)}
                        />
                    </div>
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
                            shield
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-center">{t('creatorJoinForm.step4.header')}</h2>
                    <p className="text-center text-foreground/70 max-w-md">{t('creatorJoinForm.step4.description')}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-6">
                    <label className="flex items-start space-x-4 cursor-pointer">
                         <Checkbox id="pledge" className="custom-checkbox mt-1" />
                        <span className="font-medium text-foreground/80">{t('creatorJoinForm.step4.pledge')}</span>
                    </label>
                </div>
            </div>
        )}

        <div className="flex justify-between gap-4 mt-8">
            <Button variant="outline" onClick={handleBack} className={currentStep === 1 ? 'invisible' : ''}>
            {t('creatorJoinForm.backButton')}
            </Button>
            <Button onClick={handleNext} className="gradient-bg text-black font-semibold">
                {getNextButtonText()}
                {currentStep < 4 && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
        </div>
      </div>
    </div>
  );
}
