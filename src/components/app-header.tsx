'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogIn, Menu, LogOut, LayoutDashboard, Compass } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const { language, setLanguage, t, dir, setUserInterest } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  type NavLinkItem = {
    href: string;
    label: string;
    interest?: 'brand' | 'creator';
    role?: 'creator';
  };
  
  const navLinks: NavLinkItem[] = useMemo(() => {
    if (user) {
        const commonLinks = [
            { href: "/faq", label: t('header.faq') },
            { href: "/contact", label: t('header.contact') },
        ];
        // Assuming user role can be determined from the user object or another context
        // For now, let's just show a creator-specific link as an example
        const creatorLinks = [
            { href: "/discover", label: 'Discover', role: 'creator' as const },
        ];

        // A real app would have role-based logic here
        // For this example, let's check a hypothetical role property on the user object
        // const userRole = 'creator'; // Replace with actual user role logic
        // if (userRole === 'creator') {
            return [...creatorLinks, ...commonLinks];
        // }
        
        // return commonLinks;
    }
    return [
        { href: "/#brands", label: t('header.forBrands'), interest: 'brand' },
        { href: "/#creators", label: t('header.forCreators'), interest: 'creator' },
        { href: "/faq", label: t('header.faq') },
        { href: "/contact", label: t('header.contact') },
    ];
  }, [t, user]);

  const handleLanguageChange = (lang: 'EN' | 'FR' | 'AR') => {
    setLanguage(lang);
  };

  const handleNavLinkClick = (interest?: 'brand' | 'creator') => {
    if (interest) {
      setUserInterest(interest);
    }
    setIsMobileMenuOpen(false);
  }

  const NavLink = ({ href, label, className, interest } : NavLinkItem & { className?: string; }) => (
    <Link
      href={href}
      className={cn("text-sm font-medium text-foreground/70 hover:text-primary transition-colors", className)}
      onClick={() => handleNavLinkClick(interest)}
    >
      {label}
    </Link>
  );

  const LanguageSwitcher = ({className}: {className?: string}) => (
    <div className={cn("flex items-center gap-1 border rounded-full p-1 text-sm", className)}>
      {(['EN', 'FR', 'AR'] as const).map((lang) => (
        <Button
          key={lang}
          variant={language === lang ? 'default' : 'ghost'}
          size="sm"
          className={cn(
            "px-2 py-1 rounded-full h-auto text-xs font-semibold",
            language === lang && "gradient-bg text-black",
          )}
          onClick={() => handleLanguageChange(lang)}
        >
          {lang}
        </Button>
      ))}
    </div>
  );

  const renderAuthButtons = () => {
    if (isUserLoading) {
      return <div className="h-10 w-24 bg-muted rounded-full animate-pulse"></div>;
    }

    if (user) {
      return (
        <>
          <Button variant="outline" className="hidden md:flex rounded-full" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t('header.dashboard')}
            </Link>
          </Button>
          <Button onClick={handleLogout} variant="ghost" className="hidden md:flex rounded-full">
            <LogOut className="mr-2 h-4 w-4" />
            {t('header.logout')}
          </Button>
        </>
      );
    }

    return (
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
    );
  };
  
  const renderMobileAuthButtons = () => {
    if (isUserLoading) {
        return <div className="h-10 w-full bg-muted rounded-full animate-pulse"></div>
    }

    if (user) {
        return (
            <>
                <Button variant="outline" className="w-full flex rounded-full" asChild>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t('header.dashboard')}
                    </Link>
                </Button>
                <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="ghost" className="w-full flex rounded-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('header.logout')}
                </Button>
            </>
        )
    }

    return (
        <Button variant="outline" className="w-full flex rounded-full" asChild>
            <Link href={isLoginPage ? '/' : '/login'} onClick={() => setIsMobileMenuOpen(false)}>
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
    )
  }

  // A simple way to check if a user is a creator
  // In a real app, this might come from a context or a hook like `useUserRole()`
  // For now, we'll just check if the "Discover" link is present to show the icon
  const isCreator = navLinks.some(link => link.href === '/discover');

  return (
    <header className="px-4 md:px-10 lg:px-20 flex justify-between items-center py-4 backdrop-blur-md sticky top-0 z-50 bg-background/80 border-b">
      <Link
        href="/"
        className="text-3xl font-bold tracking-tight gradient-text"
      >
        VibeMatch
      </Link>

      <nav className="hidden md:flex gap-8 items-center">
        {user && isCreator && (
             <Button variant="ghost" className="rounded-full" asChild>
                <Link href="/discover">
                    <Compass className="mr-2 h-4 w-4" />
                    Discover Campaigns
                </Link>
            </Button>
        )}
        {navLinks.filter(l => l.href !== '/discover').map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <LanguageSwitcher className="hidden sm:flex" />
        {renderAuthButtons()}
        <div className='flex items-center gap-2 md:hidden'>
          <LanguageSwitcher />
          <Button 
            variant="ghost" 
            size="icon" 
            className="-mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

       <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side={dir === 'rtl' ? 'left' : 'right'} className="w-[80vw] bg-background">
          <SheetHeader className="text-left rtl:text-right sr-only">
             <SheetTitle>Menu</SheetTitle>
             <SheetDescription>Main navigation</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <div className='flex justify-between items-center mb-8'>
               <Link
                href="/"
                className="text-3xl font-bold tracking-tight gradient-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                VibeMatch
              </Link>
            </div>
            
            <nav className="flex flex-col gap-6 items-start">
              {user && isCreator && (
                  <Link href="/discover" className="text-lg font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <Compass className="h-5 w-5" />
                      Discover Campaigns
                  </Link>
              )}
              {navLinks.filter(l => l.href !== '/discover').map((link) => (
                <NavLink key={link.href} {...link} className="text-lg" />
              ))}
            </nav>

            <div className="mt-auto space-y-4">
              {renderMobileAuthButtons()}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
