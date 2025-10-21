'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogIn } from 'lucide-react';

export function AppHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <header className="px-4 md:px-10 lg:px-20 flex justify-between items-center py-6 backdrop-blur-md sticky top-0 z-50 bg-background/80 border-b">
      <Link
        href="/"
        className="text-3xl font-bold tracking-tight gradient-text"
      >
        VibeMatch
      </Link>
      <nav className="hidden md:flex gap-8 items-center">
        <Link
          className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          href="/#brands"
        >
          For Brands
        </Link>
        <Link
          className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          href="/#creators"
        >
          For Creators
        </Link>
        <Link
          className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          href="/faq"
        >
          FAQ
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="rounded-full" asChild>
          <Link href={isLoginPage ? '/' : '/login'}>
            {isLoginPage ? (
              <>
                <Home className="mr-2 h-4 w-4" />
                Home
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Link>
        </Button>
        <div className="flex items-center gap-1 border rounded-full p-1 text-sm">
          <Button
            variant="default"
            size="sm"
            className="px-2 py-1 rounded-full h-auto text-black font-semibold text-xs"
          >
            EN
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-2 py-1 rounded-full h-auto text-xs"
          >
            AR
          </Button>
        </div>
      </div>
    </header>
  );
}
