
'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogIn, Menu, LogOut, LayoutDashboard, Compass, Users, LifeBuoy, MessageSquare, X, Building, User, FileText, Settings, Inbox, Bell } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { useUser, useUserProfile, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { query, collection, where, getCountFromServer } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

const DesktopNav = ({ navLinks, onLinkClick, unreadMessages, newApplications }: { navLinks: NavLinkItem[], onLinkClick: (interest?: 'brand' | 'creator') => void, unreadMessages: number, newApplications: number }) => {
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
                 const isActive = (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))) && !link.isSection;
                 const isMessages = link.href === '/chat';
                 const isNotifications = link.href === '/notifications';

                 return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => {
                            if(pathname === '/') handleScroll(e, link.href);
                            onLinkClick(link.interest);
                        }}
                        className={cn(
                            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 relative",
                            isActive ? "bg-background text-primary shadow-sm" : "text-foreground/60 hover:text-foreground/80"
                        )}
                        >
                        <link.icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                        <span>{link.label}</span>
                         {isMessages && unreadMessages > 0 && (
                            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        )}
                         {isNotifications && newApplications > 0 && (
                             <span className="ml-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                {newApplications}
                             </span>
                        )}
                    </Link>
                 )
            })}
      </nav>
    )
}

const MobileNav = ({ isOpen, navLinks, onLinkClick, onClose, onLogout, isLoading, unreadMessages, newApplications }: { isOpen: boolean, navLinks: NavLinkItem[], onLinkClick: (interest?: 'brand' | 'creator') => void, onClose: () => void, onLogout: () => void, isLoading: boolean, unreadMessages: number, newApplications: number }) => {
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
                    const isActive = (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))) && !link.isSection;
                    const isMessages = link.href === '/chat';
                    const isNotifications = link.href === '/notifications';

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link)}
                            className={cn(
                                "flex items-center justify-between rounded-lg p-4 text-xl font-semibold transition-colors duration-300 relative",
                                isActive ? "bg-muted text-primary" : "text-foreground/80 hover:bg-muted"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <link.icon className="h-6 w-6" />
                                <span>{link.label}</span>
                            </div>
                            
                            {isMessages && unreadMessages > 0 && (
                               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            )}
                             {isNotifications && newApplications > 0 && (
                               <span className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                    {newApplications}
                                </span>
                            )}
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
        </div>
      );
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={userProfile?.photoURL || userProfile?.logoUrl} alt={userProfile?.name} />
              <AvatarFallback>
                {userProfile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('header.myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile"><User className="mr-2 h-4 w-4" />{t('header.profile')}</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href="/settings"><Settings className="mr-2 h-4 w-4" />{t('header.settings')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />{t('header.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
  const firestore = useFirestore();
  const [newApplications, setNewApplications] = useState(0);

  const conversationsQuery = useMemoFirebase(() => {
    if (!user || !firestore || !userProfile) return null;
    const field = userProfile.role === 'brand' ? 'brand_id' : 'creator_id';
    return query(collection(firestore, 'conversations'), where(field, '==', user.uid));
  }, [user, firestore, userProfile]);

  const { data: conversations } = useCollection(conversationsQuery);
  
  const unreadMessages = useMemo(() => {
      if (!conversations || !user) return 0;
      return conversations.filter(c => c.status === 'NEGOTIATION' && c.last_offer_by !== user.uid).length;
  }, [conversations, user]);
  
  const brandOpenCampaignsQuery = useMemoFirebase(() => {
      if (!user || !firestore || userProfile?.role !== 'brand') return null;
      return query(
          collection(firestore, 'campaigns'), 
          where('brandId', '==', user.uid),
          where('status', '==', 'OPEN_FOR_APPLICATIONS')
      );
  }, [user, firestore, userProfile]);
  const { data: brandOpenCampaigns } = useCollection(brandOpenCampaignsQuery);

  useEffect(() => {
    if (brandOpenCampaigns && firestore && userProfile?.role === 'brand') {
      const fetchNewApplicationCount = async () => {
        if(brandOpenCampaigns.length === 0) {
            setNewApplications(0);
            return;
        }
        
        let total = 0;
        for (const campaign of brandOpenCampaigns) {
            const q = query(collection(firestore, 'campaigns', campaign.id, 'applications'), where('status', '==', 'APPLIED'));
            const snapshot = await getCountFromServer(q);
            total += snapshot.data().count;
        }
        setNewApplications(total);
      };
      fetchNewApplicationCount();
    }
  }, [brandOpenCampaigns, firestore, userProfile?.role]);

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
        { href: "/faq", label: t('header.faq'), icon: LifeBuoy },
        { href: "/contact", label: t('header.support'), icon: MessageSquare },
    ];

    if (isLoading) {
      return [];
    }

    if (user && userProfile) {
        const commonLinks = [
            { href: "/contact", label: t('header.support'), icon: LifeBuoy },
        ];

        let roleSpecificLinks: NavLinkItem[] = [];

        if (userProfile.role === 'creator') {
            roleSpecificLinks = [
                 { href: "/discover", label: t('header.discover'), icon: Compass },
                 { href: "/notifications", label: t('header.notifications'), icon: Bell },
                 { href: "/chat", label: t('header.messages'), icon: MessageSquare },
            ];
        }
        
        if (userProfile.role === 'brand') {
             roleSpecificLinks = [
                 { href: "/creators", label: t('header.creators'), icon: Users },
                 { href: "/notifications", label: t('header.notifications'), icon: Bell },
                 { href: "/chat", label: t('header.messages'), icon: MessageSquare },
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

        <DesktopNav navLinks={navLinks} onLinkClick={handleNavLinkClick} unreadMessages={unreadMessages} newApplications={newApplications} />

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
            unreadMessages={unreadMessages}
            newApplications={newApplications}
        />
    </>
  );
}
