
'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ArrowRight, Palette, Store, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

type SignupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SignupDialog({ open, onOpenChange }: SignupDialogProps) {
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center items-center">
          <span className="material-symbols-outlined text-5xl gradient-text mb-4">
            auto_awesome
          </span>
          <DialogTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {t('signupDialog.title')}
          </DialogTitle>
          <DialogDescription className="text-md">
            {t('signupDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/signup/brand"
            className="group relative flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg border hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-glow-primary"
            onClick={() => onOpenChange(false)}
          >
            <Store className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-bold text-lg">{t('signupDialog.brand.title')}</h3>
            <p className="text-sm text-foreground/60 mt-1">
              {t('signupDialog.brand.description')}
            </p>
            <span className="absolute -bottom-px -right-px rtl:-right-auto rtl:-left-px h-8 w-8">
              <span className="absolute inset-0.5 bg-primary/20 rounded-br-lg rounded-tl-lg rtl:rounded-bl-lg rtl:rounded-tr-lg group-hover:bg-primary/40 transition-colors duration-300"></span>
              <Arrow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-4 h-4" />
            </span>
          </Link>
          <Link
            href="/signup/creator"
            className="group relative flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg border hover:border-secondary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-glow-secondary"
            onClick={() => onOpenChange(false)}
          >
            <Palette className="w-10 h-10 text-accent mb-3" />
            <h3 className="font-bold text-lg">{t('signupDialog.creator.title')}</h3>
            <p className="text-sm text-foreground/60 mt-1">
              {t('signupDialog.creator.description')}
            </p>
            <span className="absolute -bottom-px -right-px rtl:-right-auto rtl:-left-px h-8 w-8">
              <span className="absolute inset-0.5 bg-accent/20 rounded-br-lg rounded-tl-lg rtl:rounded-bl-lg rtl:rounded-tr-lg group-hover:bg-accent/40 transition-colors duration-300"></span>
               <Arrow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent w-4 h-4" />
            </span>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
