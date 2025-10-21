"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const brandsFaq = [
  {
    question: "What is VibeMatch's Trust Engine?",
    answer: "Our Trust Engine is a proprietary system that analyzes over 50 data points to vet influencers. It checks for fake followers, bot activity, and engagement authenticity to ensure you connect with creators who have a genuine and engaged audience, maximizing your campaign's ROI.",
  },
  {
    question: "How do I find influencers for my campaign?",
    answer: "VibeMatch offers advanced search and filtering tools. You can search for influencers based on niche, audience demographics, engagement rates, location, and more. Our platform will recommend the best matches for your brand based on your campaign goals and our Trust Engine data.",
  },
  {
    question: "How are payments handled on the platform?",
    answer: "Payments are held securely in escrow by VibeMatch. You fund the campaign upon agreement, and we release the payment to the creator only after you have approved the content and campaign deliverables have been met. This protects both parties and ensures a smooth collaboration.",
  },
];

const creatorsFaq = [
    {
        question: "How do I join VibeMatch as a creator?",
        answer: "To maintain a high-quality network, VibeMatch is currently invite-only or requires an application. You can apply to become a Founding Creator. We review each application based on audience engagement, content quality, and niche. Our team will get in touch if your profile is a good fit for our platform.",
    },
    {
        question: "How does VibeMatch guarantee payments?",
        answer: "When a brand hires you for a campaign, they deposit the full payment into our secure escrow system. Once you've completed the agreed-upon deliverables and the brand approves them, we release the funds directly to your account. This eliminates the risk of late or missed payments, letting you focus on creating.",
    },
    {
        question: "Is there a fee to use VibeMatch?",
        answer: "It is free for creators to join VibeMatch and create a profile. We take a small platform fee from your earnings on each completed campaign. This fee helps us cover payment processing, platform maintenance, and provide you with support and resources to grow your career.",
    }
]

const generalFaq = [
    {
        question: "What makes VibeMatch different from other platforms?",
        answer: "VibeMatch is built on the pillars of Trust and Efficiency. Our unique Trust Engine ensures authentic collaborations, while our automated payment system protects creators. We are specifically focused on the Moroccan market, understanding its unique dynamics and fostering a community of top-tier local talent and brands.",
    },
    {
        question: "What if I have a dispute?",
        answer: "In the rare case of a disagreement between a brand and a creator, VibeMatch provides a dedicated dispute resolution process. Our support team will mediate the situation, review the campaign agreement and communication, and work towards a fair and timely resolution for both parties.",
    }
]

const FaqGroup = ({ title, icon, faqs, id }: { title: string; icon: string; faqs: {question: string, answer: string}[]; id: string }) => (
    <section className="scroll-mt-24 mb-16" id={id}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 font-headline flex items-center gap-3">
        <span className="material-symbols-outlined text-4xl gradient-text">{icon}</span>
        {title}
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-6">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border-b pb-6 group">
            <AccordionTrigger className="hover:no-underline py-0">
              <span className="text-lg font-semibold text-left">{faq.question}</span>
              <span className="material-symbols-outlined text-2xl text-foreground/50 group-data-[state=open]:rotate-45 group-hover:text-primary transition-transform duration-300">add</span>
            </AccordionTrigger>
            <AccordionContent className="mt-4 text-foreground/70 leading-relaxed pt-0">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
);


export function FaqSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
      <div className="md:col-span-3">
        <nav className="sticky top-32">
          <h3 className="font-bold text-lg mb-4 font-headline">Categories</h3>
          <ul className="space-y-3">
            <li>
                <Link className="flex items-center gap-2 p-2 rounded-md font-medium text-foreground/70 hover:bg-muted hover:text-primary transition-colors" href="#brands-faq">
                    <span className="material-symbols-outlined text-lg">storefront</span> For Brands
                </Link>
            </li>
            <li>
                <Link className="flex items-center gap-2 p-2 rounded-md font-medium text-foreground/70 hover:bg-muted hover:text-primary transition-colors" href="#creators-faq">
                    <span className="material-symbols-outlined text-lg">person</span> For Creators
                </Link>
            </li>
            <li>
                <Link className="flex items-center gap-2 p-2 rounded-md font-medium text-foreground/70 hover:bg-muted hover:text-primary transition-colors" href="#general-faq">
                    <span className="material-symbols-outlined text-lg">help_outline</span> General
                </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="md:col-span-9">
        <FaqGroup id="brands-faq" title="For Brands" icon="storefront" faqs={brandsFaq} />
        <FaqGroup id="creators-faq" title="For Creators" icon="person" faqs={creatorsFaq} />
        <FaqGroup id="general-faq" title="General" icon="help_outline" faqs={generalFaq} />
      </div>
    </div>
  );
}
