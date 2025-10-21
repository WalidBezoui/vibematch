import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/faq";
import { AppHeader } from "@/components/app-header";

export default function FaqPage() {
  return (
    <div className="flex h-auto w-full flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <AppHeader />

        <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 md:mb-24">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight font-headline">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-foreground/60">
                Have a question? We're here to help. Explore our FAQ to find answers to common questions about VibeMatch.
              </p>
            </div>
            
            <FaqSection />

            <div className="mt-24 md:mt-32 text-center bg-muted/50 dark:bg-background/50 rounded-xl p-10 md:p-16">
              <div className="max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 font-headline">
                  Still have questions?
                </h2>
                <p className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-8">
                  Our team is here to help. Reach out to us and we'll get back to you as soon as possible.
                </p>
                <Button className="min-w-[180px] max-w-[480px] h-12 px-8 gradient-bg text-black text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary rounded-full">
                  Contact Support
                </Button>
              </div>
            </div>
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
