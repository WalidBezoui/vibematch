'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BrandWaitlistPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/brands/join/success');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F5F5F7] dark:bg-[#101922] p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary rounded-full opacity-50 blur-3xl"></div>
      </div>
      <div className="z-10 flex h-full grow flex-col items-center justify-center">
        <div className="flex w-full max-w-lg flex-1 flex-col items-center justify-center text-center">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#1D1D1F] dark:text-white">
                Soyez les Premiers à Découvrir{' '}
                <span className="text-primary">VibeMatch</span>.
              </p>
              <p className="mx-auto max-w-md text-base font-normal leading-normal text-[#617589] dark:text-gray-300">
                Rejoignez notre liste d'attente exclusive pour les marques et
                découvrez une manière plus transparente et efficace de
                collaborer avec les influenceurs.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col text-left">
                  <Label
                    htmlFor="name"
                    className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white"
                  >
                    Nom
                  </Label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <Label
                    htmlFor="email"
                    className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Votre email"
                    className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <Label
                  htmlFor="company"
                  className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white"
                >
                  Nom de l'entreprise
                </Label>
                <Input
                  id="company"
                  placeholder="Nom de votre entreprise"
                  className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white"
                />
              </div>
              <div className="flex flex-col text-left">
                <Label
                  htmlFor="ice"
                  className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white"
                >
                  ICE
                </Label>
                <Input
                  id="ice"
                  placeholder="Votre numéro ICE"
                  className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col text-left">
                  <Label
                    htmlFor="phone"
                    className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white"
                  >
                    Téléphone (Maroc)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="06 XX XX XX XX"
                    className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <Label
                    htmlFor="city"
                    className="pb-2 text-base font-medium leading-normal text-[#1D1D1F] dark:text-white"
                  >
                    Ville (Maroc)
                  </Label>
                  <Input
                    id="city"
                    placeholder="Votre ville"
                    className="h-14 rounded-xl border-[#dbe0e6] bg-white p-[15px] text-base font-normal leading-normal text-[#1D1D1F] placeholder:text-[#617589] focus:border-primary focus:ring-2 focus:ring-primary/50 dark:bg-[#101922] dark:text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center pt-4">
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-black hover:bg-primary/90 active:bg-primary/80"
                >
                  Rejoindre la liste d'attente
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
