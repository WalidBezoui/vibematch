
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, TrendingUp, Wallet, Plus } from 'lucide-react';
import * as lucideIcons from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const floatingVariants = {
  float: (delay: number = 0) => ({
    y: ['-6px', '6px'],
    transition: {
      duration: 3 + delay * 1.5,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut',
      delay,
    },
  }),
};

export function AnimatedDashboardMockup() {
    const isMobile = useIsMobile();
  
    const animationProps = (delay: number) => isMobile ? {} : {
        custom: delay,
        variants: floatingVariants,
        animate: "float",
    };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-lg aspect-[4/3]">

            {/* Verified Creator Card (Top-Left) */}
            <motion.div
                className="absolute w-[45%] top-[10%] left-[5%] z-20"
                {...animationProps(0.2)}
            >
                <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-xl p-3 md:p-4 h-full flex flex-col justify-center">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Verified Creator</p>
                    <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                        <Avatar className="w-8 h-8 md:w-12 md:h-12 border">
                            <AvatarImage src="https://i.pravatar.cc/150?img=4" alt="Sofia E." />
                            <AvatarFallback>SE</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-sm md:text-lg">Sofia E.</p>
                        </div>
                    </div>
                    <div className="mt-2 md:mt-4">
                        <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400 font-semibold text-xs md:text-sm px-2 py-1">
                            <ShieldCheck className="h-4 w-4 mr-1.5"/> Trust Score: 98
                        </Badge>
                    </div>
                </Card>
            </motion.div>
            
            {/* Campaign Success Card (Top-Right) */}
            <motion.div
                className="absolute w-[40%] top-[20%] right-[5%] z-10"
                {...animationProps(0.6)}
            >
                <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-xl p-3 md:p-4 h-full text-center flex flex-col justify-center">
                    <p className="text-[10px] md:text-sm font-medium text-muted-foreground">Campaign ROI</p>
                    <p className="text-3xl md:text-5xl font-black text-green-500 mt-1 flex items-center justify-center gap-2">
                        <TrendingUp className="h-6 w-6 md:h-8 md:w-8" />
                        125%
                    </p>
                </Card>
            </motion.div>

            {/* Funds Secured Card (Bottom-Center) */}
             <motion.div
                className="absolute w-[55%] bottom-[15%] left-[22.5%] z-30"
                {...animationProps(0.4)}
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
    </div>
  );
}


export function AnimatedBrandPainpoint() {
    const isMobile = useIsMobile();
  
    return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
             <div className="relative w-full max-w-md aspect-video">
                 <motion.div
                    className="absolute w-[40%] top-0 left-0 z-20"
                    custom={0.4}
                    variants={isMobile ? undefined : floatingVariants}
                    animate="float"
                >
                    <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg p-3">
                        <p className="text-xs text-muted-foreground">Campaign ROI</p>
                        <p className="text-lg font-bold text-green-500">+125%</p>
                    </Card>
                </motion.div>

                <motion.div
                    className="absolute w-[50%] top-[15%] right-0 z-20"
                    custom={0.8}
                    variants={isMobile ? undefined : floatingVariants}
                    animate="float"
                >
                     <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg p-3 flex items-center gap-3">
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
                
                <motion.div
                    className="absolute w-[65%] h-[80%] left-[17.5%] top-[20%] z-10 p-4"
                    custom={0}
                    variants={isMobile ? undefined : floatingVariants}
                    animate="float"
                >
                    <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-2xl h-full w-full flex flex-col">
                        <CardHeader className="p-3 md:p-4">
                            <CardTitle className="text-sm md:text-base flex items-center gap-2">
                                <lucideIcons.BarChart className="h-4 w-4 text-primary" />
                                Campaign Dashboard
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 md:p-4 space-y-2 md:space-y-4 flex flex-col flex-grow">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Total Engagement</p>
                                <p className="text-lg md:text-xl font-bold">1.2M</p>
                            </div>
                            <div className="flex-grow flex gap-1 md:gap-2 items-end">
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
        </div>
    );
}


export function AnimatedCreatorPainpoint() {
    const isMobile = useIsMobile();
  
    return (
        <div className="relative w-full min-h-[350px] flex items-center justify-center">
            <motion.div
                className="absolute top-0 left-0 z-20 w-3/5 max-w-[240px]"
                custom={1}
                variants={isMobile ? undefined : floatingVariants}
                animate="float"
            >
                <Card className="bg-background/80 dark:bg-background/80 backdrop-blur-xl shadow-lg p-3">
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
  const [isPaid, setIsPaid] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsPaid(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="flex justify-between w-full max-w-sm">
        <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-br from-muted to-background rounded-full flex items-center justify-center shadow-inner-lg border">
                <lucideIcons.Building className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold">Brand</p>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-br from-muted to-background rounded-full flex items-center justify-center shadow-inner-lg border">
                <lucideIcons.User className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold">Creator</p>
        </div>
      </div>
      <div className="relative w-full max-w-sm h-32 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-72 bg-gradient-to-tr from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl p-6"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-400">Escrow Balance</p>
                        <p className="text-3xl font-bold">7,500 DH</p>
                    </div>
                    <div
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-500",
                            isPaid
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                        )}
                    >
                        {isPaid ? <lucideIcons.CheckCircle className="h-3 w-3" /> : <lucideIcons.Lock className="h-3 w-3" />}
                        {isPaid ? 'RELEASED' : 'LOCKED'}
                    </div>
                </div>
                <div className="h-px bg-white/10 my-4"></div>
                <p className="text-xs text-gray-500">Funds released upon campaign completion.</p>
            </motion.div>
      </div>
    </div>
  )
}
