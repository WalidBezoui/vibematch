
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useLanguage } from '@/context/language-context';

const inviteSchema = z.object({
  campaignId: z.string({ required_error: 'Please select a campaign.' }),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function InviteToCampaignDialog({
  creator,
  campaigns,
  children,
}: {
  creator: any;
  campaigns: any[];
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const [validationError, setValidationError] = useState<string | null>(null);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      campaignId: '',
      message: t('inviteDialog.defaultMessage', { name: creator.displayName || creator.name }),
    },
  });

  const selectedCampaignId = form.watch('campaignId');

  useEffect(() => {
    const validateInvitation = async () => {
      if (!selectedCampaignId || !firestore) {
        setValidationError(null);
        return;
      }
      
      const campaign = campaigns.find(c => c.id === selectedCampaignId);
      if (campaign && campaign.creatorIds?.includes(creator.id)) {
        setValidationError(t('inviteDialog.validation.alreadyHired', { name: creator.displayName || creator.name }));
        form.setError('campaignId', { message: 'Creator is already hired.' });
        return;
      }

      const applicationsRef = collection(firestore, 'campaigns', selectedCampaignId, 'applications');
      const q = query(applicationsRef, where('creatorId', '==', creator.id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setValidationError(t('inviteDialog.validation.alreadyApplied', { name: creator.displayName || creator.name }));
        form.setError('campaignId', { message: 'Creator has already applied.' });
        return;
      }

      setValidationError(null);
      form.clearErrors('campaignId');
    };

    validateInvitation();
  }, [selectedCampaignId, creator.id, creator.displayName, creator.name, campaigns, firestore, form, t]);


  const onSubmit = async (data: InviteFormValues) => {
    if (validationError) {
        toast({
            variant: "destructive",
            title: t('inviteDialog.toast.error.cannotSend.title'),
            description: validationError,
        });
        return;
    }
    // This is where you would normally implement the Firestore logic to send the invitation
    // For example, creating a new document in a 'notifications' collection or a 'campaignApplications' collection with 'INVITED' status.

    console.log('Sending invitation:', {
      creatorId: creator.id,
      campaignId: data.campaignId,
      message: data.message,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: t('inviteDialog.toast.success.title'),
      description: t('inviteDialog.toast.success.description', { name: creator.displayName || creator.name }),
    });
    setOpen(false);
    form.reset();
  };

  const isSubmitting = form.formState.isSubmitting;
  const activeCampaignsWithSlots = campaigns.filter(c => (c.creatorIds?.length || 0) < (c.numberOfCreators || 1));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('inviteDialog.title', { name: creator.displayName || creator.name })}</DialogTitle>
          <DialogDescription>
            {t('inviteDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="campaignId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inviteDialog.campaignLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('inviteDialog.campaignPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeCampaignsWithSlots.length > 0 ? (
                        activeCampaignsWithSlots.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.title} ({t('inviteDialog.hiredText', { hired: campaign.creatorIds?.length || 0, total: campaign.numberOfCreators || 1 })})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-muted-foreground">{t('inviteDialog.noCampaigns')}</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inviteDialog.messageLabel')}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={t('inviteDialog.messagePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || !!validationError}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {t('inviteDialog.sendButton')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
    