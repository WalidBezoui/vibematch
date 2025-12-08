
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const proposalSchema = z.object({
  amount: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number({ invalid_type_error: 'Amount must be a number.' }).positive('Amount must be a positive number.')
  ),
  message: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

export const NewProposalForm = ({
  onSubmit,
  setOpen,
  initialAmount,
}: {
  onSubmit: (values: ProposalFormValues) => void;
  setOpen?: (open: boolean) => void;
  initialAmount?: number;
}) => {
  const { t, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      amount: initialAmount || 0,
      message: '',
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const handleFormSubmit = (values: ProposalFormValues) => {
    onSubmit(values);
    form.reset();
    setOpen?.(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="amount">{t('chat.proposalForm.amount')}</Label>
              <FormControl>
                <Input id="amount" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="message">{t('chat.proposalForm.message')}</Label>
              <FormControl>
                <Textarea
                  id="message"
                  placeholder={t('chat.proposalForm.placeholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {t('chat.proposalForm.send')} <Arrow className={cn('h-4 w-4', dir === 'rtl' ? 'mr-2' : 'ml-2')} />
        </Button>
      </form>
    </Form>
  );
};
