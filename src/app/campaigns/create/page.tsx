

'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
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
import { PlusCircle, XCircle, Instagram, Video, Repeat, StickyNote, PartyPopper } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

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
    (val) => (val === '' ? 0 : Number(val)),
    z.number({ invalid_type_error: 'Budget must be a number.' }).positive('Budget must be a positive number.')
  ),
  tags: z.array(z.string()).min(1, "Please select at least one tag."),
  otherTag: z.string().optional(),
}).refine(data => {
    // Custom refinement to check if deliverable types are valid for the selected platform
    return data.deliverables.every(d => {
        if (d.platform === 'instagram') return ['Post', 'Story', 'Reel'].includes(d.type);
        if (d.platform === 'tiktok') return ['Video'].includes(d.type);
        return false;
    });
}, {
    message: "Invalid deliverable type for the selected platform.",
    path: ['deliverables'],
});

type CampaignForm = z.infer<typeof campaignSchema>;

const deliverableTypes = {
    instagram: [
        { value: 'Post', label: 'Post', icon: StickyNote },
        { value: 'Story', label: 'Story', icon: Repeat },
        { value: 'Reel', label: 'Reel', icon: Video },
    ],
    tiktok: [
        { value: 'Video', label: 'Video', icon: Video },
    ]
};

const DeliverableItem = ({ index, control, remove, setValue }: { index: number, control: any, remove: (index: number) => void, setValue: any}) => {
    const platformValue = useWatch({
        control,
        name: `deliverables.${index}.platform`
    });

    const availableTypes = deliverableTypes[platformValue as keyof typeof deliverableTypes] || [];

    useEffect(() => {
        if (platformValue && availableTypes.length > 0) {
            // Check if the current type is valid for the new platform
            const currentType = control._getWatch(`deliverables.${index}.type`);
            const isTypeValid = availableTypes.some(t => t.value === currentType);

            // If not valid, set the first available type as default
            if (!isTypeValid) {
                setValue(`deliverables.${index}.type`, availableTypes[0].value, { shouldValidate: true });
            }
        }
    }, [platformValue, availableTypes, index, setValue, control]);


    return (
        <div className="p-4 border rounded-lg bg-muted/50 space-y-4 relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField
                control={control}
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
                control={control}
                name={`deliverables.${index}.type`}
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={!platformValue}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {availableTypes.map(type => {
                                const Icon = type.icon;
                                return (
                                <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2"><Icon className="h-4 w-4" /> {type.label}</div>
                                </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={control}
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
                control={control}
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
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-3 -right-3 text-muted-foreground hover:text-destructive bg-muted/80 hover:bg-destructive/10 rounded-full h-7 w-7"
                onClick={() => remove(index)}
            >
                <XCircle className="h-5 w-5" />
            </Button>
        </div>
    )
}

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
      otherTag: '',
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
    
    // Combine tags and otherTag
    let finalTags = [...data.tags];
    if (data.tags.includes('Other') && data.otherTag) {
        const customTags = data.otherTag.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        finalTags.push(...customTags);
    }
    
    // Remove 'Other' placeholder from the final list
    const otherIndex = finalTags.indexOf('Other');
    if (otherIndex > -1) {
        finalTags.splice(otherIndex, 1);
    }

    // Remove duplicates
    finalTags = [...new Set(finalTags)];


    const submissionData = {
      ...data,
      tags: finalTags,
      deliverables: data.deliverables.map(d => `${d.quantity} ${d.platform} ${d.type}(s)${d.note ? ` - ${d.note}`: ''}`),
      brandId: user.uid,
      status: 'OPEN_FOR_APPLICATIONS',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    delete submissionData.otherTag;

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
        
        {isSuccess ? (
            <Card className="text-center p-8 border-green-500/50 shadow-lg shadow-green-500/10">
                <CardContent className="p-0">
                    <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 animate-circle-grow">
                         <svg className="w-12 h-12 text-black animate-check-grow" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" viewBox="0 0 52 52">
                            <path d="M14 27l8.5 8.5L38 20"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight gradient-text">Campaign Published!</h2>
                    <p className="text-muted-foreground mt-2 mb-8">
                        Your campaign is now live. Creators on VibeMatch can now see and apply to it.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <Button size="lg" onClick={() => router.push(`/campaigns/${newCampaignId}/manage`)}>Manage Applications</Button>
                         <Button size="lg" variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <>
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight">Create a New Campaign</h1>
                    <p className="text-muted-foreground mt-2">This will be visible to creators on the platform.</p>
                </div>
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
                        <DeliverableItem key={item.id} index={index} control={form.control} remove={remove} setValue={form.setValue} />
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
                    
                    <div className="space-y-4">
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
                                        field.value?.includes(niche.label) && "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
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
                        {form.watch('tags')?.includes('Other') && (
                            <FormField
                                control={form.control}
                                name="otherTag"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Custom Tag(s)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Sustainable, Vegan. Separate with commas." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>


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
            </>
        )}
      </div>
    </>
  );
}

