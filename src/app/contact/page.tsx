'use client';

import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const WhatsAppIcon = () => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 fill-current"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.165-.917-.223c-.246-.058-.496-.058-.744-.058-.247 0-.644.075-.99.422-.346.346-1.328 1.299-1.328 3.165 0 1.866 1.354 3.666 1.549 3.915.196.249 2.62 4.226 6.323 5.576.87.325 1.56.52 2.096.66.703.198 1.34.166 1.82.1.572-.075 1.758-.716 2.006-1.413.248-.697.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.487 5.468c-1.795 0-3.257-1.46-3.257-3.257 0-1.795 1.46-3.257 3.257-3.257 1.795 0 3.257 1.46 3.257 3.257 0 1.795-1.46 3.257-3.257 3.257m8.363-18.299c-3.15-3.15-8.26-3.15-11.41 0s-3.15 8.26 0 11.41c3.15 3.15 8.26 3.15 11.41 0 3.15-3.15 3.15-8.26 0-11.41M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );

const ContactCard = ({
  icon,
  title,
  description,
  value,
  buttonText,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
  buttonText: string;
  href: string;
}) => (
  <div className="relative flex flex-col items-center text-center bg-muted/50 dark:bg-background/50 rounded-2xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-black mb-6 shadow-lg shadow-primary/30">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-foreground/60 mb-4 h-12">{description}</p>
    <p className="text-xl font-semibold text-primary gradient-text mb-6">{value}</p>
    <Button asChild size="lg" className="w-full h-12 px-8 gradient-bg text-black text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary rounded-full">
      <Link href={href}>{buttonText}</Link>
    </Button>
  </div>
);

export default function ContactPage() {
  const { t } = useLanguage();

  const contactInfo = {
    support: {
      phone: "+212 5 22 33 44 55",
      email: "support@vibematch.ma",
    },
    whatsapp: {
      phone: "+212 6 11 22 33 44",
    },
  };
  
  return (
    <div className="flex h-auto w-full flex-col overflow-x-hidden">
      <AppHeader />
      <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
              {t('contactPage.title.part1')}{' '}
              <span className="gradient-text">{t('contactPage.title.part2')}</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-foreground/60">
              {t('contactPage.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ContactCard
              icon={<Phone className="w-8 h-8" />}
              title={t('contactPage.phone.title')}
              description={t('contactPage.phone.description')}
              value={contactInfo.support.phone}
              buttonText={t('contactPage.phone.button')}
              href={`tel:${contactInfo.support.phone.replace(/\s/g, '')}`}
            />
             <ContactCard
              icon={<WhatsAppIcon />}
              title={t('contactPage.whatsapp.title')}
              description={t('contactPage.whatsapp.description')}
              value={contactInfo.whatsapp.phone}
              buttonText={t('contactPage.whatsapp.button')}
              href={`https://wa.me/${contactInfo.whatsapp.phone.replace(/\s/g, '')}`}
            />
            <ContactCard
              icon={<Mail className="w-8 h-8" />}
              title={t('contactPage.email.title')}
              description={t('contactPage.email.description')}
              value={contactInfo.support.email}
              buttonText={t('contactPage.email.button')}
              href={`mailto:${contactInfo.support.email}`}
            />
          </div>
        </div>
      </main>
      <footer className="px-4 md:px-10 lg:px-20 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-foreground/60">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            <Link
              className="text-sm text-foreground/60 hover:text-primary"
              href="#"
            >
              {t('footer.terms')}
            </Link>
            <Link
              className="text-sm text-foreground/60 hover:text-primary"
              href="#"
            >
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
