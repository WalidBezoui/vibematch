'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const TikTokIcon = () => (
  <svg
    className="w-8 h-8 text-white"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"></path>
  </svg>
);

const steps = [
  { step: 1, title: 'Become a Founding Creator', description: 'Join an exclusive community and shape the future of creator collaborations.', progress: 20 },
  { step: 2, title: 'Connect Your Socials', description: 'To ensure trust and efficiency, we use API connections to verify your social media presence. Your data is safe with us.', progress: 40 },
  { step: 3, title: 'Audience Analysis', description: 'We\'re running a quick scan to ensure a high-quality community.', progress: 60 },
  { step: 4, title: 'Professionalism Pledge', description: 'Our community is built on trust and reliability. Please confirm your commitment.', progress: 80 },
  { step: 5, title: 'Application Submitted!', description: 'Thank you for applying to be a Founding Creator.', progress: 100 },
];

type ConnectionStatus = 'idle' | 'connecting' | 'connected';
type Platform = 'instagram' | 'tiktok';

function ConnectionDialog({ platform, open, onOpenChange }: { platform: Platform | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [status, setStatus] = useState<ConnectionStatus>('idle');

  useEffect(() => {
    if (open) {
      setStatus('connecting');
      const timer = setTimeout(() => {
        setStatus('connected');
        const closeTimer = setTimeout(() => {
            onOpenChange(false);
        }, 1500);
        return () => clearTimeout(closeTimer);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setStatus('idle');
    }
  }, [open, onOpenChange]);

  const platformName = platform === 'instagram' ? 'Instagram' : 'TikTok';
  const platformColor = platform === 'instagram' ? 'text-pink-500' : 'text-cyan-400';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Connecting to {platformName}</DialogTitle>
          <DialogDescription className="text-center mt-2">
            You'll be redirected to securely authenticate your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center h-48">
          {status === 'connecting' && (
            <div className="flex flex-col items-center gap-4">
              <div className={`relative w-16 h-16`}>
                <div className={`absolute inset-0 rounded-full border-4 ${platform === 'instagram' ? 'border-pink-500/20' : 'border-cyan-400/20'}`}></div>
                <div className={`absolute inset-0 rounded-full border-t-4 ${platform === 'instagram' ? 'border-pink-500' : 'border-cyan-400'} animate-spinner`}></div>
              </div>
              <p className="text-foreground/70">Please wait...</p>
            </div>
          )}
          {status === 'connected' && (
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center animate-circle-grow">
                    <Check className="w-8 h-8 text-black animate-check-grow" strokeWidth={4} />
                </div>
                <p className="font-bold text-lg">Successfully Connected!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


export function CreatorJoinForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        setCurrentStep(4);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if(currentStep > 1) {
        if (currentStep === 4) {
            setCurrentStep(2); // Skip analysis step when going back
        } else {
            setCurrentStep((prev) => prev - 1);
        }
    }
  };
  
  const handleConnect = (platform: Platform) => {
    setConnectingPlatform(platform);
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!dialogOpen && connectingPlatform && !connectedPlatforms.includes(connectingPlatform)) {
      setConnectedPlatforms(prev => [...prev, connectingPlatform]);
    }
  }, [dialogOpen, connectingPlatform, connectedPlatforms]);


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
                    <h1 className="text-3xl font-black tracking-tighter sm:text-4xl lg:text-5xl gradient-text">Thank you for your application.</h1>
                    <p className="text-lg text-foreground/70 max-w-xl mx-auto">
                        Our team is reviewing your profile and you will receive a response within <span className="font-bold text-foreground">48 hours</span>.
                    </p>
                    <div className="pt-4">
                        <Button size="lg" className="gradient-bg text-black font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50" onClick={() => router.push('/')}>
                            Back to Homepage
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <ConnectionDialog platform={connectingPlatform} open={dialogOpen} onOpenChange={setDialogOpen} />
      <div className="text-center">
        <p className="font-semibold text-primary gradient-text">VibeMatch</p>
        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">{currentStepInfo.title}</h1>
        <p className="mt-4 text-lg text-foreground/70">{currentStepInfo.description}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col gap-3">
            {currentStep < 5 && 
                <>
                    <div className="flex gap-6 justify-between">
                        <p className="text-sm font-medium leading-normal text-foreground/70">Step {currentStep} of 4</p>
                    </div>
                    <Progress value={currentStepInfo.progress} className="h-2 [&>div]:gradient-bg" />
                </>
            }
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Welcome to the Inner Circle</h2>
              <p className="mt-2 text-foreground/70">As a Founding Creator, you'll get early access to VibeMatch, directly influence our platform's development, and connect with a curated network of top-tier talent and brands. Let's get started.</p>
            </div>
            <div className="space-y-4">
                <div className="flex flex-col flex-1">
                    <Label htmlFor="fullName" className="text-sm font-medium pb-2">Full Name</Label>
                    <Input id="fullName" placeholder="Enter your full name" />
                </div>
                <div className="flex flex-col flex-1">
                    <Label htmlFor="email" className="text-sm font-medium pb-2">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email address" />
                </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
            <div className="space-y-4">
                <button 
                  className="w-full text-left p-4 rounded-xl border border-border hover:border-primary transition-all duration-300 flex items-center gap-4 group"
                  onClick={() => handleConnect('instagram')}
                  disabled={connectedPlatforms.includes('instagram')}
                >
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center icon-bg-insta flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold">Connect Instagram</h3>
                        <p className="text-foreground/70">Securely connect via API to verify your account and import key metrics.</p>
                    </div>
                    {connectedPlatforms.includes('instagram') ? (
                       <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center animate-icon-spin">
                          <Check className="w-5 h-5 text-black" strokeWidth={3} />
                       </div>
                    ) : (
                      <ArrowRight className="text-foreground/30 group-hover:text-primary transition-colors" />
                    )}
                </button>
                <button 
                  className="w-full text-left p-4 rounded-xl border border-border hover:border-secondary transition-all duration-300 flex items-center gap-4 group"
                  onClick={() => handleConnect('tiktok')}
                  disabled={connectedPlatforms.includes('tiktok')}
                >
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center icon-bg-tiktok flex-shrink-0">
                       <TikTokIcon />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold">Connect TikTok</h3>
                        <p className="text-foreground/70">Link your TikTok account to showcase your engagement and reach.</p>
                    </div>
                    {connectedPlatforms.includes('tiktok') ? (
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center animate-icon-spin">
                        <Check className="w-5 h-5 text-black" strokeWidth={3}/>
                      </div>
                    ) : (
                      <ArrowRight className="text-foreground/30 group-hover:text-secondary transition-colors" />
                    )}
                </button>
                 <div className="mt-6 text-center">
                    <a className="text-sm text-foreground/60 hover:text-primary" href="#">Why do I need to connect my accounts?</a>
                </div>
            </div>
        )}

        {currentStep === 3 && (
             <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spinner"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary !text-4xl">
                            person_search
                        </span>
                    </div>
                </div>
                <h2 className="mt-8 text-2xl font-bold">Analyzing your audience...</h2>
                <p className="mt-2 text-foreground/70 animate-pulse">This might take a few moments. Please don't close this window.</p>
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
                    <h2 className="text-2xl font-bold text-center">Our Pledge for Quality</h2>
                    <p className="text-center text-foreground/70 max-w-md">To ensure VibeMatch remains a high-trust platform, we require all creators to commit to professional standards. This helps us maintain a reliable environment for everyone.</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-6">
                    <label className="flex items-start space-x-4 cursor-pointer">
                         <Checkbox id="pledge" className="custom-checkbox mt-1" />
                        <span className="font-medium text-foreground/80">I commit to meeting deadlines and not using fake engagement.</span>
                    </label>
                </div>
            </div>
        )}


        {currentStep < 3 && (
          <div className="flex justify-between gap-4 mt-6">
             <Button variant="outline" onClick={handleBack} className={currentStep === 1 ? 'invisible' : ''}>
              Back
            </Button>
            <Button onClick={handleNext} className="gradient-bg text-black">
              Next Step
            </Button>
          </div>
        )}
        {currentStep === 4 && (
             <div className="flex justify-between gap-4 mt-6">
             <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext} className="gradient-bg text-black">
              Submit Application
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
