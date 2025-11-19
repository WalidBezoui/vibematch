
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useUserProfile } from '@/firebase';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

export function ProfileCompletionBanner() {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();

  const profileCompletion = useMemo(() => {
    if (!userProfile) return 30;
    
    const fields = [
        userProfile.photoURL,
        userProfile.displayName,
        userProfile.location,
        userProfile.bio,
        userProfile.tags?.length > 0
    ];
    const completedFields = fields.filter(Boolean).length;
    const totalFields = fields.length;
    // Base of 30%, the other 70% is from completed fields
    const completionPercentage = 30 + Math.round((completedFields / totalFields) * 70);
    return completionPercentage;
  }, [userProfile]);

  if (isProfileLoading) {
      return (
          <div className="bg-muted border-b px-6 py-3">
              <Skeleton className="h-8 w-1/2 mx-auto" />
          </div>
      )
  }

  if (profileCompletion >= 100) {
      return null; // Don't show the banner if profile is complete
  }

  return (
    <div className="bg-secondary/50 border-b border-primary/20 px-4 sm:px-6 py-2">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
            <div className="flex-grow flex items-center gap-4">
                 <div className="flex-shrink-0">
                    <span className="font-bold text-primary">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2 w-full max-w-xs" />
                <p className="text-sm font-medium text-foreground/80 hidden md:block">
                    Complete your profile to attract more brands!
                </p>
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
