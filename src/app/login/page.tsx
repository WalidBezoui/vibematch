'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignupDialog } from '@/components/signup-dialog';
import { AppHeader } from '@/components/app-header';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center hero-bg px-4 py-10">
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
            <div className="relative bg-background/80 dark:bg-background/80 backdrop-blur-xl border rounded-xl shadow-2xl shadow-primary/10">
              <div className="p-8 md:p-12 flex flex-col gap-8">
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-tight">
                    Welcome to <span className="gradient-text">VibeMatch</span>
                  </h1>
                  <p className="mt-2 text-md text-foreground/60">
                    Connect to your dashboard.
                  </p>
                </div>
                <form className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="email"
                      className="font-semibold text-sm"
                    >
                      Email Address
                    </Label>
                    <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                      <Mail className="text-foreground/40 dark:text-foreground/50 w-5 h-5 ml-4" />
                      <Input
                        className="w-full bg-transparent p-3 pr-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0"
                        id="email"
                        placeholder="your@email.com"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="password"
                        className="font-semibold text-sm"
                      >
                        Password
                      </Label>
                      <Link
                        className="text-sm font-medium text-primary hover:text-secondary transition-colors"
                        href="#"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="flex items-center bg-muted/50 border rounded-lg transition-all duration-300 input-focus">
                      <Lock className="text-foreground/40 dark:text-foreground/50 w-5 h-5 ml-4" />
                      <Input
                        className="w-full bg-transparent p-3 pr-4 placeholder:text-foreground/40 outline-none border-none focus:ring-0"
                        id="password"
                        placeholder="••••••••"
                        type="password"
                      />
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="flex mt-4 w-full h-14 px-8 gradient-bg text-black text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary rounded-full"
                  >
                    Login
                  </Button>
                </form>
                <div className="text-center">
                  <p className="text-sm text-foreground/60">
                    Don't have an account yet?{' '}
                    <button
                      className="font-semibold gradient-text hover:text-glow transition"
                      onClick={() => setDialogOpen(true)}
                    >
                      Apply here.
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <SignupDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
