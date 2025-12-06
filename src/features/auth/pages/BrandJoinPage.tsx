'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PromoBanner } from '@/components/promo-banner';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import { useFirestore, useAuth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { signInAnonymously } from 'firebase/auth';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const brandApplicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  company: z.string().min(2, 'Company name must be at least 2 characters.'),
  ice: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
});

type BrandApplicationForm = z.infer<typeof brandApplicationSchema>;

export default function BrandWaitlistPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<BrandApplicationForm>({
    resolver: zodResolver(brandApplicationSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      ice: '',
      phone: '',
      city: '',
    },
  });

  const onSubmit: SubmitHandler<BrandApplicationForm> = async (data) => {
    if (!firestore || !auth) return;
    
    try {
      await signInAnonymously(auth); // Wait for anonymous sign-in
      const collectionRef = collection(firestore, 'brand-applications');
      const submissionData = {
        ...data,
        createdAt: serverTimestamp(),
      };
      
      // Use non-blocking write for better UX
      addDocumentNonBlocking(collectionRef, submissionData);
      
      router.push('/brands/join/success');
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message || "Could not submit your application.",
      });
    }
  };

  return (
    <>
      <PromoBanner />
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary rounded-full opacity-50 blur-3xl"></div>
        </div>
        <div className="z-10 flex h-full grow flex-col items-center justify-center">
          <div className="flex w-full max-w-lg flex-1 flex-col items-center justify-center text-center">
            <div className="flex w-full flex-col gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#1D1D1F] dark:text-white">
                  {t('brandJoinPage.title.part1')}{' '}
                  <span className="text-primary">VibeMatch</span>.
                </p>
                <p className="mx-auto max-w-md text-base font-normal leading-normal text-[#617589] dark:text-gray-300">
                  {t('brandJoinPage.description')}
                </p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel htmlFor="name" className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white">
                            {t('brandJoinPage.form.name.label')}
                          </FormLabel>
                          <FormControl>
                            <Input id="name" placeholder={t('brandJoinPage.form.name.placeholder')} {...field} className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel htmlFor="email" className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white">
                            {t('brandJoinPage.form.email.label')}
                          </FormLabel>
                          <FormControl>
                            <Input id="email" type="email" placeholder={t('brandJoinPage.form.email.placeholder')} {...field} className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel htmlFor="company" className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white">
                          {t('brandJoinPage.form.company.label')}
                        </FormLabel>
                        <FormControl>
                          <Input id="company" placeholder={t('brandJoinPage.form.company.placeholder')} {...field} className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ice"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel htmlFor="ice" className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white">
                          {t('brandJoinPage.form.ice.label')}
                        </FormLabel>
                        <FormControl>
                          <Input id="ice" placeholder={t('brandJoinPage.form.ice.placeholder')} {...field} className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel htmlFor="phone" className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white">
                            {t('brandJoinPage.form.phone.label')}
                          </FormLabel>
                          <FormControl>
                            <Input id="phone" type="tel" placeholder={t('brandJoinPage.form.phone.placeholder')} {...field} className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel htmlFor="city" className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white">
                            {t('brandJoinPage.form.city.label')}
                          </FormLabel>
                          <FormControl>
                            <Input id="city" placeholder={t('brandJoinPage.form.city.placeholder')} {...field} className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-center pt-4">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="h-12 w-full rounded-xl bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-black hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50"
                    >
                      {form.formState.isSubmitting ? t('brandJoinPage.form.submittingButton') : t('brandJoinPage.form.submitButton')}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
