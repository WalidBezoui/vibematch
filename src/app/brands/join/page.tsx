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
        <footer className="z-10 mt-12 w-full max-w-lg text-center text-sm text-[#617589] dark:text-gray-400">
          <div className="mb-4 flex justify-center space-x-6">
            <a
              href="#"
              className="transition-colors duration-200 hover:text-primary"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              className="transition-colors duration-200 hover:text-primary"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a
              href="#"
              className="transition-colors duration-200 hover:text-primary"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12.011c0 4.432 2.865 8.18 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.06.069-.06 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12.011C22 6.477 17.523 2 12 2z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
          <p>© 2024 VibeMatch. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  );
}
