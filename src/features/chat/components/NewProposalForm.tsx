'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const NewProposalForm = ({ onMakeOffer, setOpen }: { onMakeOffer: (amount: number, message: string) => void, setOpen?: (open: boolean) => void }) => {
    const [newOffer, setNewOffer] = useState('');
    const [message, setMessage] = useState('');
    const { t, dir } = useLanguage();
    const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  
    const handleSubmitOffer = () => {
      if (!newOffer || isNaN(parseFloat(newOffer)) || parseFloat(newOffer) <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
      onMakeOffer(parseFloat(newOffer), message || "Here is my new proposal for this campaign.");
      setNewOffer('');
      setMessage('');
      setOpen?.(false);
    };
  
    return (
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="budget">{t('chat.proposalForm.amount')}</Label>
          <Input id="budget" type="number" value={newOffer} onChange={(e) => setNewOffer(e.target.value)} />
          <Label htmlFor="message">{t('chat.proposalForm.message')}</Label>
          <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('chat.proposalForm.placeholder')}/>
          <Button onClick={handleSubmitOffer}>{t('chat.proposalForm.send')} <Arrow className={cn("h-4 w-4", dir === 'rtl' ? 'mr-2' : 'ml-2')} /></Button>
        </div>
      </div>
    );
  };
