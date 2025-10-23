'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogIn } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function AppHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const { language, setLanguage, t } = useLanguage();

  const navLinks = useMemo(() => [
    { href: "/#brands", label: t('header.forBrands') },
    { href: "/#creators", label: t('header.forCreators') },
    { href: "/faq", label: t('header.faq') },
    { href: "/contact", label: t('header.contact') },
  ], [t]);

  const handleLanguageChange = (lang: 'EN' | 'FR' | 'AR') => {
    setLanguage(lang);
  };

  return (
    <header className="px-4 md:px-10 lg:px-20 flex justify-between items-center py-6 backdrop-blur-md sticky top-0 z-50 bg-background/80 border-b">
      <Link
        href="/"
        className="text-3xl font-bold tracking-tight gradient-text"
      >
        Vibe<span className="font-logo">Match</span>
      </Link>
      <nav className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => (
            <Link
            key={link.href}
            className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            href={link.href}
            >
            {link.label}
            </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="rounded-full" asChild>
          <Link href={isLoginPage ? '/' : '/login'}>
            {isLoginPage ? (
              <>
                <Home className="mr-2 h-4 w-4" />
                {t('header.home')}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {t('header.login')}
              </>
            )}
          </Link>
        </Button>
        <div className="flex items-center gap-1 border rounded-full p-1 text-sm">
          {(['EN', 'FR', 'AR'] as const).map((lang) => (
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
