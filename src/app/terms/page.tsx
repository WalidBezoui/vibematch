'use client';
import { AppHeader } from '@/components/app-header';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="flex h-auto w-full flex-col">
        <AppHeader />
        <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
            <div className="max-w-4xl mx-auto bg-background/80 dark:bg-background/80 backdrop-blur-xl border rounded-2xl p-8 md:p-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight gradient-text">
                        Terms and Agreements
                    </h1>
                    <p className="mt-2 text-md text-foreground/60">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                    <p>
                        Welcome to VibeMatch! These Terms and Agreements ("Terms") govern your use of the VibeMatch platform ("Platform"), a premier marketplace connecting brands ("Brands") and content creators ("Creators") in Morocco. By accessing or using our Platform, you agree to be bound by these Terms and our Privacy Policy.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">1. The VibeMatch Platform</h2>
                    <p>
                        VibeMatch provides a suite of tools and services, including influencer discovery, aesthetic matching, campaign management, secure payments through an escrow system, and a proprietary "Trust Engine" to ensure authentic engagement.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">2. Eligibility and Account Registration</h2>
                    <p>
                        You must be at least 18 years old to use the Platform. By creating an account, you represent that you have the legal capacity to enter into a binding contract. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">3. Obligations for All Users</h2>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>You will not use the Platform for any illegal or unauthorized purpose.</li>
                        <li>You are responsible for all activity that occurs under your account.</li>
                        <li>You will not engage in any activity that interferes with or disrupts the Platform.</li>
                        <li>You will not use any automated system, including "bots," to access or use the Platform.</li>
                    </ul>

                    <h2 className="text-2xl font-bold pt-6">4. Specific Terms for Creators</h2>
                    <div className="space-y-4 p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
                        <h3 className="text-xl font-semibold">The Professionalism Pledge</h3>
                        <p>
                            By applying to be a Creator on VibeMatch, you make a binding commitment to professionalism. This includes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><b>Commitment to Deadlines:</b> You agree to adhere strictly to all campaign timelines and publication dates mutually agreed upon with Brands. Failure to meet deadlines without prior written consent from the Brand may result in penalties, including a reduction in your "Trust Score" or suspension from the Platform.</li>
                            <li><b>Zero-Tolerance for Fake Engagement:</b> You warrant that your social media accounts are free from fake followers, purchased likes, bot-driven comments, or any other form of inauthentic engagement. Our Trust Engine continuously monitors for such activity. Any detection of fake engagement will result in immediate review, potential removal from active campaigns without pay, and permanent suspension from the Platform.</li>
                        </ul>
                    </div>
                    <p className="mt-4">
                        You retain ownership of the content you create. However, by accepting a campaign, you grant the Brand a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, reproduce, modify, and display the content for the purposes outlined in the campaign agreement.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">5. Specific Terms for Brands</h2>
                    <p>
                        You are responsible for creating clear and comprehensive campaign briefs. Budgets for all campaigns must be fully funded into our secure escrow system before a Creator begins work. Funds are only released to the Creator upon your approval of the submitted deliverables, or automatically upon the deadline if no action is taken.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">6. Payments and Fees</h2>
                    <p>
                        VibeMatch facilitates payments through a secure escrow service. We charge a service fee on each transaction, which will be clearly disclosed before you commit to a campaign. All payments are final and non-refundable once funds have been released from escrow.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">7. Dispute Resolution</h2>
                    <p>
                        In the event of a dispute, VibeMatch provides a mediation process. We will review the campaign agreement, communication records, and submitted content to facilitate a fair resolution. Our decision in any dispute will be final and binding.
                    </p>
                    
                    <h2 className="text-2xl font-bold pt-6">8. Termination</h2>
                    <p>
                        We may terminate or suspend your access to the Platform immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Platform will cease immediately.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">9. Disclaimer and Limitation of Liability</h2>
                    <p>
                        The Platform is provided "as is" without warranty of any kind. VibeMatch does not guarantee specific campaign results. In no event shall VibeMatch be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, or other intangible losses.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">10. Governing Law</h2>
                    <p>
                        These Terms shall be governed by the laws of the Kingdom of Morocco, without regard to its conflict of law provisions.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">11. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
                    </p>
                </div>
            </div>
        </main>

        <footer className="px-4 md:px-10 lg:px-20 py-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-foreground/60">
              © {new Date().getFullYear()} VibeMatch. Built in Casablanca for Morocco.
            </p>
            <div className="flex gap-6">
              <Link
                className="text-sm text-foreground/60 hover:text-primary"
                href="/terms"
              >
                Terms of Service
              </Link>
              <Link
                className="text-sm text-foreground/60 hover:text-primary"
                href="#"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
    </div>
  );
}
