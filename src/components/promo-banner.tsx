'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type BannerMessage = {
  title: string;
  subtitle: string;
  cta: string;
};

export function PromoBanner() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<BannerMessage | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const isDismissed = localStorage.getItem('promoBannerDismissed');
    if (isDismissed) {
      setIsVisible(false);
      return;
    }

    const userInterest = localStorage.getItem('userInterest');
    const generalMessages = t('promoBanner.general', { returnObjects: true }) as BannerMessage[];
    const creatorMessages = t('promoBanner.creator', { returnObjects: true }) as BannerMessage[];
    const brandMessages = t('promoBanner.brand', { returnObjects: true }) as BannerMessage[];

    let selectedMessage;

    if (userInterest === 'creator' && creatorMessages.length > 0) {
      selectedMessage = creatorMessages[Math.floor(Math.random() * creatorMessages.length)];
    } else if (userInterest === 'brand' && brandMessages.length > 0) {
      selectedMessage = brandMessages[Math.floor(Math.random() * brandMessages.length)];
    } else if (generalMessages.length > 0) {
      selectedMessage = generalMessages[Math.floor(Math.random() * generalMessages.length)];
    } else {
        // Fallback in case translations aren't loaded yet
        setIsVisible(false);
        return;
    }

    setMessage(selectedMessage);
    setIsVisible(true);
    
  }, [t]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('promoBannerDismissed', 'true');
  };

  const showJoinButton = !pathname.startsWith('/creators/join') && !pathname.startsWith('/brands/join');

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div className="relative gradient-bg text-black isolate flex items-center gap-x-6 overflow-hidden px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 font-medium">
          <Sparkles className="inline-block w-4 h-4 mr-2" />
          {message.title}{' '}
          <span className="font-bold">{message.subtitle}</span>
        </p>
        {showJoinButton && (
          <Button asChild variant="outline" size="sm" className="bg-black/10 hover:bg-black/20 border-black/20 h-auto px-4 py-1 rounded-full text-black">
              <Link href="/creators/join">
                  {message.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]" onClick={handleDismiss}>
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5 text-black" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
