'use client';

import React from 'react';
import Link from 'next/link';
import { Button, ButtonProps } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';

type UserInterest = 'creator' | 'brand';

interface InterestButtonProps extends ButtonProps {
  interest: UserInterest;
  href: string;
  children: React.ReactNode;
}

export const InterestButton: React.FC<InterestButtonProps> = ({
  interest,
  href,
  children,
  onClick,
  ...props
}) => {
  const { setUserInterest } = useLanguage();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setUserInterest(interest);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button asChild {...props} onClick={handleClick}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};
