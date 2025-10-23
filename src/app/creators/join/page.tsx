'use client';

import { CreatorJoinForm } from '@/components/creator-join-form';
import { PromoBanner } from '@/components/promo-banner';
import { useLanguage } from '@/context/language-context';

export default function CreatorJoinPage() {
  const { dir } = useLanguage();
  return (
    <>
    <PromoBanner />
    <div
      dir={dir}
      className={`relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8`}
    >
      <div className="w-full max-w-2xl">
        <CreatorJoinForm />
      </div>
    </div>
    </>
  );
}
