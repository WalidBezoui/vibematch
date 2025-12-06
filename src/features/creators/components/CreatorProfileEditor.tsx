
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirebase, useUserProfile } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User, MapPin, Edit, ImageIcon, Tag, Type, Lightbulb, Briefcase, Award, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { useNicheTranslation } from '@/hooks/use-niche-translation';


const creatorProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name is required.'),
  location: z.string().min(2, 'Location is required.'),
  bio: z.string().max(500, 'Bio must be 500 characters or less.').optional(),
  tags: z.array(z.string()).min(1, "Please select at least one tag."),
  photoURL: z.string().url().optional().or(z.literal('')),
});

type CreatorProfileFormValues = z.infer<typeof creatorProfileSchema>;

const AdminBadgeDisplay = ({ badge }: { badge: string }) => {
    if (!badge || badge === 'NONE') return null;

    const badgeInfo: { [key: string]: { style: string, text: string }} = {
        VERIFIED: { style: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Verified'},
        RISING_STAR: { style: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Rising Star'},
        TOP_RATED: { style: 'bg-green-100 text-green-800 border-green-200', text: 'Top Rated'},
    };
    
    const currentBadge = badgeInfo[badge];
    if (!currentBadge) return null;
    
    return (
        <Badge variant="secondary" className={cn(currentBadge.style)}>
            {currentBadge.text}
        </Badge>
    );
};


export default function CreatorProfileEditor({ profile }: { profile: any }) {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useLanguage();
  const { userProfile } = useUserProfile();
  const [motivationalTip, setMotivationalTip] = useState('');
  const { niches, getNicheLabel } = useNicheTranslation();


   const { nextStep, percentage } = useMemo(() => {
    if (!userProfile) return { percentage: 0, nextStep: { text: t('creatorProfile.steps.completeProfile'), icon: User } };
    
    const fields = [
        { key: 'photoURL', present: !!userProfile.photoURL, text: t('creatorProfile.steps.addPicture'), icon: ImageIcon },
        { key: 'displayName', present: !!userProfile.displayName, text: t('creatorProfile.steps.addName'), icon: User },
        { key: 'location', present: !!userProfile.location, text: t('creatorProfile.steps.addLocation'), icon: MapPin },
        { key: 'tags', present: userProfile.tags && userProfile.tags.length > 0, text: t('creatorProfile.steps.addTag'), icon: Tag },
        { key: 'bio', present: !!userProfile.bio, text: t('creatorProfile.steps.addBio'), icon: Type },
    ];

    const completedFields = fields.filter(f => f.present).length;
    const totalFields = fields.length;
    
    const percentage = 30 + Math.round((completedFields / totalFields) * 70);

    const firstIncompleteStep = fields.find(f => !f.present);
    const nextStep = firstIncompleteStep || { text: t('creatorProfile.steps.complete'), icon: User };

    return { percentage, nextStep };
  }, [userProfile, t]);

  useEffect(() => {
    const tips = t('creatorProfile.completionTips', { returnObjects: true }) as string[];
    if (tips && tips.length > 0) {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setMotivationalTip(tips[randomIndex]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);


  const form = useForm<CreatorProfileFormValues>({
    resolver: zodResolver(creatorProfileSchema),
    defaultValues: {
      displayName: profile.displayName || profile.name?.split(' ')[0] || '',
      location: profile.location || '',
      bio: profile.bio || '',
      tags: profile.tags || [],
      photoURL: profile.photoURL || '',
    },
  });
  
  const handleCancel = () => {
    form.reset({
      displayName: profile.displayName || profile.name?.split(' ')[0] || '',
      location: profile.location || '',
      bio: profile.bio || '',
      tags: profile.tags || [],
      photoURL: profile.photoURL || '',
    });
    setIsEditing(false);
  }

  const onSubmit = async (data: CreatorProfileFormValues) => {
    if (!user || !firestore) return;

    const userDocRef = doc(firestore, 'users', user.uid);
     const updateData = {
        displayName: data.displayName,
        location: data.location,
        bio: data.bio,
        tags: data.tags,
        photoURL: data.photoURL,
    };

    try {
      await updateDoc(userDocRef, updateData);
      toast({
        title: t('creatorProfile.toast.success.title'),
        description: t('creatorProfile.toast.success.description'),
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('creatorProfile.toast.error.title'),
        description: error.message || t('creatorProfile.toast.error.description'),
      });
    }
  };

  const photoToDisplay = form.watch('photoURL') || profile.photoURL;
  
  if (!isEditing) {
      return (
        <div className="space-y-8">
            {percentage < 100 && (
                 <Card className="bg-secondary/50 border-primary/20">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <span className="text-primary">{t('creatorProfile.nextStepTitle')}</span>
                        </CardTitle>
                         <CardDescription>
                            {nextStep.text}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-3 text-sm text-muted-foreground bg-background/50 p-3 rounded-lg">
                            <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>{motivationalTip}</span>
                        </div>
                    </CardContent>
                </Card>
            )}
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <div className="relative group">
                                <Avatar className="w-32 h-32 border-4">
                                    <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                                    <AvatarFallback className="text-4xl bg-muted">
                                    {profile.displayName?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-background/50 backdrop-blur group-hover:bg-background transition-colors shadow-md opacity-0 group-hover:opacity-100">
                                    <Upload className="h-5 w-5" />
                                    <span className="sr-only">Change Photo</span>
                                </Button>
                            </div>
                            <CardTitle>{profile.displayName}</CardTitle>
                            {profile.tags && profile.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 justify-center pt-2">
                                    {profile.tags.slice(0, 3).map((tag: string) => (
                                        <Badge key={tag} variant="secondary" className="font-normal">{getNicheLabel(tag)}</Badge>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                                <MapPin className="h-4 w-4" />
                                <span>{profile.location}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="text-center">
                            <AdminBadgeDisplay badge={profile.adminBadge} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-muted-foreground">{t('creatorProfile.stats.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-black">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{t('creatorProfile.stats.newTalent')}</p>
                                    <p className="text-sm text-muted-foreground">{t('creatorProfile.stats.campaignsCompleted')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-black">
                                    <CalendarDays className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                                    <p className="text-sm text-muted-foreground">{t('creatorProfile.stats.joined')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{t('creatorProfile.publicProfile.title')}</CardTitle>
                                <CardDescription>{t('creatorProfile.publicProfile.description')}</CardDescription>
                            </div>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <Edit className="mr-2 h-4 w-4" /> {t('creatorProfile.publicProfile.editButton')}
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-muted-foreground">{t('creatorProfile.publicProfile.bioLabel')}</h4>
                                <p className="text-foreground/90 whitespace-pre-wrap">{profile.bio || t('creatorProfile.publicProfile.noBio')}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('creatorProfile.portfolio.title')}</CardTitle>
                            <CardDescription>{t('creatorProfile.portfolio.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">{t('creatorProfile.portfolio.empty')}</p>
                                <Button variant="outline" className="mt-4">
                                    <Briefcase className="mr-2 h-4 w-4" /> {t('creatorProfile.portfolio.addButton')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      )
  }

  // EDITING MODE
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
         <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 space-y-6">
                 <h2 className="text-xl font-semibold">{t('creatorProfile.edit.title')}</h2>
            </div>
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('creatorProfile.edit.cardTitle')}</CardTitle>
                        <CardDescription>{t('creatorProfile.edit.cardDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="displayName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('creatorProfile.edit.nameLabel')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('creatorProfile.edit.namePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('creatorProfile.edit.locationLabel')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('creatorProfile.edit.locationPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                        
                         <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t('creatorProfile.edit.tagsLabel')}</FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {niches.map((niche) => (
                                        <FormItem key={niche.id} className="flex-1">
                                          <FormControl>
                                            <button 
                                              type="button"
                                              onClick={() => {
                                                const currentTags = field.value || [];
                                                const newTags = currentTags.includes(niche.id)
                                                  ? currentTags.filter(t => t !== niche.id)
                                                  : [...currentTags, niche.id];
                                                field.onChange(newTags);
                                              }}
                                              className={cn(
                                                "group flex flex-col items-center justify-center w-full h-full p-4 rounded-lg border-2 text-center transition-all duration-300",
                                                field.value.includes(niche.id)
                                                  ? 'border-primary bg-primary/10' 
                                                  : 'border-border hover:border-primary/50'
                                              )}
                                            >
                                              <span className="material-symbols-outlined !text-4xl mb-2 transition-colors duration-300 group-hover:text-primary"
                                                style={{fontVariationSettings: "'FILL' 0, 'wght' 300"}}>
                                                {niche.icon}
                                              </span>
                                              <span className={cn(
                                                "font-semibold text-sm",
                                                field.value.includes(niche.id) ? 'text-primary' : 'text-foreground/80'
                                              )}>
                                                {niche.label}
                                              </span>
                                            </button>
                                          </FormControl>
                                        </FormItem>
                                      ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t('creatorProfile.edit.bioLabel')}</FormLabel>

                                <FormControl>
                                    <Textarea rows={5} placeholder={t('creatorProfile.edit.bioPlaceholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
                         <Button type="button" variant="ghost" onClick={handleCancel}>{t('creatorProfile.edit.cancelButton')}</Button>
                         <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? t('creatorProfile.edit.savingButton') : t('creatorProfile.edit.saveButton')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </form>
    </Form>
  );
}

    

    