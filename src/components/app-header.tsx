
'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogIn, Menu, LogOut, LayoutDashboard, Compass, PlusCircle, Users, HelpCircle, MessageSquare, X, Building, User, FileText } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { useUser, useUserProfile } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

type NavLinkItem = {
  href: string;
  label: string;
  isSection?: boolean;
  interest?: 'brand' | 'creator';
  icon: React.ComponentType<{ className?: string }>;
};

const LanguageSwitcher = ({className}: {className?: string}) => {
    const { language, setLanguage } = useLanguage();
    
    return (
      <div className={cn("flex items-center gap-1 border rounded-full p-1 text-sm bg-background/50", className)}>
        {(['EN', 'FR', 'AR'] as const).map((lang) => (
          <Button
            key={lang}
            variant='ghost'
            size="sm"
            className={cn(
              "px-3 py-1 rounded-full h-auto text-xs font-semibold transition-all duration-300",
              language === lang ? "gradient-bg text-black shadow-sm" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
            onClick={() => setLanguage(lang)}
          >
            {lang}
          </Button>
        ))}
      </div>
    );
};

const DesktopNav = ({ navLinks, onLinkClick }: { navLinks: NavLinkItem[], onLinkClick: (interest?: 'brand' | 'creator') => void }) => {
    const pathname = usePathname();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
        if (href.startsWith('/#')) {
            e.preventDefault();
            const targetId = href.substring(2);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
    
    if (!navLinks) {
        return (
            <nav className="hidden md:flex gap-1 items-center bg-muted/50 border rounded-full p-1">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
            </nav>
        );
    }

    return (
        <nav className="hidden md:flex gap-1 items-center bg-muted/50 border rounded-full p-1">
            {navLinks.map((link) => {
                 const isActive = pathname === link.href && !link.isSection;
                 return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => {
                            if(pathname === '/') handleScroll(e, link.href);
                            onLinkClick(link.interest);
                        }}
                        className={cn(
                            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                            isActive ? "bg-background text-primary shadow-sm" : "text-foreground/60 hover:text-foreground/80"
                        )}
                        >
                        <link.icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                        <span>{link.label}</span>
                    </Link>
                 )
            })}
      </nav>
    )
}

const MobileNav = ({ isOpen, navLinks, onLinkClick, onClose, onLogout, isLoading }: { isOpen: boolean, navLinks: NavLinkItem[], onLinkClick: (interest?: 'brand' | 'creator') => void, onClose: () => void, onLogout: () => void, isLoading: boolean }) => {
    const { user, isUserLoading } = useUser();
    const { t } = useLanguage();
    const pathname = usePathname();

    if (!isOpen) return null;

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => {
        if(pathname === '/' && link.href.startsWith('/#')) {
            e.preventDefault();
            const targetId = link.href.substring(2);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
        onLinkClick(link.interest);
        onClose();
    }
    
    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col p-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-12">
                 <Link href="/" className="text-3xl font-bold tracking-tight gradient-text" onClick={onClose}>
                    VibeMatch
                </Link>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                    <X className="h-6 w-6"/>
                </Button>
            </div>
            
            <nav className="flex flex-col gap-4">
                 {isLoading ? (
                     <>
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                     </>
                 ) : navLinks.map((link) => {
                    const isActive = pathname === link.href && !link.isSection;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link)}
                            className={cn(
                                "flex items-center gap-4 rounded-lg p-4 text-xl font-semibold transition-colors duration-300",
                                isActive ? "bg-muted text-primary" : "text-foreground/80 hover:bg-muted"
                            )}
                        >
                            <link.icon className="h-6 w-6" />
                            <span>{link.label}</span>
                        </Link>
                    )
                 })}
            </nav>

            <div className="mt-auto space-y-6">
                <LanguageSwitcher className="w-full justify-center p-1.5 h-auto" />
                {isUserLoading ? (
                    <Skeleton className="h-14 w-full rounded-full" />
                ) : user ? (
                    <Button onClick={onLogout} variant="outline" size="lg" className="w-full rounded-full text-lg h-14">
                        <LogOut className="mr-2 h-5 w-5" />
                        {t('header.logout')}
                    </Button>
                ) : (
                    <Button asChild size="lg" className="w-full rounded-full text-lg h-14 gradient-bg text-black font-bold">
                        <Link href="/login" onClick={onClose}>
                            <LogIn className="mr-2 h-5 w-5" />
                            {t('header.login')}
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    )
}

const AuthButtons = ({ onLogout }: { onLogout: () => void }) => {
    const { user, isUserLoading } = useUser();
    const { userProfile, isLoading: isProfileLoading } = useUserProfile();
    const { t } = useLanguage();

    if (isUserLoading || (user && isProfileLoading)) {
      return (
        <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full hidden md:block" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex items-center gap-2">
            <Link href="/profile">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={userProfile?.photoURL || userProfile?.logoUrl} alt={userProfile?.name} />
                    <AvatarFallback>
                        {userProfile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </Link>
            <Button onClick={onLogout} variant="ghost" size="icon" className="hidden md:flex rounded-full">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">{t('header.logout')}</span>
            </Button>
        </div>
      );
    }

    return (
      <Button variant="outline" className="hidden md:flex rounded-full" asChild>
        <Link href='/login'>
            <LogIn className="mr-2 h-4 w-4" />
            {t('header.login')}
        </Link>
      </Button>
    );
};

export function AppHeader() {
  const router = useRouter();
  const { t, setUserInterest } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const pathname = usePathname();

  const isLoading = isUserLoading || (user && isProfileLoading);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
        document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const navLinks: NavLinkItem[] = useMemo(() => {
    const isHomePage = pathname === '/';
    
    const loggedOutLinks: NavLinkItem[] = [
        { href: isHomePage ? "/#brands" : "/#brands", label: t('header.forBrands'), interest: 'brand', icon: Building, isSection: true },
        { href: isHomePage ? "/#creators" : "/#creators", label: t('header.forCreators'), interest: 'creator', icon: Users, isSection: true },
        { href: "/faq", label: t('header.faq'), icon: HelpCircle },
        { href: "/contact", label: t('header.support'), icon: MessageSquare },
    ];

    if (isLoading) {
      return [];
    }

    if (user && userProfile) {
        const commonLinks = [
            { href: "/profile", label: 'My Profile', icon: User },
            { href: "/contact", label: t('header.support'), icon: MessageSquare },
        ];

        let roleSpecificLinks: NavLinkItem[] = [];

        if (userProfile.role === 'creator') {
            roleSpecificLinks = [
                 { href: "/discover", label: 'Discover', icon: Compass },
                 { href: "/chat", label: 'Messages', icon: MessageSquare },
            ];
        }
        
        if (userProfile.role === 'brand') {
             roleSpecificLinks = [
                 { href: "/creators", label: 'Creators', icon: Users },
                 { href: "/chat", label: 'Messages', icon: MessageSquare },
            ];
        }
        
        return [
            { href: "/dashboard", label: t('header.dashboard'), icon: LayoutDashboard },
            ...roleSpecificLinks,
            ...commonLinks
        ];

    }

    return loggedOutLinks;

  }, [t, user, userProfile, isLoading, pathname]);

  const handleNavLinkClick = (interest?: 'brand' | 'creator') => {
    if (interest) {
      setUserInterest(interest);
    }
  }

  return (
    <>
        <header className="px-4 md:px-6 lg:px-8 flex justify-between items-center py-3 backdrop-blur-md sticky top-0 z-40 bg-background/80 border-b">
        <Link
            href="/"
            className="text-3xl font-bold tracking-tight gradient-text"
        >
            VibeMatch
        </Link>

        <DesktopNav navLinks={navLinks} onLinkClick={handleNavLinkClick} />

        <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:flex" />
            <AuthButtons onLogout={handleLogout} />
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
        </header>

        <MobileNav 
            isOpen={isMobileMenuOpen}
            navLinks={navLinks}
            onLinkClick={handleNavLinkClick}
            onClose={() => setIsMobileMenuOpen(false)}
            onLogout={handleLogout}
            isLoading={isLoading}
        />
    </>
  );
}
