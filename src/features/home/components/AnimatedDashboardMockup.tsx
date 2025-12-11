
'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BarChart, ShieldCheck, Home, Compass, MessageSquare, Settings, Wallet } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const floatingVariants = {
  float: (delay: number = 0) => ({
    y: ['-10px', '10px'],
    transition: {
      duration: 4 + delay * 2,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut',
      delay,
    },
  }),
};

export function AnimatedDashboardMockup() {
  const { t } = useLanguage();
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main Window */}
      <motion.div
        className="w-full max-w-xl h-96 bg-background/30 dark:bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-primary/10 overflow-hidden"
        custom={0}
        variants={floatingVariants}
        animate="float"
      >
        <div className="h-8 border-b border-white/10 flex items-center px-3 gap-1.5">
          <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
        </div>
        <div className="flex h-[calc(100%-2rem)]">
            {/* Sidebar */}
            <div className="w-20 p-2 border-r border-white/10 flex flex-col items-center gap-4">
                <div className="w-8 h-8 gradient-bg rounded-lg"></div>
                <div className="space-y-4">
                    <Home className="h-6 w-6 text-white/80" />
                    <Compass className="h-6 w-6 text-white/40" />
                    <MessageSquare className="h-6 w-6 text-white/40" />
                    <Settings className="h-6 w-6 text-white/40 mt-8" />
                </div>
            </div>
            {/* Content */}
            <div className="flex-1 p-4 overflow-hidden">
                <div className="h-full w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="space-y-4">
                        <div className="h-8 w-48 bg-white/10 rounded-md"></div>
                        <div className="h-4 w-64 bg-white/5 rounded-md"></div>
                        <div className="h-24 w-full bg-white/5 rounded-lg mt-6"></div>
                        <div className="h-24 w-full bg-white/5 rounded-lg"></div>
                        <div className="h-24 w-full bg-white/5 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>

      {/* Campaign Card */}
      <motion.div
        className="absolute -top-10 -left-10 w-64"
        custom={0.5}
        variants={floatingVariants}
        animate="float"
      >
        <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart className="h-4 w-4 text-primary" />
              Campaign Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-end h-20">
                <div className="h-[40%] w-full bg-primary/20 rounded-t-sm"></div>
                <div className="h-[60%] w-full bg-primary/20 rounded-t-sm"></div>
                <div className="h-[80%] w-full bg-primary rounded-t-sm"></div>
                <div className="h-[50%] w-full bg-primary/20 rounded-t-sm"></div>
                <div className="h-[70%] w-full bg-primary/20 rounded-t-sm"></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Influencer Card */}
      <motion.div
        className="absolute -bottom-16 left-0 w-72"
        custom={0.2}
        variants={floatingVariants}
        animate="float"
      >
        <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg">
          <CardContent className="p-4 flex items-center gap-4">
            <Avatar className="w-16 h-16 border">
              <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Ghita A." />
              <AvatarFallback>GA</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-bold">Ghita A.</p>
              <div className="flex items-center gap-2 text-green-600">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">{t('discoverCreators.trustScore')}: 92</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Payment Card */}
       <motion.div
        className="absolute bottom-16 -right-16 w-52"
        custom={0.8}
        variants={floatingVariants}
        animate="float"
      >
        <Card className="bg-green-500/90 text-white backdrop-blur-xl shadow-lg shadow-green-500/30">
          <CardHeader className="p-3">
              <div className="flex items-center gap-2">
                 <Wallet className="h-5 w-5" />
                <CardTitle className="text-sm">Payment Secured</CardTitle>
              </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
              <p className="text-2xl font-black">5,000 DH</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
