'use client';

import { CreatorJoinForm } from '@/components/creator-join-form';
import Link from 'next/link';

export default function CreatorJoinPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <CreatorJoinForm />
      </div>
    </div>
  );
}
