'use client';

import { useState } from 'react';
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
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      campaignId: '',
      message: `Hi ${creator.displayName || creator.name}, we think you'd be a great fit for our campaign and would love for you to apply!`,
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
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
      title: 'Invitation Sent!',
      description: `${creator.displayName || creator.name} has been invited to your campaign.`,
    });
    setOpen(false);
    form.reset();
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite {creator.displayName || creator.name}</DialogTitle>
          <DialogDescription>
            Select one of your active campaigns and send a personalized message.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="campaignId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an active campaign..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {campaigns.length > 0 ? (
                        campaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.title}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-muted-foreground">No active campaigns found.</div>
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Write a brief message to the creator..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
