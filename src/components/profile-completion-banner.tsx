
'use client';

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserProfile } from '@/firebase';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Image as ImageIcon, User, MapPin, Tag, Type, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function ProfileCompletionBanner() {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { t } = useLanguage();
  const [motivationalTip, setMotivationalTip] = useState('');

  useEffect(() => {
    const tips = t('creatorProfile.completionTips', { returnObjects: true }) as string[];
    if (tips && tips.length > 0) {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setMotivationalTip(tips[randomIndex]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const { percentage, nextStep } = useMemo(() => {
    if (!userProfile) return { percentage: 30, nextStep: { text: "Complete your profile", icon: User } };
    
    const fields = [
        { key: 'photoURL', present: !!userProfile.photoURL, text: "Add a profile picture", icon: ImageIcon },
        { key: 'displayName', present: !!userProfile.displayName, text: "Add your display name", icon: User },
        { key: 'location', present: !!userProfile.location, text: "Add your location", icon: MapPin },
        { key: 'tags', present: userProfile.tags && userProfile.tags.length > 0, text: "Choose at least one tag", icon: Tag },
        { key: 'bio', present: !!userProfile.bio, text: "Write a bio to tell your story", icon: Type },
    ];

    const completedFields = fields.filter(f => f.present).length;
    const totalFields = fields.length;
    
    const percentage = 30 + Math.round((completedFields / totalFields) * 70);

    const firstIncompleteStep = fields.find(f => !f.present);
    const nextStep = firstIncompleteStep || { text: "Profile is complete!", icon: User };

    return { percentage, nextStep };
  }, [userProfile]);

  if (isProfileLoading) {
      return (
          <div className="bg-muted border-b px-6 py-3">
              <Skeleton className="h-8 w-1/2 mx-auto" />
          </div>
      )
  }

  if (percentage >= 100) {
      return null; // Don't show the banner if profile is complete
  }
  
  const NextStepIcon = nextStep.icon;

  return (
    <div className="bg-secondary/50 border-b border-primary/20 px-4 sm:px-6 py-2">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
            <div className="flex-grow flex items-center gap-4">
                 <div className="flex-shrink-0">
                    <span className="font-bold text-primary">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2 w-full max-w-xs" />
                <div className="text-sm font-medium text-foreground/80 hidden md:flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <NextStepIcon className="h-4 w-4 text-muted-foreground" />
                     <span>Next: {nextStep.text}</span>
                   </div>
                   {motivationalTip && (
                     <div className="flex items-center gap-2 text-muted-foreground border-l pl-4">
                        <Lightbulb className="h-4 w-4 text-primary/80" />
                        <span className="text-foreground/60">{motivationalTip}</span>
                     </div>
                   )}
                </div>
            </div>
          <Button asChild size="sm" className="rounded-full gradient-bg text-black font-semibold h-8">
            <Link href="/profile">
              Complete Profile <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
