'use client';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';

export function BrandJoinSuccessPage() {
  const { t } = useLanguage();
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/30 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-secondary/30 opacity-50 blur-3xl"></div>
      </div>
      <div className="z-10 flex h-full grow flex-col items-center justify-center">
        <div className="flex w-full max-w-lg flex-1 flex-col items-center justify-center text-center">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <span className="material-symbols-outlined text-4xl text-black">
                    done
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#1D1D1F] dark:text-white">
                  {t('brandJoinSuccessPage.title')}
                </p>
                <p className="mx-auto max-w-md text-base font-normal leading-normal text-[#617589] dark:text-gray-300">
                  {t('brandJoinSuccessPage.description')}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Button
                asChild
                className="h-12 w-full rounded-xl bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-black hover:bg-primary/90 active:bg-primary/80"
              >
                <Link href="/">{t('brandJoinSuccessPage.backButton')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
