
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/language-context';
import { useUser, useFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { Shield, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, writeBatch, Timestamp, collection } from 'firebase/firestore';

type CheckoutItem = {
  id: string; // conversationId
  campaignId: string;
  campaignTitle: string;
  creatorName: string;
  deliverables: string[];
  amount: number;
};

export function CheckoutDialog({
  items,
  children,
}: {
  items: CheckoutItem[];
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const { user } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    // When the dialog opens, pre-select all items.
    if (open) {
      setSelectedItems(items.map(item => item.id));
    }
  }, [open, items]);

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const itemsToProcess = useMemo(() => items.filter(item => selectedItems.includes(item.id)), [items, selectedItems]);

  const subTotal = useMemo(() => itemsToProcess.reduce((acc, item) => acc + item.amount, 0), [itemsToProcess]);
  const serviceFee = subTotal * 0.10;
  const vat = serviceFee * 0.20;
  const total = subTotal + serviceFee + vat;
  
  const handlePayment = async () => {
      if (!isTermsChecked || !firestore || !user || itemsToProcess.length === 0) return;
      setIsProcessing(true);
      toast({ title: t('checkout.processing'), description: t('checkout.processingDescription') });

      // 1. Simulate and log consent (The Legal Proof)
      console.log('--- LEGAL AUDIT TRAIL (SIMULATED) ---');
      console.log({
          user_id: user.uid,
          campaign_ids: itemsToProcess.map(item => item.campaignId),
          ip_address: '127.0.0.1', // This would be retrieved via headers on the server
          timestamp: new Date().toISOString(),
          document_version: "CGU_CLIENT_V1.0",
          action: "ACCEPTED_MANDATE_AND_TERMS",
          user_agent: navigator.userAgent
      });
      console.log('------------------------------------');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const batch = writeBatch(firestore);

        itemsToProcess.forEach(item => {
            const campaignRef = doc(firestore, 'campaigns', item.campaignId);
            const conversationRef = doc(firestore, 'conversations', item.id);
            
            batch.update(campaignRef, {
                status: 'IN_PROGRESS',
                updatedAt: Timestamp.now(),
            });

            batch.update(conversationRef, {
                status: 'ACTIVE',
                is_funded: true,
                updatedAt: Timestamp.now(),
            });
        });

        await batch.commit();

        toast({
            title: t('paymentSuccess.title'),
            description: t('paymentSuccess.description'),
        });
        
        router.push(`/campaigns/${itemsToProcess[0].campaignId}/success`);
        setOpen(false);

      } catch (error: any) {
        toast({
            variant: "destructive",
            title: t('checkout.toast.error.title'),
            description: error.message || t('checkout.toast.error.description'),
        });
      } finally {
        setIsProcessing(false);
      }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <DialogTitle className="text-2xl font-bold">{t('checkout.title')}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <p className="font-semibold">{t('checkout.summary')}</p>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-start gap-3 text-sm">
                        <Checkbox 
                            id={`item-${item.id}`}
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleItemSelect(item.id)}
                            className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none flex-1">
                          <label htmlFor={`item-${item.id}`} className="font-medium cursor-pointer">{item.creatorName} ({item.campaignTitle})</label>
                          <div className="flex justify-between items-center text-muted-foreground">
                              <p className="truncate pr-2">{item.deliverables.join(', ')}</p>
                              <p className="font-mono whitespace-nowrap">{item.amount.toFixed(2)} {t('currency')}</p>
                          </div>
                        </div>
                    </div>
                ))}
            </div>
            <Separator />
             <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <p className="text-muted-foreground">{t('checkout.subtotal')}</p>
                    <p className="font-medium">{subTotal.toFixed(2)} {t('currency')}</p>
                </div>
                 <div className="flex justify-between">
                    <p className="text-muted-foreground">{t('checkout.serviceFee')}</p>
                    <p className="font-medium">{serviceFee.toFixed(2)} {t('currency')}</p>
                </div>
                 <div className="flex justify-between">
                    <p className="text-muted-foreground">{t('checkout.vat')}</p>
                    <p className="font-medium">{vat.toFixed(2)} {t('currency')}</p>
                </div>
            </div>
             <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
                <p>{t('checkout.total')}</p>
                <p className="gradient-text">{total.toFixed(2)} {t('currency')}</p>
            </div>
             <Separator />
             <div className="space-y-3">
                 <p className="font-semibold text-sm">{t('checkout.consent.title')}</p>
                 <div className="flex items-start space-x-2">
                    <Checkbox id="terms" checked={isTermsChecked} onCheckedChange={(checked) => setIsTermsChecked(checked as boolean)} className="mt-1" />
                    <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground"
                    >
                        {t('checkout.consent.line1')}{' '}
                        <Link href="/terms" target="_blank" className="underline hover:text-primary">{t('checkout.consent.termsLink')}</Link>{' '}
                        {t('checkout.consent.line2')}
                    </label>
                </div>
             </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('checkout.cancel')}</Button>
          <Button type="button" onClick={handlePayment} disabled={!isTermsChecked || isProcessing || itemsToProcess.length === 0}>
            {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Lock className="mr-2 h-4 w-4" />
            )}
            {isProcessing ? t('checkout.processing') : t('checkout.pay', { total: total.toFixed(2) })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
