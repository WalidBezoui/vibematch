'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogIn, Menu, LogOut, LayoutDashboard, Compass, PlusCircle, List } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useUser, useUserProfile } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const { language, setLanguage, t, dir, setUserInterest } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  type NavLinkItem = {
    href: string;
    label: string;
    interest?: 'brand' | 'creator';
    role?: 'creator' | 'brand';
    icon?: React.ComponentType<{ className?: string }>;
  };
  
  const navLinks: NavLinkItem[] = useMemo(() => {
    if (user && userProfile) {
        const commonLinks = [
            { href: "/faq", label: t('header.faq') },
            { href: "/contact", label: t('header.contact') },
        ];

        if (userProfile.role === 'creator') {
            return [
                 { href: "/discover", label: 'Discover', role: 'creator' as const, icon: Compass },
                ...commonLinks,
            ];
        }
        
        if (userProfile.role === 'brand') {
             return [
                 { href: "/dashboard", label: 'My Campaigns', role: 'brand' as const, icon: List },
                 { href: "/campaigns/create", label: 'Create Campaign', role: 'brand' as const, icon: PlusCircle },
                ...commonLinks,
            ];
        }
        return commonLinks;

    }
    return [
        { href: "/#brands", label: t('header.forBrands'), interest: 'brand' },
        { href: "/#creators", label: t('header.forCreators'), interest: 'creator' },
        { href: "/faq", label: t('header.faq') },
        { href: "/contact", label: t('header.contact') },
    ];
  }, [t, user, userProfile]);

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
    if (isUserLoading || isProfileLoading) {
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
          <Button key={link.href} variant="ghost" className="rounded-full" asChild>
            <Link href={link.href}>
              {link.icon && <link.icon className="mr-2 h-4 w-4" />}
              {link.label}
            </Link>
          </Button>
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
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.icon && <link.icon className="h-5 w-5" />}
                  {link.label}
                </Link>
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
