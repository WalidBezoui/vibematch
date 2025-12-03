'use client';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { PartyPopper } from 'lucide-react';

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/30 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-secondary/30 opacity-50 blur-3xl"></div>
      </div>
      <div className="z-10 flex h-full grow flex-col items-center justify-center">
        <div className="flex w-full max-w-lg flex-col items-center text-center">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 animate-circle-grow">
                <PartyPopper className="h-12 w-12 text-black" />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#1D1D1F] dark:text-white">
                  {t('paymentSuccess.title')}
                </p>
                <p className="mx-auto max-w-md text-base font-normal leading-normal text-[#617589] dark:text-gray-300">
                  {t('paymentSuccess.description')}
                </p>
              </div>
            </div>
            
            <div className="space-y-6 text-left p-6 bg-muted/50 rounded-lg border">
              <h3 className="font-semibold text-center">{t('paymentSuccess.documentsTitle')}</h3>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start gap-3">
                  <Link href="#" onClick={(e) => e.preventDefault()}>
                    <Download className="h-4 w-4" />
                    {t('paymentSuccess.invoiceButton')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start gap-3">
                   <Link href="#" onClick={(e) => e.preventDefault()}>
                    <Download className="h-4 w-4" />
                     {t('paymentSuccess.receiptButton')}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-full gradient-bg text-black text-base font-bold"
              >
                <Link href="/dashboard">{t('paymentSuccess.backButton')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```