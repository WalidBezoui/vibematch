
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Lock, Shield, CheckCircle, XCircle, Info, Bot, Handshake, Hourglass, CircleDollarSign, PartyPopper, User, Briefcase, ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';
import { useDoc, useCollection, useFirestore, useUser, useUserProfile, useMemoFirebase } from '@/firebase';
import { doc, collection, query, addDoc, serverTimestamp, updateDoc, orderBy, getDoc, writeBatch } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CreatorProfileSheet } from '@/features/creators';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/language-context';


const DealStatusHeader = ({ conversation, campaign, onOpenProfile, otherUser, onBack }: { conversation: any, campaign: any, onOpenProfile: () => void, otherUser: any, onBack: () => void }) => {
    const { user } = useUser();
    const { userProfile } = useUserProfile();
    const router = useRouter();
    const { t, dir } = useLanguage();
    
    const isBrand = userProfile?.role === 'brand';
    const Arrow = dir === 'rtl' ? ArrowRight : ArrowLeft;
    
    const handleFund = () => {
        router.push(`/campaigns/${conversation.campaign_id}/pay`)
    }
    
    const getStatusInfo = () => {
        const isMyTurn = conversation.last_offer_by !== user?.uid;
        
        switch (conversation.status) {
            case 'NEGOTIATION':
                let text = isMyTurn
                    ? t('chat.status.yourResponse')
                    : (isBrand ? t('chat.status.waitingForCreator') : t('chat.status.brandReviewing'));
                
                return { icon: Handshake, text, color: 'text-amber-800 dark:text-amber-200', bgColor: 'bg-amber-100/50 dark:bg-amber-900/20' };

            case 'OFFER_ACCEPTED':
                 return { icon: Handshake, text: isBrand ? t('chat.status.fund') : t('chat.status.awaitingFunds'), color: 'text-blue-800 dark:text-blue-200', bgColor: 'bg-blue-100/50 dark:bg-blue-900/20' };
            
            case 'ACTIVE':
                 if (campaign?.status === 'PENDING_PAYMENT') {
                     return { icon: Hourglass, text: t('chat.status.offerAccepted'), color: 'text-blue-800 dark:text-blue-200', bgColor: 'bg-blue-100/50 dark:bg-blue-900/20' };
                }
                return { icon: Shield, text: t('chat.status.fundsSecured'), color: 'text-green-800 dark:text-green-200', bgColor: 'bg-green-100/50 dark:bg-green-900/20' };
            case 'REVIEW':
                 return { icon: Info, text: t('chat.status.review'), color: 'text-purple-800 dark:text-purple-200', bgColor: 'bg-purple-100/50 dark:bg-purple-900/20' };
            case 'COMPLETED':
                return { icon: PartyPopper, text: t('chat.status.completed'), color: 'text-gray-800 dark:text-gray-200', bgColor: 'bg-gray-100/50 dark:bg-gray-800/20' };
            case 'CANCELLED':
                 return { icon: XCircle, text: t('chat.status.cancelled'), color: 'text-red-800 dark:text-red-200', bgColor: 'bg-red-100/50 dark:bg-red-900/20' };
            default:
                return { icon: Info, text: `${t('chat.status.status')}: ${conversation.status}`, color: 'text-gray-800 dark:text-gray-200', bgColor: 'bg-gray-100/50 dark:bg-gray-800/20' };
        }
    }

    const { icon: Icon, text, color, bgColor } = getStatusInfo();
    
    let budgetLabel = conversation.status === 'NEGOTIATION' ? t('chat.budget.lastOffer') : t('chat.budget.agreed');
    if(conversation.status === 'NEGOTIATION' && conversation.last_offer_by !== user?.uid) {
        budgetLabel = t('chat.budget.theirOffer');
    }

    return (
        <div className="border-b bg-background">
            <div className="p-3 sm:p-4 flex items-center gap-4">
                 <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={onBack}>
                        <Arrow className="h-5 w-5" />
                    </Button>
                     {isBrand && otherUser ? (
                        <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={otherUser.photoURL} alt={otherUser.name} />
                                <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{otherUser.displayName || otherUser.name}</p>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary" onClick={onOpenProfile}>{t('chat.viewProfile')}</Button>
                            </div>
                        </div>
                    ) : !isBrand && campaign ? (
                         <div className="flex items-center gap-3 min-w-0">
                              <div className="h-10 w-10 border rounded-md flex-shrink-0 items-center justify-center bg-card hidden sm:flex">
                                 <Briefcase className="h-5 w-5 text-muted-foreground"/>
                             </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{campaign.title}</p>
                                <p className="text-xs text-muted-foreground">{otherUser?.name || 'Brand'}</p>
                            </div>
                        </div>
                    ) : (
                         <Skeleton className="h-10 w-48" />
                    )}
                 </div>
                 
                <div className={cn("text-right", dir === 'rtl' && 'text-left')}>
                    <p className="text-xs font-semibold text-primary">{budgetLabel}</p>
                    <div className={cn("flex items-baseline gap-x-2", dir === 'rtl' ? 'justify-start' : 'justify-end')}>
                        <span className="font-bold text-primary text-lg">{conversation.agreed_budget || 0} MAD</span>
                        <span className="text-xs text-muted-foreground">/ {campaign?.budget || 0} MAD</span>
                    </div>
                </div>

            </div>
            
            <div className={cn("flex items-center justify-center gap-2 text-sm font-semibold p-2", color, bgColor)}>
                <Icon className="h-5 w-5" />
                <span>{text}</span>
            </div>

            {isBrand && (conversation.status === 'OFFER_ACCEPTED') && (
                <div className="p-3 border-t">
                    <Button size="sm" onClick={handleFund} disabled={!conversation.agreed_budget || conversation.agreed_budget <= 0} className="w-full">
                      <CircleDollarSign className="mr-2 h-4 w-4" /> {t('chat.fundEscrow')}
                    </Button>
                </div>
            )}
        </div>
    );
};


const MessageBubble = ({ message, isOwnMessage, senderProfile }: { message: any, isOwnMessage: boolean, senderProfile: any }) => {
    return (
        <div className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {!isOwnMessage && (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={senderProfile?.photoURL} />
                    <AvatarFallback>{senderProfile?.name?.[0] || '?'}</AvatarFallback>
                </Avatar>
            )}
            <div className={`p-3 rounded-lg max-w-lg ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                 {message.timestamp && (
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true })}
                    </p>
                )}
            </div>
        </div>
    );
};

const SystemCard = ({ message, onRespondToOffer }: { message: any, onRespondToOffer: (message: any, response: 'ACCEPTED' | 'REJECTED') => void }) => {
    const { userProfile } = useUserProfile();
    const { t } = useLanguage();

    // For the initial context message
    if (message.type === 'TEXT' && message.content.startsWith('Discussion opened for campaign:')) {
        const isCreator = userProfile?.role === 'creator';
        
        const contentRegex = /Discussion opened for campaign: "(.*)".\n\nCreator's opening offer is ([\d,.]+) MAD and their cover letter is:\n\n"(.*)"/s;
        const match = message.content.match(contentRegex);

        if (!match) return <MessageBubble message={message} isOwnMessage={false} senderProfile={{name: 'System'}}/>;

        const [, campaignTitle, offerAmount, coverLetter] = match;

        const cardTitle = isCreator
          ? `${t('chat.initialCard.titleCreator')} "${campaignTitle}"`
          : `${t('chat.initialCard.titleBrand')} "${campaignTitle}"`;
        
        const cardDescription = isCreator
          ? t('chat.initialCard.descriptionCreator')
          : `${t('chat.initialCard.descriptionBrand')} ${message.timestamp ? format(message.timestamp.toDate(), 'MMM d, yyyy') : ''}`;

        return (
            <div className="py-4">
                <Card className="max-w-md mx-auto bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg">{cardTitle}</CardTitle>
                        <CardDescription>
                            {cardDescription}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">
                                {isCreator ? t('chat.initialCard.yourOffer') : t('chat.initialCard.creatorOffer')}
                            </p>
                            <p className="text-xl font-bold gradient-text">{offerAmount} MAD</p>
                        </div>
                         {coverLetter && coverLetter.trim().length > 0 && (
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">{t('chat.initialCard.coverLetter')}</p>
                                <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap border p-3 rounded-md bg-background/50 break-words">{coverLetter}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (message.type === 'SYSTEM_OFFER') {
        const isMyTurnToRespond = message.metadata.offer_status === 'PENDING' && message.sender_id !== userProfile?.uid;
        const status = message.metadata.offer_status;
        
        let title, description;
        if (message.sender_id === userProfile?.uid) {
            title = t('chat.offerCard.yourOffer');
            description = t('chat.offerCard.youProposed');
        } else {
            title = t('chat.offerCard.offerReceived');
            description = t('chat.offerCard.theyProposed', { name: message.sender_name || t('chat.otherParty') });
        }

        return (
            <div className="py-4">
                <Card className={cn(
                    "max-w-sm mx-auto",
                     status === 'REJECTED' && 'bg-muted/30 border-dashed',
                     status === 'SUPERSEDED' && 'bg-muted/30 border-dashed',
                     status === 'ACCEPTED' && 'bg-green-50 dark:bg-green-900/20 border-green-500/30'
                )}>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className={cn(
                            "text-lg",
                            (status === 'REJECTED' || status === 'SUPERSEDED') && 'text-muted-foreground'
                        )}>{title}</CardTitle>
                        {message.timestamp && (
                            <p className="text-xs text-muted-foreground pt-1">
                                {format(message.timestamp.toDate(), 'MMM d, yyyy HH:mm')}
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div>
                            <p className={cn("text-muted-foreground text-sm", (status === 'REJECTED' || status === 'SUPERSEDED') && 'line-through')}>{description}</p>
                            <p className={cn("text-2xl font-bold", (status === 'REJECTED' || status === 'SUPERSEDED') && 'text-muted-foreground line-through')}>{message.metadata.offer_amount} MAD</p>
                        </div>
                        
                        {message.content && message.content.trim() && (
                            <div className="text-left bg-background/50 p-3 rounded-md border">
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <p className="italic">"{message.content}"</p>
                                </div>
                            </div>
                        )}

                        {isMyTurnToRespond && (
                            <div className="flex gap-2 pt-2">
                                <Button className="w-full" onClick={() => onRespondToOffer(message, 'ACCEPTED')}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> {t('chat.accept')}
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={() => onRespondToOffer(message, 'REJECTED')}>
                                    <XCircle className="mr-2 h-4 w-4" /> {t('chat.reject')}
                                </Button>
                            </div>
                        )}
                        {status === 'ACCEPTED' && <Badge className="mt-4 bg-green-100 text-green-800">{t('chat.accepted')}</Badge>}
                        {status === 'REJECTED' && <Badge variant="destructive" className="mt-4">{t('chat.rejected')}</Badge>}
                         {status === 'SUPERSEDED' && <Badge variant="outline" className="mt-4">{t('chat.superseded')}</Badge>}
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if(message.type === 'SYSTEM_ESCROW' || message.type === 'SYSTEM_EVENT') {
        const eventIcons: { [key: string]: React.ElementType } = {
          'accepté': CheckCircle,
          'funded': Shield,
        };
        
        const eventType = message.content.includes(t('chat.eventAccepted')) ? 'accepté' : message.content.includes(t('chat.eventFunded')) ? 'funded' : 'info';
        const Icon = eventIcons[eventType] || Info;

        return (
            <div className="py-4 text-center text-sm text-muted-foreground flex justify-center items-center gap-2">
                 <Icon className={cn("h-4 w-4", eventType === 'accepté' ? 'text-green-500' : 'text-blue-500')}/>
                 <p>{message.content}</p>
            </div>
        )
    }

    return null;
}

const MessageStream = ({ messages, conversation, onRespondToOffer }: { messages: any[], conversation: any, onRespondToOffer: (message: any, response: 'ACCEPTED' | 'REJECTED') => void }) => {
    const { user } = useUser();
    const [profiles, setProfiles] = useState<any>({});
    const firestore = useFirestore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const fetchProfiles = async () => {
            if (!firestore || !conversation) return;
            const participants = [conversation.brand_id, conversation.creator_id];
            const newProfiles: any = {};
            for (const pId of participants) {
                if (!profiles[pId]) {
                    const docRef = doc(firestore, 'users', pId);
                    const docSnap = await getDoc(docRef);
                    if(docSnap.exists()){
                        newProfiles[pId] = docSnap.data();
                    }
                }
            }
            setProfiles((prev: any) => ({...prev, ...newProfiles}));
        }
        fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation, firestore]);
    
    if(!messages) {
        return <div className="flex-1 p-6 space-y-4 overflow-y-auto" ref={scrollRef}>{t('chat.loadingMessages')}</div>
    }

    return (
        <div className="flex-1 p-6 space-y-4 overflow-y-auto" ref={scrollRef}>
            {messages.map((msg: any) => {
                 if (msg.type !== 'TEXT' || msg.content.startsWith('Discussion opened for campaign:')) {
                    return <SystemCard key={msg.id} message={msg} onRespondToOffer={onRespondToOffer} />
                 }
                return <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.sender_id === user?.uid} senderProfile={profiles[msg.sender_id]} />
            })}
        </div>
    );
};

const NewProposalForm = ({ onMakeOffer, setOpen }: { onMakeOffer: (amount: number, message: string) => void, setOpen?: (open: boolean) => void }) => {
    const [newOffer, setNewOffer] = useState('');
    const [message, setMessage] = useState('');
    const { t, dir } = useLanguage();
    const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  
    const handleSubmitOffer = () => {
      if (!newOffer || isNaN(parseFloat(newOffer)) || parseFloat(newOffer) <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
      onMakeOffer(parseFloat(newOffer), message || "Here is my new proposal for this campaign.");
      setNewOffer('');
      setMessage('');
      setOpen?.(false);
    };
  
    return (
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="budget">{t('chat.proposalForm.amount')}</Label>
          <Input id="budget" type="number" value={newOffer} onChange={(e) => setNewOffer(e.target.value)} />
          <Label htmlFor="message">{t('chat.proposalForm.message')}</Label>
          <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('chat.proposalForm.placeholder')}/>
          <Button onClick={handleSubmitOffer}>{t('chat.proposalForm.send')} <Arrow className={cn("h-4 w-4", dir === 'rtl' ? 'mr-2' : 'ml-2')} /></Button>
        </div>
      </div>
    );
  };
  
const ActionFooter = ({ conversation, messages, onMakeOffer, onAcceptOffer, onDecline }: { conversation: any, messages: any[], onMakeOffer: (amount: number, message: string) => void, onAcceptOffer: (amount: number) => void, onDecline: () => void }) => {
    const { user } = useUser();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const { t } = useLanguage();
    
    if (conversation.status !== 'NEGOTIATION') {
        return null;
    }

    const isMyTurn = conversation.last_offer_by !== user?.uid;

    if (!isMyTurn) {
        return (
            <div className="p-4 bg-background border-t text-center text-sm text-muted-foreground">
                {t('chat.waitingResponse')}
            </div>
        )
    }
    
    const lastOfferMessage = messages?.filter((m: any) => m.type === 'SYSTEM_OFFER' && m.metadata.offer_status === 'PENDING').pop();
    const offerToRespondTo = lastOfferMessage ? lastOfferMessage.metadata.offer_amount : conversation.agreed_budget;

    const ProposalContent = (
        <NewProposalForm onMakeOffer={onMakeOffer} setOpen={setOpen} />
    );

    return (
        <div className="p-3 bg-background border-t">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                 <Button className="w-full md:w-auto" size="lg" onClick={() => onAcceptOffer(offerToRespondTo)}>
                    <CheckCircle className="mr-2 h-4 w-4" /> {t('chat.acceptRate', { amount: offerToRespondTo })}
                </Button>
                
                <div className="relative flex items-center md:hidden">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-2 text-xs text-muted-foreground">{t('chat.or')}</span>
                    <div className="flex-grow border-t border-border"></div>
                </div>
                 
                <div className="flex flex-col md:flex-row items-center gap-2">
                 {isMobile ? (
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild><Button variant="outline" size="lg" className="w-full">{t('chat.proposeNew')}</Button></SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-lg">
                           <SheetHeader className="text-left">
                            <SheetTitle>{t('chat.proposalForm.title')}</SheetTitle>
                            <SheetDescription>{t('chat.proposalForm.description')}</SheetDescription>
                           </SheetHeader>
                           <div className="py-4">{ProposalContent}</div>
                        </SheetContent>
                    </Sheet>
                 ) : (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild><Button variant="outline" size="lg">{t('chat.proposeNew')}</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{t('chat.proposalForm.title')}</DialogTitle>
                                <DialogDescription>{t('chat.proposalForm.description')}</DialogDescription>
                            </DialogHeader>
                            {ProposalContent}
                        </DialogContent>
                    </Dialog>
                 )}

                <Button variant="ghost" size="lg" className="w-full md:w-auto text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDecline}>
                    <XCircle className="mr-2 h-4 w-4 md:hidden" /> {t('chat.decline')}
                </Button>
                </div>
            </div>
        </div>
    );
}

const MessageInput = ({ onSend, disabled, placeholder }: { onSend: (text: string) => void, disabled: boolean, placeholder: string }) => {
    const [input, setInput] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    const { t } = useLanguage();

    const GuardianBot = {
        isSecure: (text: string): boolean => {
            const forbiddenPatterns = [
            /\b(06|07)\d{8}\b/g, // Phone numbers
            /\+212\s?\d{9}/g,
            /\S+@\S+\.\S+/g, // Emails
            /whatsapp/i,
            /instagram/i,
            /telegram/i,
            /gmail/i,
            /virement/i,
            /cash/i,
            ];
            return !forbiddenPatterns.some(pattern => pattern.test(text));
        },
    };

    const handleSend = () => {
        if (!input.trim() || disabled) return;
        if (!GuardianBot.isSecure(input)) {
            setIsBlocked(true);
            setTimeout(() => setIsBlocked(false), 4000);
            return;
        }
        onSend(input);
        setInput('');
    };

    return (
        <div className="p-4 bg-background border-t">
            {isBlocked && (
                <Alert variant="destructive" className="mb-2">
                    <Bot className="h-4 w-4" />
                    <AlertTitle>{t('chat.guardianBot.title')}</AlertTitle>
                    <AlertDescription>{t('chat.guardianBot.description')}</AlertDescription>
                </Alert>
            )}
            <div className="relative">
                <Input
                    placeholder={placeholder}
                    className="pr-12"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={disabled}
                />
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2" onClick={handleSend} disabled={disabled}>
                    <Send className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
        </div>
    );
};

export function ChatView({ conversationId, onBack }: { conversationId: string, onBack: () => void }) {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { userProfile } = useUserProfile();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { t } = useLanguage();

    const conversationRef = useMemoFirebase(
        () => (firestore && conversationId ? doc(firestore, 'conversations', conversationId) : null),
        [firestore, conversationId]
    );
    const { data: conversation, isLoading: isConversationLoading } = useDoc(conversationRef);
    
    const otherUserId = useMemo(() => {
        if (!user || !conversation) return null;
        return user.uid === conversation.brand_id ? conversation.creator_id : conversation.brand_id;
    }, [user, conversation]);

    const otherUserRef = useMemoFirebase(
        () => (firestore && otherUserId) ? doc(firestore, 'users', otherUserId) : null,
        [firestore, otherUserId]
    );
    const { data: otherUser, isLoading: isOtherUserLoading } = useDoc(otherUserRef);

    const campaignRef = useMemoFirebase(
        () => (firestore && conversation ? doc(firestore, 'campaigns', conversation.campaign_id) : null),
        [firestore, conversation]
    );
    const { data: campaign, isLoading: isCampaignLoading } = useDoc(campaignRef);

    const messagesQuery = useMemoFirebase(
        () => (firestore && conversationId ? query(collection(firestore, 'conversations', conversationId, 'messages'), orderBy('timestamp', 'asc')) : null),
        [firestore, conversationId]
    );
    const { data: messages, isLoading: areMessagesLoading } = useCollection(messagesQuery);

    const isLoading = isUserLoading || isConversationLoading || areMessagesLoading || isCampaignLoading || isOtherUserLoading;
    
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col bg-muted/50 h-full">
                <Skeleton className="h-24 sm:h-20 w-full" />
                <div className="flex-1 p-6"><Skeleton className="h-full w-full" /></div>
                <Skeleton className="h-16 w-full" />
            </div>
        );
    }
    
    if(!conversation) {
        return (
             <main className="flex-1 flex items-center justify-center bg-muted/50 h-full">
                <div className="text-center">
                    <Info className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold text-muted-foreground">{t('chat.notFound.title')}</h2>
                </div>
            </main>
        )
    }

     const isParticipant = user && (user.uid === conversation.brand_id || user.uid === conversation.creator_id);
     if(!isParticipant) {
         return (
             <main className="flex-1 flex items-center justify-center bg-muted/50 h-full">
                <Alert variant="destructive" className="max-w-md">
                   <AlertTitle>{t('chat.accessDenied.title')}</AlertTitle>
                   <AlertDescription>{t('chat.accessDenied.description')}</AlertDescription>
                </Alert>
            </main>
         )
     }
     
    const handleMakeOffer = async (amount: number, message: string) => {
        if (!firestore || !user || !userProfile || !conversationRef) return;
        
        const batch = writeBatch(firestore);

        const lastOffer = messages?.filter((m: any) => m.type === 'SYSTEM_OFFER' && m.metadata.offer_status === 'PENDING').pop();
        if(lastOffer) {
            const lastOfferRef = doc(firestore, 'conversations', conversationId, 'messages', lastOffer.id);
            batch.update(lastOfferRef, { 'metadata.offer_status': 'SUPERSEDED' });
        }

        const newMessageRef = doc(collection(firestore, 'conversations', conversationId, 'messages'));
        batch.set(newMessageRef, {
            conversation_id: conversationId,
            sender_id: user.uid,
            sender_name: userProfile.name,
            type: 'SYSTEM_OFFER',
            content: message,
            metadata: {
                offer_amount: amount,
                offer_status: 'PENDING',
            },
            timestamp: serverTimestamp(),
        });

        batch.update(conversationRef, { 
            agreed_budget: amount,
            last_offer_by: user.uid,
            lastMessage: `New offer: ${amount} MAD`,
            updatedAt: serverTimestamp(),
        });
        
        batch.commit().catch(error => {
            const permissionError = new FirestorePermissionError({
                path: 'BATCH_WRITE',
                operation: 'write',
                requestResourceData: {
                    conversationUpdate: { agreed_budget: amount, last_offer_by: user.uid, lastMessage: `New offer: ${amount} MAD`},
                    newOfferMessage: { type: 'SYSTEM_OFFER', content: message }
                }
            })
            errorEmitter.emit('permission-error', permissionError)
        });
    };
    
    const handleAcceptOffer = async (amount: number) => {
        if (!firestore || !user || !conversationRef || !userProfile) return;
        
        const batch = writeBatch(firestore);
        
        const conversationUpdateData = {
          agreed_budget: amount,
          status: 'OFFER_ACCEPTED',
          last_offer_by: user.uid,
          lastMessage: 'Deal agreed!',
          updatedAt: serverTimestamp(),
        };
        batch.update(conversationRef, conversationUpdateData);
    
        const newEventRef = doc(collection(firestore, 'conversations', conversationId, 'messages'));
        batch.set(newEventRef, {
            conversation_id: conversationId,
            sender_id: user.uid,
            type: 'SYSTEM_EVENT',
            content: t('chat.eventAccepted', { role: userProfile?.role === 'creator' ? 'the Creator' : 'the Brand', amount }),
            timestamp: serverTimestamp(),
        });
        
        toast({ title: t('chat.toast.offerAccepted.title'), description: t('chat.toast.offerAccepted.description')});
    
        await batch.commit().catch((serverError) => {
          const permissionError = new FirestorePermissionError({
              path: `BATCH_WRITE on /conversations/${conversationId}`,
              operation: 'write',
              requestResourceData: { conversationUpdate: conversationUpdateData },
          });
          errorEmitter.emit('permission-error', permissionError);
        });
      };

    const handleSendMessage = async (text: string) => {
        if (!firestore || !user || isSubmitting) return;
        
        setIsSubmitting(true);
        const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
        try {
            await addDoc(messagesRef, {
                conversation_id: conversationId,
                sender_id: user.uid,
                type: 'TEXT',
                content: text,
                timestamp: serverTimestamp(),
            });
             await updateDoc(conversationRef!, { 
                lastMessage: text,
                updatedAt: serverTimestamp(),
             });
        } catch (error: any) {
             const permissionError = new FirestorePermissionError({
                path: messagesRef.path,
                operation: 'create',
                requestResourceData: {
                    type: 'TEXT',
                    content: text,
                },
             })
             errorEmitter.emit('permission-error', permissionError)
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRespondToOffer = async (message: any, response: 'ACCEPTED' | 'REJECTED') => {
        if (!firestore || !user || !conversationRef || !userProfile || !campaignRef) return;
        
        const batch = writeBatch(firestore);
        const msgRef = doc(firestore, 'conversations', conversationId, 'messages', message.id);
        
        batch.update(msgRef, { 'metadata.offer_status': response });
        
        let conversationUpdateData: any = {};
        
        if (response === 'ACCEPTED') {
            conversationUpdateData = {
              agreed_budget: message.metadata.offer_amount,
              status: 'OFFER_ACCEPTED',
              last_offer_by: user.uid,
            };

            batch.update(conversationRef, conversationUpdateData);
            
            const newEventRef = doc(collection(firestore, 'conversations', conversationId, 'messages'));
            const eventMessageData = {
                conversation_id: conversationId,
                sender_id: user.uid,
                type: 'SYSTEM_EVENT',
                content: t('chat.eventAcceptedAwaitingFunds', { role: userProfile?.role === 'creator' ? 'the Creator' : 'the Brand'}),
                timestamp: serverTimestamp(),
            };
            batch.set(newEventRef, eventMessageData);

            batch.update(campaignRef, { status: 'PENDING_PAYMENT' });
            
            toast({ title: t('chat.toast.offerAccepted.title'), description: t('chat.toast.offerAccepted.description')});
        } else {
             conversationUpdateData = { last_offer_by: user.uid };
             batch.update(conversationRef, conversationUpdateData);
             toast({ title: t('chat.toast.offerRejected') });
        }
        
        await batch.commit().catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: `BATCH_WRITE on /conversations/${conversationId} and subcollections`,
                operation: 'write',
                requestResourceData: {
                    messageUpdate: { 'metadata.offer_status': response },
                    conversationUpdate: conversationUpdateData,
                },
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const handleDecline = async () => {
        if (!firestore || !user || !conversationRef) return;
        try {
            await updateDoc(conversationRef, {
                status: 'CANCELLED',
                lastMessage: t('chat.negotiationCancelled'),
                updatedAt: serverTimestamp(),
            });
            toast({ variant: 'destructive', title: t('chat.toast.negotiationCancelled') });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: t('chat.toast.cancelError') });
        }
    };

    const isChatActive = conversation.status === 'ACTIVE' && campaign?.status !== 'PENDING_PAYMENT';
    const isInNegotiation = conversation.status === 'NEGOTIATION';
    const textInputDisabled = !isChatActive && !isInNegotiation;
    
    let placeholder = t('chat.placeholder.inactive');
    if(isInNegotiation) {
        placeholder = t('chat.placeholder.negotiation');
    }
    if (isChatActive) {
      placeholder = t('chat.placeholder.active');
    }

    return (
        <main className="flex-1 flex flex-col bg-muted/50 h-full">
            <DealStatusHeader 
                conversation={conversation} 
                campaign={campaign} 
                onOpenProfile={() => setIsSheetOpen(true)}
                otherUser={otherUser}
                onBack={onBack}
            />
            <MessageStream messages={messages || []} conversation={conversation} onRespondToOffer={handleRespondToOffer} />
            {isInNegotiation ? (
                 <ActionFooter 
                    conversation={conversation}
                    messages={messages || []}
                    onMakeOffer={handleMakeOffer}
                    onAcceptOffer={handleAcceptOffer}
                    onDecline={handleDecline}
                 />
            ) : (
               <MessageInput onSend={handleSendMessage} disabled={textInputDisabled} placeholder={placeholder} />
            )}
             <CreatorProfileSheet 
                creatorId={conversation.creator_id}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </main>
    );
}
