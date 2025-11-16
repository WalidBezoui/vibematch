'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogIn, Menu, LogOut, LayoutDashboard, Compass, PlusCircle, Users, HelpCircle, MessageSquare } from 'lucide-react';
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
    icon: React.ComponentType<{ className?: string }>;
  };
  
  const navLinks: NavLinkItem[] = useMemo(() => {
    if (user && userProfile) {
        const commonLinks = [
            { href: "/faq", label: t('header.faq'), icon: HelpCircle },
            { href: "/contact", label: t('header.contact'), icon: MessageSquare },
        ];

        let roleSpecificLinks: NavLinkItem[] = [];

        if (userProfile.role === 'creator') {
            roleSpecificLinks = [
                 { href: "/discover", label: 'Discover', icon: Compass },
            ];
        }
        
        if (userProfile.role === 'brand') {
             roleSpecificLinks = [
                 { href: "/creators", label: 'Creators', icon: Users },
                 { href: "/campaigns/create", label: 'Create Campaign', icon: PlusCircle },
            ];
        }
        
        return [
            { href: "/dashboard", label: t('header.dashboard'), icon: LayoutDashboard },
            ...roleSpecificLinks,
            ...commonLinks
        ];

    }
    // Logged-out users
    return [
        { href: "/#brands", label: t('header.forBrands'), interest: 'brand', icon: Home },
        { href: "/#creators", label: t('header.forCreators'), interest: 'creator', icon: Home },
        { href: "/faq", label: t('header.faq'), icon: HelpCircle },
        { href: "/contact", label: t('header.contact'), icon: MessageSquare },
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

  const NavLink = ({ href, label, className, interest, icon: Icon } : NavLinkItem & { className?: string; }) => {
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary hover:bg-muted",
                isActive && "bg-muted text-primary font-semibold",
                className
            )}
            onClick={() => handleNavLinkClick(interest)}
            >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </Link>
    )
  };
  

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
          <Button onClick={handleLogout} variant="ghost" className="hidden md:flex rounded-full">
            <LogOut className="mr-2 h-4 w-4" />
            {t('header.logout')}
          </Button>
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
            <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full flex justify-center rounded-full text-lg py-6">
                <LogOut className="mr-2 h-5 w-5" />
                {t('header.logout')}
            </Button>
        )
    }

    return (
        <Button variant="outline" className="w-full flex justify-center rounded-full text-lg py-6" asChild>
            <Link href={isLoginPage ? '/' : '/login'} onClick={() => setIsMobileMenuOpen(false)}>
                {isLoginPage ? (
                    <>
                        <Home className="mr-2 h-5 w-5" />
                        {t('header.home')}
                    </>
                ) : (
                    <>
                        <LogIn className="mr-2 h-5 w-5" />
                        {t('header.login')}
                    </>
                )}
            </Link>
        </Button>
    )
  }

  return (
    <header className="px-4 md:px-6 lg:px-8 flex justify-between items-center py-3 backdrop-blur-md sticky top-0 z-50 bg-background/80 border-b">
      <Link
        href="/"
        className="text-3xl font-bold tracking-tight gradient-text"
      >
        VibeMatch
      </Link>

      <nav className="hidden md:flex gap-1 items-center">
        {navLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <LanguageSwitcher className="hidden sm:flex" />
        {renderAuthButtons()}
        <div className='flex items-center gap-2 md:hidden'>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

       <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side={dir === 'rtl' ? 'left' : 'right'} className="w-[85vw] bg-background">
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
            
            <nav className="flex flex-col gap-2 items-stretch">
              {navLinks.map((link) => (
                 <NavLink 
                    key={link.href} 
                    {...link} 
                    className="text-lg justify-start py-3 px-4"
                 />
              ))}
            </nav>

            <div className="mt-auto space-y-4">
               <LanguageSwitcher className="w-full justify-center" />
               {renderMobileAuthButtons()}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
