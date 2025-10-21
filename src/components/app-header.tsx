'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogIn } from 'lucide-react';

type Language = 'EN' | 'AR' | 'FR';

export function AppHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [language, setLanguage] = useState<Language>('EN');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('vibematch-language') as Language;
    if (savedLanguage && ['EN', 'AR', 'FR'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('vibematch-language', lang);
    // Here you would typically also trigger a language change in your i18n library
  };

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
          {(['EN', 'FR', 'AR'] as Language[]).map((lang) => (
            <Button
              key={lang}
              variant={language === lang ? 'default' : 'ghost'}
              size="sm"
              className="px-2 py-1 rounded-full h-auto text-xs font-semibold"
              onClick={() => handleLanguageChange(lang)}
            >
              {lang}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}
