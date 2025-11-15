'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where } from 'firebase/firestore';
import { AppHeader } from '@/components/app-header';
import BrandDashboard from '@/components/dashboards/brand-dashboard';
import CreatorDashboard from '@/components/dashboards/creator-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/language-context';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const { userInterest } = useLanguage();

  useEffect(() => {
    // If auth is done loading and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (user && firestore) {
      const fetchUserRole = async () => {
        setIsLoadingRole(true);
        const userDocRef = doc(firestore, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            // User exists in Auth, but not in Firestore. This can happen if
            // the profile creation failed after signup.
            // We redirect them to the appropriate signup page to create their profile.
            if (userInterest === 'brand') {
                router.push('/signup/brand');
            } else if (userInterest === 'creator') {
                router.push('/signup/creator');
            } else {
                // Fallback if no interest is set
                router.push('/login');
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        } finally {
          setIsLoadingRole(false);
        }
      };
      fetchUserRole();
    }
  }, [user, firestore, router, userInterest]);

  const isLoading = isUserLoading || isLoadingRole;
  
  if (isLoading) {
    return (
        <div>
            <AppHeader />
            <div className="p-8">
                <Skeleton className="h-10 w-1/3 mb-8" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div>
      <AppHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        {userRole === 'brand' && <BrandDashboard />}
        {userRole === 'creator' && <CreatorDashboard />}
        {!userRole && !isLoading && (
            <div className="text-center py-10">
                <p>Could not determine user role. Please try again later.</p>
            </div>
        )}
      </main>
    </div>
  );
}
