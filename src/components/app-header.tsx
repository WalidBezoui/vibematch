'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogIn, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';


export function AppHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = useMemo(() => [
    { href: "/#brands", label: t('header.forBrands') },
    { href: "/#creators", label: t('header.forCreators') },
    { href: "/faq", label: t('header.faq') },
    { href: "/contact", label: t('header.contact') },
  ], [t]);

  const handleLanguageChange = (lang: 'EN' | 'FR' | 'AR') => {
    setLanguage(lang);
  };

  const NavLink = ({ href, label, className } : { href: string; label: string, className?: string; }) => (
    <Link
      href={href}
      className={cn("text-sm font-medium text-foreground/70 hover:text-primary transition-colors", className)}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <header className="px-4 md:px-10 lg:px-20 flex justify-between items-center py-4 backdrop-blur-md sticky top-0 z-50 bg-background/80 border-b">
      <Link
        href="/"
        className="text-3xl font-bold tracking-tight gradient-text"
      >
        VibeMatch
      </Link>

      <nav className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 border rounded-full p-1 text-sm">
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
        <Button variant="outline" className="hidden md:flex rounded-full" asChild>
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
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

       <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-[80vw] bg-background">
          <div className="flex flex-col h-full">
            <div className='flex justify-between items-center mb-8'>
               <Link
                href="/"
                className="text-3xl font-bold tracking-tight gradient-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                VibeMatch
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            
            <nav className="flex flex-col gap-6 items-start">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} className="text-lg" />
              ))}
            </nav>

            <div className="mt-auto space-y-4">
              <Button variant="outline" className="w-full flex rounded-full" asChild>
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
              <div className="flex sm:hidden items-center gap-1 border rounded-full p-1 text-sm w-full">
                {(['EN', 'FR', 'AR'] as const).map((lang) => (
                  <Button
                    key={lang}
                    variant={language === lang ? 'default' : 'ghost'}
                    size="sm"
                    className="flex-1 px-2 py-1 rounded-full h-auto text-xs font-semibold"
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
