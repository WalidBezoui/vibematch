'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ArrowRight, Palette, Storefront } from 'lucide-react';

type SignupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SignupDialog({ open, onOpenChange }: SignupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center items-center">
          <span className="material-symbols-outlined text-5xl gradient-text mb-4">
            auto_awesome
          </span>
          <DialogTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Join VibeMatch
          </DialogTitle>
          <DialogDescription className="text-md">
            Choose your path and start your journey with us.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/brands/join"
            className="group relative flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg border hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-glow-primary"
          >
            <Storefront className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-bold text-lg">I'm a Brand</h3>
            <p className="text-sm text-foreground/60 mt-1">
              Find the perfect creators.
            </p>
            <span className="absolute -bottom-px -right-px h-8 w-8">
              <span className="absolute inset-0.5 bg-primary/20 rounded-br-lg rounded-tl-lg group-hover:bg-primary/40 transition-colors duration-300"></span>
              <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-4 h-4" />
            </span>
          </Link>
          <Link
            href="/creators/join"
            className="group relative flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg border hover:border-secondary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-glow-secondary"
          >
            <Palette className="w-10 h-10 text-accent mb-3" />
            <h3 className="font-bold text-lg">I'm a Creator</h3>
            <p className="text-sm text-foreground/60 mt-1">
              Collaborate with brands.
            </p>
            <span className="absolute -bottom-px -right-px h-8 w-8">
              <span className="absolute inset-0.5 bg-accent/20 rounded-br-lg rounded-tl-lg group-hover:bg-accent/40 transition-colors duration-300"></span>
               <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent w-4 h-4" />
            </span>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
