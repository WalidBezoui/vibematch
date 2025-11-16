
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppHeader } from '@/components/app-header';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, XCircle, Instagram, Video, Repeat, StickyNote } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PartyPopper } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
    </svg>
);


const deliverableSchema = z.object({
  platform: z.enum(['instagram', 'tiktok'], { required_error: "Platform is required."}),
  type: z.enum(['Post', 'Story', 'Reel', 'Video'], { required_error: "Type is required."}),
  quantity: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Qty must be a number.' }).min(1, 'Quantity must be at least 1.')
  ),
  note: z.string().optional(),
});


const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  campaignBrief: z.string().min(20, 'The campaign brief must be at least 20 characters.'),
  deliverables: z.array(deliverableSchema).min(1, 'Please add at least one deliverable.'),
  budget: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Budget must be a number.' }).positive('Budget must be a positive number.')
  ),
  tags: z.array(z.string()).min(1, "Please select at least one tag."),
});

type CampaignForm = z.infer<typeof campaignSchema>;

export default function CreateCampaignPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [newCampaignId, setNewCampaignId] = useState('');
  const { t } = useLanguage();

  const niches = t('creatorJoinForm.niches', { returnObjects: true }) as { id: string; label: string; icon: string }[];

  const form = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      campaignBrief: '',
      deliverables: [{ platform: 'instagram', type: 'Post', quantity: 1, note: '' }],
      budget: 0,
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliverables"
  });

  const onSubmit = async (data: CampaignForm) => {
    if (!firestore || !user) {
        toast({ variant: 'destructive', title: 'You must be logged in to create a campaign.'});
        return;
    }

    const submissionData = {
      ...data,
      deliverables: data.deliverables.map(d => `${d.quantity} ${d.platform} ${d.type}(s)${d.note ? ` - ${d.note}`: ''}`),
      brandId: user.uid,
      status: 'OPEN_FOR_APPLICATIONS',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
        const campaignsCollectionRef = collection(firestore, 'campaigns');
        const campaignDocRef = await addDoc(campaignsCollectionRef, submissionData);

      toast({
        title: 'Campaign Published!',
        description: 'Your campaign is now open for applications.',
      });
      setNewCampaignId(campaignDocRef.id);
      setIsSuccess(true);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message || "Could not create the campaign.",
      });
    }
  };

  if (isUserLoading) {
      return <div>Loading...</div>
  }

  if (!user) {
      router.push('/login');
      return null;
  }

  return (
    <>
      <AppHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Create a New Campaign</h1>
          <p className="text-muted-foreground mt-2">This will be visible to creators on the platform.</p>
        </div>
        
        {isSuccess ? (
             <Alert className="border-green-500 text-green-700">
                <PartyPopper className="h-4 w-4" />
                <AlertTitle className="font-bold">Campaign Published!</AlertTitle>
                <AlertDescription>
                    Your campaign is now live and creators can start applying.
                    <div className="mt-4 flex gap-4">
                         <Button onClick={() => router.push(`/campaigns/${newCampaignId}/manage`)}>Manage Applications</Button>
                         <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                    </div>
                </AlertDescription>
             </Alert>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Campaign Title</FormLabel>
                      <FormControl>
                          <Input placeholder="e.g., Summer Skincare Campaign" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="campaignBrief"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Campaign Brief</FormLabel>
                      <FormControl>
                          <Textarea placeholder="Describe the campaign goals, target audience, key messages, and overall vibe." {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Deliverables</FormLabel>
                  <div className="space-y-3">
                    {fields.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg bg-muted/50 space-y-4 relative">
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                           <FormField
                              control={form.control}
                              name={`deliverables.${index}.platform`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Platform</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select platform" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="instagram"><div className="flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram</div></SelectItem>
                                      <SelectItem value="tiktok"><div className="flex items-center gap-2"><TikTokIcon /> TikTok</div></SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name={`deliverables.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Post"><div className="flex items-center gap-2"><Video className="h-4 w-4" /> Post</div></SelectItem>
                                      <SelectItem value="Story"><div className="flex items-center gap-2"><Repeat className="h-4 w-4" /> Story</div></SelectItem>
                                      <SelectItem value="Reel"><div className="flex items-center gap-2"><Video className="h-4 w-4" /> Reel</div></SelectItem>
                                       <SelectItem value="Video"><div className="flex items-center gap-2"><Video className="h-4 w-4" /> Video</div></SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name={`deliverables.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantity</FormLabel>
                                  <FormControl>
                                      <Input type="number" placeholder="1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                         </div>
                          <FormField
                              control={form.control}
                              name={`deliverables.${index}.note`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Optional Note</FormLabel>
                                  <FormControl>
                                      <Input placeholder="e.g., must include product link" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                         {fields.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -top-3 -right-3 text-muted-foreground hover:text-destructive bg-muted/80 hover:bg-destructive/10 rounded-full h-7 w-7"
                                onClick={() => remove(index)}
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ platform: 'instagram', type: 'Post', quantity: 1, note: '' })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Deliverable
                  </Button>
                  <FormMessage>{form.formState.errors.deliverables?.root?.message}</FormMessage>
                </div>
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {niches.map((niche) => (
                            <Button
                              key={niche.id}
                              type="button"
                              variant="outline"
                              className={cn(
                                "rounded-full",
                                field.value.includes(niche.label) && "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                              )}
                              onClick={() => {
                                const currentTags = field.value || [];
                                const newTags = currentTags.includes(niche.label)
                                  ? currentTags.filter(t => t !== niche.label)
                                  : [...currentTags, niche.label];
                                field.onChange(newTags);
                              }}
                            >
                              {niche.label}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Budget (in DH)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? 'Publishing Campaign...' : 'Publish Campaign'}
                </Button>
            </form>
            </Form>
        )}
      </div>
    </>
  );
}

