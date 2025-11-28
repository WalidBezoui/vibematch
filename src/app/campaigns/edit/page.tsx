
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
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, XCircle, Instagram, Video, Repeat, StickyNote, Users, Megaphone, FileVideo, Info } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  campaignBrief: z.string().min(20, 'The campaign brief must be at least 20 characters.'),
  campaignType: z.enum(['influence', 'ugc'], { required_error: 'You must select a campaign type.' }),
  deliverables: z.array(z.string()).min(1, 'Please select at least one deliverable.'),
  budget: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number({ invalid_type_error: 'Budget must be a number.' }).positive('Budget must be a positive number.')
  ),
  tags: z.array(z.string()).min(1, "Please select at least one tag."),
  otherTag: z.string().optional(),
});

type CampaignForm = z.infer<typeof campaignSchema>;

const influenceDeliverables = [
  { id: 'instagram_reel', label: 'Instagram Reel' },
  { id: 'instagram_story', label: 'Instagram Story' },
  { id: 'instagram_post', label: 'Instagram Post' },
  { id: 'tiktok_video', label: 'TikTok Video' },
];

const ugcDeliverables = [
  { id: 'ugc_video_vertical', label: 'UGC Video (9:16 Vertical)' },
  { id: 'ugc_video_horizontal', label: 'UGC Video (16:9 Horizontal)' },
  { id: 'ugc_photo_pack', label: 'UGC Photo Pack' },
];


const EditCampaignPageSkeleton = () => (
    <div className="space-y-8">
        <div className="mb-10 text-left">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3 mt-2" />
        </div>
        <div className="space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-12 w-full mt-4" />
        </div>
    </div>
);

export default function EditCampaignPage() {
  const { campaignId } = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const { t } = useLanguage();
  const niches = t('creatorJoinForm.niches', { returnObjects: true }) as { id: string; label: string; icon: string }[];
  
  const campaignRef = useMemoFirebase(
    () => (firestore && campaignId ? doc(firestore, 'campaigns', campaignId as string) : null),
    [firestore, campaignId]
  );
  const { data: campaign, isLoading: isCampaignLoading, error: campaignError } = useDoc(campaignRef);

  const form = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
        title: '',
        campaignBrief: '',
        campaignType: 'influence',
        budget: 0,
        tags: [],
        deliverables: [],
        otherTag: '',
    },
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        title: campaign.title,
        campaignBrief: campaign.campaignBrief,
        campaignType: campaign.campaignType || 'influence',
        budget: campaign.budget,
        tags: campaign.tags || [],
        deliverables: campaign.deliverables || [],
      });
    }
  }, [campaign, form]);

  const campaignType = useWatch({ control: form.control, name: 'campaignType' });

  const onSubmit = async (data: CampaignForm) => {
    if (!campaignRef) return;
    
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
      tags: finalTags,
      updatedAt: serverTimestamp(),
    };
    delete (submissionData as any).otherTag;

    try {
      await updateDoc(campaignRef, submissionData);
      toast({
        title: t('editCampaignPage.toast.successTitle'),
        description: t('editCampaignPage.toast.successDescription'),
      });
      router.push('/dashboard');
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: t('editCampaignPage.toast.errorTitle'),
        description: e.message || t('editCampaignPage.toast.errorDescription'),
      });
    }
  };
  
  const isLoading = isUserLoading || isCampaignLoading;

  if (isLoading) {
    return (
        <>
            <AppHeader />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <EditCampaignPageSkeleton />
            </div>
        </>
    );
  }

  if (campaignError || !campaign) {
      return (
        <>
            <AppHeader />
            <div className="max-w-2xl mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold">{t('editCampaignPage.notFound.title')}</h1>
                <p className="text-muted-foreground mt-2">{t('editCampaignPage.notFound.description')}</p>
                <Button asChild className="mt-4"><Link href="/dashboard">{t('editCampaignPage.notFound.cta')}</Link></Button>
            </div>
        </>
      )
  }
  
  if (user?.uid !== campaign.brandId) {
      return (
        <>
            <AppHeader />
            <div className="max-w-2xl mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold">{t('editCampaignPage.accessDenied.title')}</h1>
                <p className="text-muted-foreground mt-2">{t('editCampaignPage.accessDenied.description')}</p>
                <Button asChild className="mt-4"><Link href="/dashboard">{t('editCampaignPage.accessDenied.cta')}</Link></Button>
            </div>
        </>
      )
  }

  return (
    <>
      <AppHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-10 text-left">
                <h1 className="text-4xl font-bold tracking-tight">{t('editCampaignPage.title')}</h1>
                <p className="text-muted-foreground mt-2">{t('editCampaignPage.description')}</p>
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
                        <CardDescription>{t('createCampaignPage.deliverables.description')}</CardDescription>
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
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    form.setValue('deliverables', []);
                                                }}
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

                             {campaignType && (
                                <div className="space-y-4 pt-4 border-t">
                                     <FormField
                                        control={form.control}
                                        name="deliverables"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('createCampaignPage.deliverables.selectLabel')}</FormLabel>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {(campaignType === 'influence' ? influenceDeliverables : ugcDeliverables).map((item) => (
                                                        <FormField
                                                            key={item.id}
                                                            control={form.control}
                                                            name="deliverables"
                                                            render={({ field }) => {
                                                                return (
                                                                <FormItem key={item.id} className={cn("flex flex-row items-center space-x-3 space-y-0 p-3 rounded-md border transition-all", field.value?.includes(item.id) ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted/50')}>
                                                                    <FormControl>
                                                                        <div className="relative flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                                                checked={field.value?.includes(item.id)}
                                                                                onChange={(e) => {
                                                                                    return e.target.checked
                                                                                    ? field.onChange([...field.value, item.id])
                                                                                    : field.onChange(field.value?.filter((value) => value !== item.id))
                                                                                }}
                                                                            />
                                                                            {item.id.startsWith('ugc_') && (
                                                                                <TooltipProvider>
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger asChild>
                                                                                            <Info className="h-3 w-3 text-muted-foreground ml-2 cursor-help" />
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent>
                                                                                            <p>{t('createCampaignPage.deliverables.ugc.tooltip')}</p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            )}
                                                                        </div>
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal flex-1 cursor-pointer">
                                                                        {item.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                     />
                                </div>
                            )}
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
                             {/* The numberOfCreators field is not editable once set */}
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full" size="lg">
                {form.formState.isSubmitting ? t('editCampaignPage.savingButton') : t('editCampaignPage.saveButton')}
                </Button>
            </form>
            </Form>
      </div>
    </>
  );
}
