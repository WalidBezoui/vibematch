
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch, useFormContext } from 'react-hook-form';
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
import { PlusCircle, XCircle, Instagram, Video, Repeat, StickyNote, PartyPopper, Users, Megaphone, FileVideo, Info, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';

const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
    </svg>
);

const deliverableSchema = z.object({
  platform: z.enum(['instagram', 'tiktok']),
  type: z.enum(['Post', 'Story', 'Reel', 'Video', 'UGC_Video_Vertical', 'UGC_Video_Horizontal', 'UGC_Photo_Pack']),
  quantity: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Qty must be a number.' }).min(1, 'Quantity must be at least 1.')
  ),
});

const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  campaignBrief: z.string().min(20, 'The campaign brief must be at least 20 characters.'),
  campaignType: z.enum(['influence', 'ugc']),
  deliverables: z.array(deliverableSchema).min(1, 'Please add at least one deliverable.'),
  budget: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number({ invalid_type_error: 'Budget must be a number.' }).positive('Budget must be a positive number.')
  ),
  numberOfCreators: z.preprocess(
    (val) => (val === '' ? 1 : Number(val)),
    z.number({ invalid_type_error: 'Must be a number.' }).min(1, 'You must hire at least 1 creator.')
  ),
  tags: z.array(z.string()).min(1, "Please select at least one tag."),
  otherTag: z.string().optional(),
});

type CampaignForm = z.infer<typeof campaignSchema>;


const influenceDeliverableTypes = {
    instagram: [
        { value: 'Post', label: 'Post', icon: StickyNote },
        { value: 'Story', label: 'Story', icon: Repeat },
        { value: 'Reel', label: 'Reel', icon: Video },
    ],
    tiktok: [
        { value: 'Video', label: 'Video', icon: Video },
    ]
};

const ugcDeliverableTypes = [
    { name: 'deliverables.0.quantity', label: 'Video 9:16 (Vertical)' },
    { name: 'deliverables.1.quantity', label: 'Video 16:9 (Horizontal)' },
    { name: 'deliverables.2.quantity', label: 'Photo Pack' },
]

const DeliverableItem = ({ index, control, remove, setValue }: { index: number, control: any, remove: (index: number) => void, setValue: any}) => {
    const { t } = useLanguage();
    const platformValue = useWatch({
        control,
        name: `deliverables.${index}.platform`
    });

    const availableTypes = influenceDeliverableTypes[platformValue as keyof typeof influenceDeliverableTypes] || [];

    useEffect(() => {
        if (platformValue && availableTypes.length > 0) {
            const currentType = control._getWatch(`deliverables.${index}.type`);
            const isTypeValid = availableTypes.some(t => t.value === currentType);
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
                    <FormLabel>{t('createCampaignPage.deliverables.platformLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder={t('createCampaignPage.deliverables.platformPlaceholder')} />
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
                    <FormLabel>{t('createCampaignPage.deliverables.typeLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={!platformValue}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('createCampaignPage.deliverables.typePlaceholder')} />
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
                    <FormLabel>{t('createCampaignPage.deliverables.quantityLabel')}</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            
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

const UGCDeliverableItem = ({ name, label }: { name: string, label: string }) => {
    const { control } = useFormContext();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg bg-muted/50">
                    <FormControl>
                        <Input type="number" min="0" {...field} className="w-20" placeholder="0" />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
                </FormItem>
            )}
        />
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
      campaignType: 'influence',
      deliverables: [
        { platform: 'instagram', type: 'Post', quantity: 1 },
        { platform: 'instagram', type: 'UGC_Video_Vertical', quantity: 0 },
        { platform: 'instagram', type: 'UGC_Video_Horizontal', quantity: 0 },
        { platform: 'instagram', type: 'UGC_Photo_Pack', quantity: 0 },
      ],
      budget: 0,
      numberOfCreators: 1,
      tags: [],
      otherTag: '',
    },
  });

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliverables"
  });

  const campaignType = useWatch({ control: form.control, name: 'campaignType'});

  const onSubmit = async (data: CampaignForm) => {
    if (!firestore || !user) {
        toast({ variant: 'destructive', title: 'You must be logged in to create a campaign.'});
        return;
    }
    
    let finalTags = [...data.tags];
    if (data.tags.includes('Other') && data.otherTag) {
        const customTags = data.otherTag.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        finalTags.push(...customTags);
    }
    
    const otherIndex = finalTags.indexOf('Other');
    if (otherIndex > -1) {
        finalTags.splice(otherIndex, 1);
    }

    finalTags = [...new Set(finalTags)];

    const submissionData = {
      ...data,
      campaignType: data.campaignType,
      tags: finalTags,
      deliverables: data.deliverables.map(d => `${d.quantity} ${d.type}`),
      brandId: user.uid,
      status: 'OPEN_FOR_APPLICATIONS',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      creatorIds: [],
    };
    
    delete (submissionData as any).otherTag;

    try {
        const campaignsCollectionRef = collection(firestore, 'campaigns');
        const campaignDocRef = await addDoc(campaignsCollectionRef, submissionData);

      toast({
        title: t('createCampaignPage.success.title'),
        description: t('createCampaignPage.success.description'),
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
      // It might be better to use middleware for this, but for now this works
      router.push('/login');
      return null;
  }

  return (
    <>
      <AppHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {isSuccess ? (
            <div className="w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
                <Card className="text-center p-8 border-green-500/50 shadow-lg shadow-green-500/10 w-full max-w-lg">
                    <CardContent className="p-0">
                        <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 animate-circle-grow">
                            <svg className="w-12 h-12 text-black animate-check-grow" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" viewBox="0 0 52 52">
                                <path d="M14 27l8.5 8.5L38 20"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight gradient-text">{t('createCampaignPage.success.title')}</h2>
                        <p className="text-muted-foreground mt-2 mb-8">
                            {t('createCampaignPage.success.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" onClick={() => router.push(`/campaigns/${newCampaignId}/manage`)}>{t('createCampaignPage.success.manageButton')}</Button>
                            <Button size="lg" variant="outline" onClick={() => router.push('/dashboard')}>{t('createCampaignPage.success.dashboardButton')}</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        ) : (
            <>
                <div className="mb-10 text-left">
                    <h1 className="text-4xl font-bold tracking-tight">{t('createCampaignPage.title')}</h1>
                    <p className="text-muted-foreground mt-2">{t('createCampaignPage.description')}</p>
                </div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('createCampaignPage.basics.title')}</CardTitle>
                            <CardDescription>{t('createCampaignPage.basics.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('createCampaignPage.titleLabel')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('createCampaignPage.titlePlaceholder')} {...field} />
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
                                    <FormLabel>{t('createCampaignPage.briefLabel')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('createCampaignPage.briefPlaceholder')} {...field} rows={6} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('createCampaignPage.deliverables.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <FormField
                                control={form.control}
                                name="campaignType"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                    <FormLabel>{t('createCampaignPage.deliverables.campaignTypeLabel')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        >
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="influence" id="influence" className="sr-only" />
                                                </FormControl>
                                                <Label htmlFor="influence" className={cn("flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all", field.value === 'influence' ? 'border-primary shadow-md' : 'border-muted hover:border-border')}>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Megaphone className="h-5 w-5 text-primary" />
                                                        <span className="font-bold">{t('createCampaignPage.deliverables.influence.title')}</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{t('createCampaignPage.deliverables.influence.description')}</span>
                                                </Label>
                                            </FormItem>
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="ugc" id="ugc" className="sr-only" />
                                                </FormControl>
                                                <Label htmlFor="ugc" className={cn("flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all", field.value === 'ugc' ? 'border-primary shadow-md' : 'border-muted hover:border-border')}>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <FileVideo className="h-5 w-5 text-primary" />
                                                        <span className="font-bold">{t('createCampaignPage.deliverables.ugc.title')}</span>
                                                        <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Info className="h-4 w-4 text-muted-foreground ml-auto" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{t('createCampaignPage.deliverables.ugc.tooltip')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{t('createCampaignPage.deliverables.ugc.description')}</span>
                                                </Label>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <div className="space-y-4 pt-4">
                                <h3 className="font-semibold">{t('createCampaignPage.deliverables.selectLabel')}</h3>
                                {campaignType === 'influence' && (
                                     <>
                                        {fields.map((item, index) => (
                                            <DeliverableItem key={item.id} index={index} control={form.control} remove={remove} setValue={form.setValue} />
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={() => append({ platform: 'instagram', type: 'Post', quantity: 1 })}>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            {t('createCampaignPage.deliverables.addButton')}
                                        </Button>
                                    </>
                                )}
                                {campaignType === 'ugc' && (
                                    <div className="space-y-4">
                                        {ugcDeliverableTypes.map((item, index) => (
                                            <UGCDeliverableItem key={item.name} name={item.name} label={item.label} />
                                        ))}
                                    </div>
                                )}
                                <FormMessage>{form.formState.errors.deliverables?.root?.message}</FormMessage>
                            </div>
                        </CardContent>
                    </Card>


                    <Card>
                        <CardHeader>
                            <CardTitle>{t('createCampaignPage.discovery.title')}</CardTitle>
                             <CardDescription>{t('createCampaignPage.discovery.description')}</CardDescription>
                        </CardHeader>
                         <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('createCampaignPage.tagsLabel')}</FormLabel>
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
                                            <FormLabel>{t('createCampaignPage.otherTagLabel')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('createCampaignPage.otherTagPlaceholder')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('createCampaignPage.budgetLabel')}</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                    control={form.control}
                                    name="numberOfCreators"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{t('createCampaignPage.numCreatorsLabel')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={form.formState.isSubmitting} className="w-full" size="lg">
                    {form.formState.isSubmitting ? t('createCampaignPage.publishingButton') : t('createCampaignPage.publishButton')}
                    </Button>
                </form>
                </Form>
            </>
        )}
      </div>
    </>
  );
}

    