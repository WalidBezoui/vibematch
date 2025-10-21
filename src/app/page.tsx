import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeComponent } from '@/components/home';
import { AppHeader } from '@/components/app-header';

export default function Home() {
  return (
    <div className="flex h-auto w-full flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <AppHeader />

        <main className="px-4 md:px-10 lg:px-20 py-10 md:py-20 hero-bg">
          <div className="max-w-[1200px] mx-auto flex-1">
            <HomeComponent />
          </div>
        </main>
        
        <footer className="px-4 md:px-10 lg:px-20 py-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-foreground/60">© 2024 VibeMatch. Built in Casablanca for Morocco.</p>
            <div className="flex gap-6">
              <Link className="text-sm text-foreground/60 hover:text-primary" href="#">Terms of Service</Link>
              <Link className="text-sm text-foreground/60 hover:text-primary" href="#">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
