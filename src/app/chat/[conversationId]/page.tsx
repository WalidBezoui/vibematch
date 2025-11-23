'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChatSidebar } from '@/components/chat-sidebar';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Lock, Shield, CheckCircle, XCircle, Info, Bot, Handshake, Hourglass, CircleDollarSign, PartyPopper, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useUser, useUserProfile, useMemoFirebase } from '@/firebase';
import { doc, collection, query, addDoc, serverTimestamp, updateDoc, orderBy, getDoc, writeBatch, getDocs, where } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import CreatorProfileSheet from '@/components/creator-profile-sheet';
import { errorEmitter, FirestorePermissionError, type SecurityRuleContext } from '@/firebase';

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

const DealStatusHeader = ({ conversation, campaign, onOpenProfile, otherUser }: { conversation: any, campaign: any, onOpenProfile: () => void, otherUser: any }) => {
    const { user } = useUser();
    const { userProfile } = useUserProfile();
    const router = useRouter();

    const isBrand = userProfile?.role === 'brand';
    
    const handleFund = () => {
      router.push(`/campaigns/${conversation.campaign_id}/pay`);
    }

    const getStatusInfo = () => {
        const isMyTurn = conversation.last_offer_by !== user?.uid;
        
        switch (conversation.status) {
            case 'NEGOTIATION':
                if (isMyTurn) {
                    let text = isBrand 
                        ? "Action Required: Creator has made an offer." 
                        : "Action Required: The brand has made an offer.";
                    
                    if (isBrand && campaign && conversation.agreed_budget === campaign.budget) {
                        text = "Creator's offer matches your budget. Please confirm.";
                    }

                    return { icon: Handshake, text, color: 'text-amber-800 dark:text-amber-200', bgColor: 'bg-amber-100/50 dark:bg-amber-900/20' };
                }
                
                let waitingText = isBrand ? "Waiting for creator's response." : "Brand is reviewing your rate.";
                if (!isBrand && campaign && conversation.agreed_budget === campaign.budget) {
                    waitingText = "Waiting for brand to confirm.";
                }
                return { icon: Hourglass, text: waitingText, color: 'text-amber-800 dark:text-amber-200', bgColor: 'bg-amber-100/50 dark:bg-amber-900/20' };

            case 'OFFER_ACCEPTED':
                 return { icon: Handshake, text: isBrand ? "Deal Agreed. Fund to start." : "Deal Agreed. Awaiting funds.", color: 'text-blue-800 dark:text-blue-200', bgColor: 'bg-blue-100/50 dark:bg-blue-900/20' };
            case 'ACTIVE':
                if (campaign?.status === 'PENDING_PAYMENT') {
                     return { icon: Hourglass, text: 'Offer accepted. Awaiting payment.', color: 'text-blue-800 dark:text-blue-200', bgColor: 'bg-blue-100/50 dark:bg-blue-900/20' };
                }
                return { icon: Shield, text: 'Funds Secured. Work in progress.', color: 'text-green-800 dark:text-green-200', bgColor: 'bg-green-100/50 dark:bg-green-900/20' };
            case 'REVIEW':
                 return { icon: Info, text: 'Work submitted for validation.', color: 'text-purple-800 dark:text-purple-200', bgColor: 'bg-purple-100/50 dark:bg-purple-900/20' };
            case 'COMPLETED':
                return { icon: PartyPopper, text: 'Campaign complete!', color: 'text-gray-800 dark:text-gray-200', bgColor: 'bg-gray-100/50 dark:bg-gray-800/20' };
            case 'CANCELLED':
                 return { icon: XCircle, text: 'Negotiation cancelled.', color: 'text-red-800 dark:text-red-200', bgColor: 'bg-red-100/50 dark:bg-red-900/20' };
            default:
                return { icon: Info, text: 'Status: ' + conversation.status, color: 'text-gray-800 dark:text-gray-200', bgColor: 'bg-gray-100/50 dark:bg-gray-800/20' };
        }
    }

    const { icon: Icon, text, color, bgColor } = getStatusInfo();
    
    const budgetLabel = conversation.status === 'NEGOTIATION' ? 'Last Offer' : 'Agreed Budget';

    return (
        <div className={cn("p-4 border-b", bgColor)}>
            <div className="flex justify-between items-center gap-4">
                 <div className="flex items-center gap-3">
                    {isBrand && otherUser && (
                        <>
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={otherUser.photoURL} alt={otherUser.name} />
                                <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{otherUser.displayName || otherUser.name}</p>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={onOpenProfile}>View Profile</Button>
                            </div>
                        </>
                    )}
                </div>

                <div className={cn("flex-1 text-center font-semibold text-sm flex items-center justify-center gap-2", color)}>
                    <Icon className="h-5 w-5" />
                    <span>{text}</span>
                </div>

                 <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs font-semibold text-muted-foreground">{budgetLabel}</p>
                        <p className="font-bold text-primary">{conversation.agreed_budget || 0} MAD</p>
                    </div>

                    {isBrand && (conversation.status === 'OFFER_ACCEPTED' || campaign?.status === 'PENDING_PAYMENT') && (
                         <Button size="sm" onClick={handleFund} disabled={!conversation.agreed_budget || conversation.agreed_budget <= 0}>
                            <CircleDollarSign className="mr-2 h-4 w-4" /> Fund Escrow
                         </Button>
                    )}
                </div>
            </div>
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

    // For the initial context message
    if (message.type === 'TEXT' && message.content.startsWith('Discussion opened for campaign:')) {
        const isCreator = userProfile?.role === 'creator';
        
        const contentRegex = /Discussion opened for campaign: "(.*)".\n\nCreator's opening offer is ([\d,.]+) MAD and their cover letter is:\n\n"(.*)"/s;
        const match = message.content.match(contentRegex);

        if (!match) return <MessageBubble message={message} isOwnMessage={false} senderProfile={{name: 'System'}}/>;

        const [, campaignTitle, offerAmount, coverLetter] = match;

        const cardTitle = isCreator
          ? `Discussion for "${campaignTitle}"`
          : `Application for "${campaignTitle}"`;
        
        const cardDescription = isCreator
          ? `The brand has opened a discussion based on your application.`
          : `Opened on ${message.timestamp ? format(message.timestamp.toDate(), 'MMM d, yyyy') : ''}`;

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
                                {isCreator ? "Your Opening Offer" : "Creator's Opening Offer"}
                            </p>
                            <p className="text-xl font-bold gradient-text">{offerAmount} MAD</p>
                        </div>
                         <div>
                            <p className="text-sm font-semibold text-muted-foreground">Original Cover Letter</p>
                            <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap border p-3 rounded-md bg-background/50">{coverLetter}</p>
                        </div>
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
            title = "Your Offer";
            description = `You proposed a budget of`;
        } else {
            title = "Offer Received";
            description = `${message.sender_name || 'The other party'} proposed a budget of`;
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
                    <CardContent className="text-center">
                        <p className={cn("text-muted-foreground mb-2", (status === 'REJECTED' || status === 'SUPERSEDED') && 'line-through')}>{description}</p>
                        <p className={cn("text-2xl font-bold", (status === 'REJECTED' || status === 'SUPERSEDED') && 'text-muted-foreground line-through')}>{message.metadata.offer_amount} MAD</p>

                        {isMyTurnToRespond && (
                            <div className="flex gap-2 mt-4">
                                <Button className="w-full" onClick={() => onRespondToOffer(message, 'ACCEPTED')}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Accept
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={() => onRespondToOffer(message, 'REJECTED')}>
                                    <XCircle className="mr-2 h-4 w-4" /> Reject
                                </Button>
                            </div>
                        )}
                        {status === 'ACCEPTED' && <Badge className="mt-4 bg-green-100 text-green-800">Accepted</Badge>}
                        {status === 'REJECTED' && <Badge variant="destructive" className="mt-4">Rejected</Badge>}
                         {status === 'SUPERSEDED' && <Badge variant="outline" className="mt-4">Superseded</Badge>}
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if(message.type === 'SYSTEM_ESCROW' || message.type === 'SYSTEM_EVENT') {
        const eventIcons: { [key: string]: React.ElementType } = {
          'accepté': CheckCircle,
          'financé': Shield,
          'funded': Shield,
        };
        
        const eventType = message.content.includes('accepté') ? 'accepté' : message.content.includes('financé') || message.content.includes('funded') ? 'funded' : 'info';
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
        return <div className="flex-1 p-6 space-y-4 overflow-y-auto" ref={scrollRef}>Loading messages...</div>
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

const ActionFooter = ({ onMakeOffer, onDecline }: { onMakeOffer: (amount: number, message: string) => void, onDecline: () => void }) => {
    const { conversationId } = useParams();
    const firestore = useFirestore();
    const { user } = useUser();
    const [newOffer, setNewOffer] = useState('');
    const [message, setMessage] = useState('');
    
    const handleSubmitOffer = () => {
        if (!newOffer || isNaN(parseFloat(newOffer)) || parseFloat(newOffer) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        onMakeOffer(parseFloat(newOffer), message || "Here is my new proposal for this campaign.");
        setNewOffer('');
        setMessage('');
    }

    const handleAcceptRate = async () => {
        if (!firestore || !conversationId) return;

        const conversationRef = doc(firestore, 'conversations', conversationId as string);
        const messagesRef = collection(firestore, 'conversations', conversationId as string, 'messages');
        const q = query(messagesRef, where('type', '==', 'SYSTEM_OFFER'), where('metadata.offer_status', '==', 'PENDING'), orderBy('timestamp', 'desc'));
        
        const querySnapshot = await getDocs(q);
        const lastOfferMessage = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
        
        const conversationSnap = await getDoc(conversationRef);
        const currentConversation = conversationSnap.data();

        const offerToRespondTo = lastOfferMessage ? lastOfferMessage.metadata.offer_amount : currentConversation?.agreed_budget;

        if (offerToRespondTo) {
            onMakeOffer(offerToRespondTo, "I accept your rate.");
        } else {
            console.error("Could not determine rate to accept.");
        }
    };


    return (
        <div className="p-4 bg-background border-t space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <Button className="flex-1" onClick={handleAcceptRate}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Accept Rate
                </Button>
                <Popover>
                    <PopoverTrigger asChild><Button variant="outline" className="flex-1">Propose New Rate</Button></PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2"><h4 className="font-medium leading-none">New Proposal</h4><p className="text-sm text-muted-foreground">Propose a new budget and add a message if you wish.</p></div>
                            <div className="grid gap-2">
                                    <Label htmlFor="budget">Amount (MAD)</Label>
                                    <Input id="budget" type="number" value={newOffer} onChange={(e) => setNewOffer(e.target.value)} />
                                    <Label htmlFor="message">Message (optional)</Label>
                                    <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g., This is my maximum budget..."/>
                                    <Button onClick={handleSubmitOffer}>Send Offer</Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Button variant="destructive" className="flex-1" onClick={onDecline}>
                    <XCircle className="mr-2 h-4 w-4" /> Decline
                </Button>
            </div>
        </div>
    );
}

const MessageInput = ({ onSend, disabled, placeholder }: { onSend: (text: string) => void, disabled: boolean, placeholder: string }) => {
    const [input, setInput] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);

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
                    <AlertTitle>Message Blocked by Guardian Bot</AlertTitle>
                    <AlertDescription>Sharing contact information is forbidden during negotiation. Please keep communication on VibeMatch for your security.</AlertDescription>
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

export default function SingleChatPage() {
    const { conversationId } = useParams();
    const router = useRouter();
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { userProfile } = useUserProfile();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

     useEffect(() => {
      if (!isUserLoading && !user) {
        router.push('/login');
      }
    }, [isUserLoading, user, router]);

    const conversationRef = useMemoFirebase(
        () => (firestore && conversationId ? doc(firestore, 'conversations', conversationId as string) : null),
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
        () => (firestore && conversationId ? query(collection(firestore, 'conversations', conversationId as string, 'messages'), orderBy('timestamp', 'asc')) : null),
        [firestore, conversationId]
    );
    const { data: messages, isLoading: areMessagesLoading } = useCollection(messagesQuery);

    const isLoading = isUserLoading || isConversationLoading || areMessagesLoading || isCampaignLoading || isOtherUserLoading;
    
    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col">
                <AppHeader />
                <div className="flex flex-1 overflow-hidden">
                    <ChatSidebar conversationId={conversationId as string} />
                    <main className="flex-1 flex flex-col bg-muted/50">
                        <Skeleton className="h-16 w-full" />
                        <div className="flex-1 p-6"><Skeleton className="h-full w-full" /></div>
                        <Skeleton className="h-16 w-full" />
                    </main>
                </div>
            </div>
        );
    }
    
    if(!conversation) {
        return (
             <div className="h-screen w-full flex flex-col">
                <AppHeader />
                <div className="flex flex-1 overflow-hidden">
                    <ChatSidebar />
                     <main className="flex-1 flex items-center justify-center bg-muted/50">
                        <div className="text-center">
                            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h2 className="mt-4 text-xl font-semibold text-muted-foreground">Conversation not found</h2>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

     const isParticipant = user && (user.uid === conversation.brand_id || user.uid === conversation.creator_id);
     if(!isParticipant) {
         return (
              <div className="h-screen w-full flex flex-col">
                <AppHeader />
                <div className="flex flex-1 overflow-hidden">
                    <ChatSidebar />
                     <main className="flex-1 flex items-center justify-center bg-muted/50">
                        <Alert variant="destructive" className="max-w-md">
                           <AlertTitle>Access Denied</AlertTitle>
                           <AlertDescription>You are not a participant in this conversation.</AlertDescription>
                        </Alert>
                    </main>
                </div>
            </div>
         )
     }
     
    const handleMakeOffer = async (amount: number, message: string) => {
        if (!firestore || !user || !userProfile || !conversationRef) return;
        
        const batch = writeBatch(firestore);

        const messagesRef = collection(firestore, 'conversations', conversationId as string, 'messages');
        const lastOfferQuery = query(messagesRef, where('type', '==', 'SYSTEM_OFFER'), where('metadata.offer_status', '==', 'PENDING'), orderBy('timestamp', 'desc'));
        
        const querySnapshot = await getDocs(lastOfferQuery);
        if (!querySnapshot.empty) {
            const lastOfferDoc = querySnapshot.docs[0];
            batch.update(lastOfferDoc.ref, { 'metadata.offer_status': 'SUPERSEDED' });
        }
    
        const newOfferMessageRef = doc(collection(firestore, 'conversations', conversationId as string, 'messages'));
        const newOfferData = {
            conversation_id: conversationId,
            sender_id: user.uid,
            type: 'SYSTEM_OFFER' as const,
            content: message,
            metadata: {
                offer_amount: amount,
                offer_status: 'PENDING' as const,
            },
            timestamp: serverTimestamp(),
        };
        batch.set(newOfferMessageRef, newOfferData);
    
        const conversationUpdateData = {
            last_offer_by: user.uid,
            lastMessage: `New offer: ${amount}`,
            updatedAt: serverTimestamp(),
        };
        batch.update(conversationRef, conversationUpdateData);
        
        batch.commit().catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: `BATCH_WRITE`,
                operation: 'write',
                requestResourceData: {
                    description: "Batch write for making a new offer in a conversation.",
                    operations: [
                        querySnapshot.empty ? "No previous offer to update." : { path: querySnapshot.docs[0].ref.path, data: { 'metadata.offer_status': 'SUPERSEDED' } },
                        { path: newOfferMessageRef.path, data: newOfferData },
                        { path: conversationRef.path, data: conversationUpdateData }
                    ]
                },
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const handleSendMessage = async (text: string) => {
        if (!firestore || !user || isSubmitting) return;
        
        setIsSubmitting(true);
        const messagesRef = collection(firestore, 'conversations', conversationId as string, 'messages');
        const messageData = {
            conversation_id: conversationId,
            sender_id: user.uid,
            type: 'TEXT' as const,
            content: text,
            timestamp: serverTimestamp(),
        };

        const conversationUpdate = { 
            lastMessage: text,
            updatedAt: serverTimestamp(),
        };

        const batch = writeBatch(firestore);
        batch.set(doc(messagesRef), messageData);
        batch.update(conversationRef!, conversationUpdate);

        batch.commit().catch(async (serverError) => {
             const permissionError = new FirestorePermissionError({
                path: `BATCH_WRITE`,
                operation: 'write',
                requestResourceData: {
                    description: "Batch write for sending a text message.",
                    operations: [
                        { path: 'new message', data: messageData },
                        { path: conversationRef!.path, data: conversationUpdate }
                    ]
                },
            });
            errorEmitter.emit('permission-error', permissionError);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };
    
    const handleRespondToOffer = async (message: any, response: 'ACCEPTED' | 'REJECTED') => {
        if (!firestore || !user || !conversationRef || !userProfile) return;
        
        const batch = writeBatch(firestore);
        const msgRef = doc(firestore, 'conversations', conversationId as string, 'messages', message.id);
        
        batch.update(msgRef, { 'metadata.offer_status': response });
        
        if (response === 'ACCEPTED') {
            batch.update(conversationRef, { agreed_budget: message.metadata.offer_amount, status: 'OFFER_ACCEPTED', last_offer_by: user.uid });

            const newEventRef = doc(collection(firestore, 'conversations', conversationId as string, 'messages'));
            batch.set(newEventRef, {
                conversation_id: conversationId,
                sender_id: user.uid,
                type: 'SYSTEM_EVENT',
                content: `Offer accepted by ${userProfile?.role === 'creator' ? 'the Creator' : 'the Brand'}. Awaiting funds from the Brand.`,
                timestamp: serverTimestamp(),
            });
            toast({ title: 'Offer Accepted!', description: 'The brand can now fund the project.'});
        } else {
             // If someone rejects, it's their turn to make a counter-offer
             batch.update(conversationRef, { last_offer_by: user.uid });
             toast({ title: 'Offer Rejected' });
        }
        
        await batch.commit();
    };

    const handleDecline = async () => {
        if (!firestore || !user || !conversationRef) return;
        
        const updateData = {
            status: 'CANCELLED' as const,
            lastMessage: 'The negotiation was cancelled.',
            updatedAt: serverTimestamp(),
        };

        const batch = writeBatch(firestore);
        batch.update(conversationRef, updateData);

        batch.commit().catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: conversationRef.path,
                operation: 'update',
                requestResourceData: updateData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
        toast({ variant: 'destructive', title: 'Negotiation Cancelled' });
    };

    const isChatActive = conversation.status === 'ACTIVE' && campaign?.status !== 'PENDING_PAYMENT';
    const isInNegotiation = conversation.status === 'NEGOTIATION';
    const textInputDisabled = !isChatActive && !isInNegotiation;
    
    let placeholder = "Choose an action below to respond.";
    if (isChatActive) {
      placeholder = "Discuss creative details...";
    } else if (conversation.status !== 'NEGOTIATION') {
      placeholder = "This conversation is not active.";
    }

    const isMyTurn = conversation.last_offer_by !== user?.uid;


    return (
        <div className="h-screen w-full flex flex-col">
            <AppHeader />
            <div className="flex flex-1 overflow-hidden">
                <ChatSidebar conversationId={conversationId as string} />
                <main className="flex-1 flex flex-col bg-muted/50">
                    <DealStatusHeader 
                        conversation={conversation} 
                        campaign={campaign} 
                        onOpenProfile={() => setIsSheetOpen(true)}
                        otherUser={otherUser}
                    />
                    <MessageStream messages={messages || []} conversation={conversation} onRespondToOffer={handleRespondToOffer} />
                    {isInNegotiation && isMyTurn ? (
                       <ActionFooter onMakeOffer={handleMakeOffer} onDecline={handleDecline} />
                    ) : (
                       <MessageInput onSend={handleSendMessage} disabled={textInputDisabled} placeholder={placeholder} />
                    )}
                </main>
            </div>
            <CreatorProfileSheet 
                creatorId={conversation.creator_id}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </div>
    );
}
