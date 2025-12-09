
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { FirebaseProvider } from '@/firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LanguageProvider } from '@/context/language-context';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

const firebaseConfig = {
  apiKey: 'test',
  authDomain: 'test',
  projectId: 'test',
  storageBucket: 'test',
  messagingSenderId: 'test',
  appId: 'test',
};

const mockFirebaseApp = initializeApp(firebaseConfig);
const mockFirestore = getFirestore(mockFirebaseApp);
const mockAuth = getAuth(mockFirebaseApp);

// Create a mock for the useToast hook
const mockUseToast = {
  toasts: [],
  toast: vi.fn(),
  dismiss: vi.fn(),
};

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => mockUseToast,
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <LanguageProvider>
      <FirebaseProvider
        firebaseApp={mockFirebaseApp}
        firestore={mockFirestore}
        auth={mockAuth}
      >
        {children}
        <Toaster />
      </FirebaseProvider>
    </LanguageProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render, mockUseToast };
