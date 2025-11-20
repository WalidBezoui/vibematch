'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider, useUser, useUserProfile } from '@/firebase';
import { ProfileCompletionBanner } from '@/components/profile-completion-banner';

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  
  const showCompletionBanner = user && !isUserLoading && userProfile && !isProfileLoading && userProfile.role === 'creator';

  return (
    <>
      {children}
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <LanguageProvider>
        <FirebaseClientProvider>
          <body
            className={`bg-background text-foreground/90 antialiased selection:bg-primary/20`}
          >
            <AppContent>
              {children}
            </AppContent>
            <Toaster />
          </body>
        </FirebaseClientProvider>
      </LanguageProvider>
    </html>
  );
}
