
'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BarChart, ShieldCheck, Home, Compass, MessageSquare, Settings, Wallet, Building, User, TrendingUp, MoreHorizontal, Activity, FileText } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const floatingVariants = {
  float: (delay: number = 0) => ({
    y: ['-10px', '10px'],
    transition: {
      duration: 3 + delay * 2,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut',
      delay,
    },
  }),
};

export function AnimatedDashboardMockup() {
  const isMobile = useIsMobile();
  const animationProps = isMobile ? {} : {
    custom: 0,
    variants: floatingVariants,
    animate: "float",
  };

  return (
    <motion.div
        className="w-full max-w-2xl h-[420px] bg-background/30 dark:bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-primary/10 overflow-hidden"
        {...animationProps}
      >
        <div className="h-8 border-b border-white/10 flex items-center px-3 gap-1.5">
          <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
        </div>
        <div className="flex h-[calc(100%-2rem)]">
            {/* Sidebar */}
            <div className="w-20 p-3 border-r border-white/10 flex flex-col items-center gap-4">
                <div className="w-10 h-10 gradient-bg rounded-lg"></div>
                <div className="space-y-6 pt-4">
                    <Home className="h-6 w-6 text-white" />
                    <Compass className="h-6 w-6 text-white/40" />
                    <MessageSquare className="h-6 w-6 text-white/40" />
                    <Settings className="h-6 w-6 text-white/40 mt-12" />
                </div>
            </div>
            {/* Content */}
            <div className="flex-1 p-4">
                <div className="h-full w-full">
                    <div className="space-y-4 pr-2">
                        <div className="flex items-center justify-between">
                            <div className="h-8 w-48 bg-white/10 rounded-md"></div>
                            <div className="h-8 w-24 bg-primary/20 rounded-full"></div>
                        </div>
                        
                         <div className="h-24 w-full bg-white/5 rounded-lg mt-4 p-3 space-y-3">
                           <div className="flex items-center justify-between">
                               <div className="h-4 w-1/2 bg-white/10 rounded-md"></div>
                               <div className="h-5 w-16 bg-green-500/20 rounded-full"></div>
                           </div>
                           <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                <div className="h-4 flex-1 bg-white/10 rounded-md"></div>
                           </div>
                        </div>
                         <div className="h-24 w-full bg-white/5 rounded-lg mt-4 p-3 space-y-3">
                           <div className="flex items-center justify-between">
                               <div className="h-4 w-1/3 bg-white/10 rounded-md"></div>
                               <div className="h-5 w-20 bg-yellow-500/20 rounded-full"></div>
                           </div>
                           <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                <div className="h-4 flex-1 bg-white/10 rounded-md"></div>
                           </div>
                        </div>
                         <div className="h-24 w-full bg-white/5 rounded-lg mt-4 p-3 space-y-3">
                           <div className="flex items-center justify-between">
                               <div className="h-4 w-2/5 bg-white/10 rounded-md"></div>
                               <div className="h-5 w-16 bg-indigo-500/20 rounded-full"></div>
                           </div>
                           <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                <div className="h-4 flex-1 bg-white/10 rounded-md"></div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
  );
}

export function AnimatedBrandPainpoint() {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full min-h-[350px] flex items-center justify-center">
        {/* Floating Cards */}
        <motion.div
            className="absolute top-0 left-0 z-20"
            custom={0.8}
            variants={isMobile ? undefined : floatingVariants}
            animate="float"
        >
            <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg p-3 w-48">
                <p className="text-xs text-muted-foreground">Campaign ROI</p>
                <p className="text-lg font-bold text-green-500">+125%</p>
            </Card>
        </motion.div>

        <motion.div
            className="absolute top-8 right-0 z-20"
            custom={0.4}
            variants={isMobile ? undefined : floatingVariants}
            animate="float"
        >
            <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg p-3 flex items-center gap-3 w-56">
                <Avatar className="w-10 h-10 border">
                    <AvatarImage src="https://i.pravatar.cc/150?img=4" alt="Sofia E." />
                    <AvatarFallback>SE</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-bold text-sm">Sofia E.</p>
                    <Badge variant="outline" className="border-green-500 text-green-500">Selected</Badge>
                </div>
            </Card>
        </motion.div>

        {/* Main Card */}
        <motion.div
            className="relative z-10 w-full max-w-sm"
            custom={0}
            variants={isMobile ? undefined : floatingVariants}
            animate="float"
        >
            <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg w-full">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-primary" />
                        Campaign Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Total Engagement</p>
                        <p className="text-xl font-bold">1.2M</p>
                    </div>
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
    </div>
  );
}


export function AnimatedCreatorPainpoint() {
    const isMobile = useIsMobile();
  
    return (
        <div className="relative w-full min-h-[350px] flex items-center justify-center">
            <motion.div
                className="absolute top-0 left-0 z-20"
                custom={1}
                variants={isMobile ? undefined : floatingVariants}
                animate="float"
            >
                <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg p-3 w-60">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="Nike" />
                            <AvatarFallback>N</AvatarFallback>
                        </Avatar>
                        <p className="font-bold text-sm">Nike</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Invited you to a campaign</p>
                </Card>
            </motion.div>

             <motion.div
                className="relative z-10 w-full max-w-sm"
                custom={0.2}
                variants={isMobile ? undefined : floatingVariants}
                animate="float"
            >
                <Card className="bg-green-500/90 text-white backdrop-blur-xl shadow-lg shadow-green-500/30 w-full">
                    <CardHeader className="p-4">
                        <div className="flex items-center gap-3">
                            <Wallet className="h-6 w-6" />
                            <CardTitle className="text-lg">Funds Secured</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-4xl font-black">7,500 DH</p>
                        <p className="text-sm opacity-80 mt-1">Ready for withdrawal</p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export function AnimatedEscrow() {
  const brandVariants = {
    animate: {
      x: ['-50%', '50%'],
      opacity: [1, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 2.5 }
    }
  }
  const creatorVariants = {
    animate: {
      x: ['-50%', '50%'],
      opacity: [1, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: "linear", delay: 2.5, repeatDelay: 2.5 }
    }
  }
  const shieldVariants = {
    animate: {
      scale: [1, 1.2, 1, 1.2, 1],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    }
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="flex justify-between w-full max-w-sm">
        <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-br from-muted to-background rounded-full flex items-center justify-center shadow-inner-lg border">
                <Building className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold">Brand</p>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-br from-muted to-background rounded-full flex items-center justify-center shadow-inner-lg border">
                <User className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold">Creator</p>
        </div>
      </div>
      <div className="relative w-full max-w-xs h-16 flex items-center justify-center">
          <motion.div variants={shieldVariants} animate="animate" className="z-10 w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-black shadow-lg shadow-primary/40">
            <ShieldCheck className="h-10 w-10"/>
          </motion.div>
          <div className="absolute w-full h-1 bg-muted rounded-full overflow-hidden">
              <motion.div variants={brandVariants} animate="animate" className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-l from-primary" />
              <motion.div variants={creatorVariants} animate="animate" className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary" />
          </div>
      </div>
    </div>
  )
}

export function FloatingProfileCard() {
    const isMobile = useIsMobile();
    const animationProps = isMobile ? {} : {
        custom: 0.3,
        variants: floatingVariants,
        animate: "float",
    };
    return (
        <motion.div {...animationProps}>
            <Card className="p-3 bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg w-60">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/50">
                        <AvatarImage src="https://i.pravatar.cc/150?img=8" />
                        <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p className="font-bold">Amine K.</p>
                        <div className="flex items-center gap-1.5 text-xs text-green-500 font-semibold">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Trust Score: 96</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

export function FloatingStatCard() {
    const isMobile = useIsMobile();
    const animationProps = isMobile ? {} : {
        custom: 0.6,
        variants: floatingVariants,
        animate: "float",
    };
    return (
        <motion.div {...animationProps}>
            <Card className="p-3 bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg w-48">
                <p className="text-xs text-muted-foreground flex items-center justify-between">
                    Engagement Rate <TrendingUp className="h-4 w-4 text-green-500" />
                </p>
                <p className="text-2xl font-bold">5.8%</p>
                <div className="flex gap-1 items-end h-8 mt-1">
                    <div className="h-[30%] w-full bg-primary/20 rounded-t-sm"></div>
                    <div className="h-[50%] w-full bg-primary/20 rounded-t-sm"></div>
                    <div className="h-[80%] w-full bg-primary/20 rounded-t-sm"></div>
                    <div className="h-[60%] w-full bg-primary rounded-t-sm"></div>
                </div>
            </Card>
        </motion.div>
    );
}
