"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const brandsFaq = [
  {
    question: "How does VibeMatch ensure creator quality?",
    answer: "Our Trust Engine analyzes over 50 data points, including audience demographics, engagement rates, and past performance, to verify every creator. We ensure you connect with influencers who have genuine, engaged audiences that match your brand values.",
  },
  {
    question: "What is the pricing model for brands?",
    answer: "VibeMatch operates on a campaign-based fee structure. You only pay for the campaigns you launch. We are transparent about all costs upfront, so there are no hidden fees. Contact us for detailed pricing information tailored to your needs.",
  },
  {
    question: "Can I manage multiple campaigns at once?",
    answer: "Yes! Our dashboard is designed to help you manage multiple influencer campaigns seamlessly. You can track performance, communicate with creators, and handle payments all in one place, saving you time and effort.",
  },
];

const creatorsFaq = [
    {
        question: "How do I get paid?",
        answer: "We guarantee your payments. Once a campaign is completed and approved, funds are released to your VibeMatch account. You can then withdraw your earnings directly to your bank account. No more chasing invoices!",
    },
    {
        question: "What are the requirements to join as a creator?",
        answer: "We look for creators with an authentic connection to their audience, regardless of follower size. We evaluate engagement quality, content creativity, and niche relevance. If you create high-quality content and have a loyal community, we encourage you to apply.",
    },
    {
        question: "Is there a fee for creators to use VibeMatch?",
        answer: "Joining VibeMatch is completely free for creators. We take a small commission from the brand's payment upon successful completion of a campaign. Our goal is to empower you to monetize your influence effectively.",
    }
]

export function HomeComponent() {
    return (
        <div className="flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-280px)]">
                <div className="flex flex-col gap-6 items-center">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight">
                        Influence, Amplified by <span className="gradient-text">Trust.</span>
                    </h1>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-normal leading-relaxed max-w-4xl text-foreground/70">
                       No more fake engagement. No more late payments. VibeMatch is the Vetted-Influencer Marketplace for Morocco's best brands and creators.
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button asChild size="lg" className="min-w-[220px] h-14 px-8 gradient-bg text-black text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary rounded-full">
                            <Link href="/#brands">For Brands</Link>
                        </Button>
                         <Button asChild variant="outline" size="lg" className="min-w-[220px] h-14 px-8 text-base font-semibold tracking-wide rounded-full">
                            <Link href="/#creators">For Creators</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="py-24 md:py-32 scroll-mt-20" id="brands">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                            Stop wasting money on <span className="gradient-text text-glow">fake engagement.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                            We provide vetted creators and guaranteed results. Our revolutionary Trust Engine analyzes over 50 data points to ensure every influencer you partner with has a genuine, engaged audience. No more bots, no more vanity metrics. Just real impact.
                        </p>
                        <Button className="mt-4 w-fit h-12 px-8 gradient-bg text-black text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary rounded-full">
                            Join the Brand Waitlist
                        </Button>
                    </div>
                    <div className="w-full bg-center bg-no-repeat aspect-square bg-contain rounded-xl shadow-2xl shadow-primary/10" data-alt="A futuristic, abstract 3D visualization of a neural network or data core, glowing with bright green and cyan light, representing the Trust Engine." style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCL6eHW65DQ4ZzrQ7fwD4xQ9BJ_83WO9MTKOKkj63MiCRxED8Xs9oiGQmkBlbDk6-9I4AdheUj9VByzYxivES7BAUT073DHjlmqCDlW7-2jDo1j-_dMqqRnmWe2NVq1nMylOAF1LrZHS4MpR0ZUqSs7YMF_C_p6O09lAMp0ymY_W2LgagvN6YF8F_tNnVZcr6xD8WSF1vrjrksMqBxZt744ly_5uV1k73fXAKiT6d2O1WT8jvwHZactwDm70A8weURLti21PXJdiEaX")`}}>
                    </div>
                </div>
            </div>
            <div className="py-24 md:py-32 scroll-mt-20 bg-muted/50 dark:bg-background/50 rounded-xl" id="creators">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 px-12">
                    <div className="w-full bg-center bg-no-repeat aspect-square bg-contain rounded-xl shadow-2xl shadow-secondary/10 order-2 md:order-1" data-alt="A stylized illustration of a mobile phone showing an automated payment notification, with charts and graphs in the background, representing guaranteed payments." style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC3BWUWDOP1TY1KtnTWutXxH_m5jNXNzDWuRb3jsiE-cXlty9VKAhZVV5acYGTpJKGVKIF4HLag7g1bYC8Vb686qu2BcbSuivRtn2Oa8Uz8T9LCbrUwaycv7AOeJ0sz_NKZg7Zilhnt6ZFmXIdNvlmEz7Mn_FIY1XjIeyWHGL6-qRaHcl4Y6ZWEXEVdrYeEIxXensIGDAmfapDdj0kDlMygBkI5uSzTgXe3KF86xqiAe6rmp2Hvoy1dIv9I2esYdtrCzuwEkcQR3M3n")`}}>
                    </div>
                    <div className="flex flex-col gap-6 order-1 md:order-2">
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                            Stop chasing payments. <span className="gradient-text text-glow">We guarantee them.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                           Focus on what you do best: creating amazing content. VibeMatch handles the boring stuff. We guarantee your payments and automate your invoices, so you can build your brand with peace of mind.
                        </p>
                        <Button className="mt-4 w-fit h-12 px-8 gradient-bg text-black text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary rounded-full">
                            Apply as a Founding Creator
                        </Button>
                    </div>
                </div>
            </div>
            <div className="py-24 md:py-32">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Stop Managing Risks. <br className="hidden md:block"/> Start Managing <span className="gradient-text">Results.</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-muted/50 dark:bg-background/50 border transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                        <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-black">verified_user</span>
                        </div>
                        <h3 className="text-xl font-bold mt-2">Your Shield Against Fake Engagement</h3>
                        <p className="text-foreground/70 leading-relaxed">Stop wondering if an audience is real. Our proprietary "Trust Score" and manual vetting process eliminate creators with suspicious engagement. Every creator on VibeMatch is verified for authenticity.</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-muted/50 dark:bg-background/50 border transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                        <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-black">event_available</span>
                        </div>
                        <h3 className="text-xl font-bold mt-2">Guaranteed Deadlines, Not Excuses</h3>
                        <p className="text-foreground/70 leading-relaxed">No more "I forgot to post." Our Smart Contract locks in the exact publication dates. If a creator is late, their Trust Score gets penalized, protecting you and your campaign schedule.</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-muted/50 dark:bg-background/50 border transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                        <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-black">dashboard_customize</span>
                        </div>
                        <h3 className="text-xl font-bold mt-2">Campaign Management on Autopilot</h3>
                        <p className="text-foreground/70 leading-relaxed">Stop juggling 10 DM conversations. Manage all your collaborations, from negotiation to approval, from a single, clear, centralized dashboard. See who's late and who's submitted content at a glance.</p>
                    </div>
                </div>
            </div>
            <div className="py-24 md:py-32 bg-muted/50 dark:bg-background/50 rounded-xl">
                <div className="px-4 md:px-10 lg:px-12">
                    <div className="text-center mb-16 max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Focus on Creating. <br className="hidden md:block"/> We'll Handle the <span className="gradient-text">Rest.</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-background border transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2">
                            <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-black">payments</span>
                            </div>
                            <h3 className="text-xl font-bold mt-2">Your 100% Automated Paycheck</h3>
                            <p className="text-foreground/70 leading-relaxed">Never create an invoice again. Never follow up on a payment again. As soon as the brand approves your post, our system generates the invoice and transfers the money to you automatically. You are a creator, not an accountant.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-background border transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2">
                            <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-black">lock</span>
                            </div>
                            <h3 className="text-xl font-bold mt-2">Work with Absolute Confidence</h3>
                            <p className="text-foreground/70 leading-relaxed">Never start a project hoping to get paid again. For every mission you accept, the brand's budget is locked and secured in our escrow account. Your payment is guaranteed before you even turn on your camera.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-background border transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2">
                            <div className="w-16 h-16 rounded-lg gradient-bg flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-black">rule</span>
                            </div>
                            <h3 className="text-xl font-bold mt-2">Clear Briefs, Zero Confusion</h3>
                            <p className="text-foreground/70 leading-relaxed">Say goodbye to "details that change" at the last minute. Our Smart Contract locks in the brief, deliverables, and budget. What is agreed upon is what is delivered. Protect your work and your time.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-24 md:py-32 text-center">
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-16">
                   What <span className="gradient-text">Moroccan Creators</span> are Saying.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4 text-left p-8 rounded-xl bg-muted/50 dark:bg-background/50 border transform transition-transform hover:scale-105 hover:shadow-xl hover:shadow-primary/10">
                        <p className="text-foreground/70 leading-relaxed text-lg">"Finding brands that value authentic engagement over just follower counts was a constant struggle. VibeMatch's vetting process is a game-changer. I finally feel seen for the community I've built."</p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbiSOxKWZPKMtherRkE58oMcfVlDpjnI47Ly3EOK18_QOiADRRL0soNW2Pr795ttOe0MbNnYoCrPEymfGAtZsF7RQNC3rYPL83WtbaOrIWg_doPx37roXz39V_DXFT9Anzcyr3TVbL4Sk4EbjFQcdMepgBw552hfA-gyd2SZQ1euTssfOj7XfHF_xf-gkAnO1KRffP4QhQIqOfHoHHSvL_4BZpdJmDELyDkvni-98te1VjvBFRoEl9z1ZafkiiwueykKY2rHBgqTC-')`}}></div>
                            <div>
                                <div className="font-bold">Ghita A.</div>
                                <div className="text-sm text-foreground/70">Lifestyle Creator</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 text-left p-8 rounded-xl bg-muted/50 dark:bg-background/50 border transform transition-transform hover:scale-105 hover:shadow-xl hover:shadow-primary/10">
                        <p className="text-foreground/70 leading-relaxed text-lg">"Chasing invoices and dealing with late payments was draining my creative energy. With VibeMatch, I know I'll get paid on time, every time. It's incredibly liberating."</p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbiSOxKWZPKMtherRkE58oMcfVlDpjnI47Ly3EOK18_QOiADRRL0soNW2Pr795ttOe0MbNnYoCrPEymfGAtZsF7RQNC3rYPL83WtbaOrIWg_doPx37roXz39V_DXFT9Anzcyr3TVbL4Sk4EbjFQcdMepgBw552hfA-gyd2SZQ1euTssfOj7XfHF_xf-gkAnO1KRffP4QhQIqOfHoHHSvL_4BZpdJmDELyDkvni-98te1VjvBFRoEl9z1ZafkiiwueykKY2rHBgqTC-')`}}></div>
                            <div>
                                <div className="font-bold">Ayman F.</div>
                                <div className="text-sm text-foreground/70">Tech Reviewer</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 text-left p-8 rounded-xl bg-muted/50 dark:bg-background/50 border transform transition-transform hover:scale-105 hover:shadow-xl hover:shadow-primary/10">
                        <p className="text-foreground/70 leading-relaxed text-lg">"As a creator, it’s hard to find partners who trust your vision. VibeMatch connects me with brands that understand the value of creative freedom and authentic storytelling."</p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbiSOxKWZPKMtherRkE58oMcfVlDpjnI47Ly3EOK18_QOiADRRL0soNW2Pr795ttOe0MbNnYoCrPEymfGAtZsF7RQNC3rYPL83WtbaOrIWg_doPx37roXz39V_DXFT9Anzcyr3TVbL4Sk4EbjFQcdMepgBw552hfA-gyd2SZQ1euTssfOj7XfHF_xf-gkAnO1KRffP4QhQIqOfHoHHSvL_4BZpdJmDELyDkvni-98te1VjvBFRoEl9z1ZafkiiwueykKY2rHBgqTC-')`}}></div>
                            <div>
                                <div className="font-bold">Soukaina</div>
                                <div className="text-sm text-foreground/70">Fashion Influencer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-24 md:py-32 scroll-mt-20" id="faq">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                        Your Questions, <span className="gradient-text">Answered.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-foreground/70 mt-4 max-w-3xl mx-auto">
                        Find quick answers to common questions about how VibeMatch works for both brands and creators.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                    <div className="flex flex-col gap-6">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">For Brands</h3>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {brandsFaq.slice(0, 2).map((faq, index) => (
                              <AccordionItem value={`item-b-${index}`} key={index} className="bg-muted/50 dark:bg-background/50 border border-border/50 rounded-xl px-6 group">
                                <AccordionTrigger className="hover:no-underline text-lg font-semibold text-left">
                                  {faq.question}
                                  <span className="material-symbols-outlined text-2xl text-primary/80 group-data-[state=open]:rotate-180 transition-transform duration-300">expand_more</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-foreground/70 leading-relaxed pt-2">
                                  {faq.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">For Creators</h3>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {creatorsFaq.slice(0, 2).map((faq, index) => (
                              <AccordionItem value={`item-c-${index}`} key={index} className="bg-muted/50 dark:bg-background/50 border border-border/50 rounded-xl px-6 group">
                                <AccordionTrigger className="hover:no-underline text-lg font-semibold text-left">
                                  {faq.question}
                                  <span className="material-symbols-outlined text-2xl text-primary/80 group-data-[state=open]:rotate-180 transition-transform duration-300">expand_more</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-foreground/70 leading-relaxed pt-2">
                                  {faq.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
                 <div className="text-center mt-16">
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold tracking-wide rounded-full">
                        <Link href="/faq">View All FAQs</Link>
                    </Button>
                </div>
            </div>
            <div className="py-24 md:py-32">
                <div className="relative w-full h-[600px] rounded-xl overflow-hidden group">
                    <div className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 ease-in-out group-hover:scale-105" data-alt="A modern, professional Moroccan team collaborating in a bright, stylish office in Casablanca." style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZOIYUTPqCIfk5_QnEpLw2cQ4QWcuLjpDGSEBF1hPT3KfS3VkKyt-M4dM3ILFvklEJ8nE4ltQoFFqqo5HvP9PND1UnmqSKygJ_6CDunIlVmRvVrV79TvICFXl5lD1g5xT5Mw6k1qMHE2_pRlMHUh1o-5F5cNAiLKF7RhkBhMu39-_-MQK2Z4J96_TFEuFCixr_gNPg0ElYjgT0ClR1WW2Wivit8cITJ-tDpTM_FTocXo74pR3NhEjFxtavcxc4udMOzphUzFoenZDA")`}}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-16">
                        <h2 className="text-white text-4xl md:text-6xl font-extrabold tracking-tighter max-w-2xl">
                            Where Great Brands and Great Creators Connect.
                        </h2>
                    </div>
                </div>
            </div>
            <div className="py-16 md:py-24 text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
                        Join the <span className="gradient-text">VibeMatch</span> Waitlist.
                    </h2>
                    <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-10">
                        Be the first to experience the future of influencer marketing in Morocco.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="min-w-[220px] h-14 px-8 gradient-bg text-black text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary rounded-full">
                            Join the Brand Waitlist
                        </Button>
                        <Button variant="outline" size="lg" className="min-w-[220px] h-14 px-8 text-base font-semibold tracking-wide rounded-full">
                           Apply as a Founding Creator
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
