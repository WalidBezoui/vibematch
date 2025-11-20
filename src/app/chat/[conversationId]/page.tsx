
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatSidebar } from '@/components/chat-sidebar';
import { AppHeader } from '@/components/app-header';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Lock, Shield, CheckCircle, XCircle, Info, Bot, Handshake, Hourglass, CircleDollarSign, PartyPopper } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useUser, useUserProfile, useMemoFirebase } from '@/firebase';
import { doc, collection, query, addDoc, serverTimestamp, updateDoc, orderBy, getDoc } from 'firebase/firestore';
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

const DealStatusHeader = ({ conversation, campaign, onOfferSent }: { conversation: any, campaign: any, onOfferSent: () => void }) => {
    const { user } = useUser();
    const { userProfile } = useUserProfile();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [newOffer, setNewOffer] = useState('');
    const { conversationId } = useParams();
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
                    return { icon: Handshake, text: isBrand ? "Action Requise: Le créateur a fait une contre-offre." : "Action Requise: La marque vous a fait une offre.", color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' };
                }
                return { icon: Hourglass, text: isBrand ? "En attente de la réponse du créateur." : "Négociation en cours. La marque examine votre tarif.", color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20' };
            case 'OFFER_ACCEPTED':
                 return { icon: Handshake, text: isBrand ? "Accord trouvé. Déposez les fonds pour commencer." : "Accord trouvé. En attente du dépôt des fonds.", color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' };
            case 'ACTIVE':
                if (campaign?.status === 'PENDING_PAYMENT') {
                     return { icon: Hourglass, text: 'Offre acceptée. En attente du paiement.', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' };
                }
                return { icon: Shield, text: 'Fonds Sécurisés 🔒. Travail en cours.', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' };
            case 'REVIEW':
                 return { icon: Info, text: 'Travail soumis. En attente de validation.', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' };
            case 'COMPLETED':
                return { icon: PartyPopper, text: 'Campagne terminée !', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' };
            case 'CANCELLED':
                 return { icon: XCircle, text: 'Cette négociation a été annulée.', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' };
            default:
                return { icon: Info, text: 'Statut: ' + conversation.status, color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' };
        }
    }

    const { icon: Icon, text, color, bgColor } = getStatusInfo();
    
    const budgetLabel = conversation.status === 'NEGOTIATION' ? 'Dernière Offre' : 'Budget Accepté';

    return (
        <div className={cn("p-4 border-b", bgColor)}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className={cn("flex items-center font-semibold", color)}>
                    <Icon className="h-5 w-5 mr-2" />
                    <span>{text}</span>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-right">
                        {budgetLabel}: <span className="text-primary">{conversation.agreed_budget || 0} MAD</span>
                    </div>

                    {isBrand && (conversation.status === 'OFFER_ACCEPTED' || campaign?.status === 'PENDING_PAYMENT') && (
                         <Button size="sm" onClick={handleFund} disabled={!conversation.agreed_budget || conversation.agreed_budget <= 0}>
                            <CircleDollarSign className="mr-2 h-4 w-4" /> Payer & Bloquer les Fonds ({conversation.agreed_budget} MAD)
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

const SystemCard = ({ message, onRespondToOffer }: any) => {
    const { userProfile } = useUserProfile();

    if (message.type === 'SYSTEM_OFFER') {
        const isMyTurnToRespond = message.metadata.offer_status === 'PENDING' && message.sender_id !== userProfile?.uid;
        const status = message.metadata.offer_status;
        
        let title, description;
        if (message.sender_id === userProfile?.uid) {
            title = "Votre Offre";
            description = `Vous avez proposé un budget de`;
        } else {
            title = "Offre Reçue";
            description = `${message.sender_name || 'L\'autre partie'} a proposé un budget de`;
        }

        return (
            <div className="py-4">
                <Card className={cn(
                    "max-w-sm mx-auto",
                     status === 'REJECTED' && 'bg-muted/30 border-dashed',
                     status === 'ACCEPTED' && 'bg-green-50 dark:bg-green-900/20 border-green-500/30'
                )}>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className={cn(
                            "text-lg",
                            status === 'REJECTED' && 'text-muted-foreground'
                        )}>{title}</CardTitle>
                        {message.timestamp && (
                            <p className="text-xs text-muted-foreground pt-1">
                                {format(message.timestamp.toDate(), 'MMM d, yyyy HH:mm')}
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className={cn("text-muted-foreground mb-2", status === 'REJECTED' && 'line-through')}>{description}</p>
                        <p className={cn("text-2xl font-bold", status === 'REJECTED' && 'text-muted-foreground line-through')}>{message.metadata.offer_amount} MAD</p>

                        {isMyTurnToRespond && (
                            <div className="flex gap-2 mt-4">
                                <Button className="w-full" onClick={() => onRespondToOffer(message, 'ACCEPTED')}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Accepter
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={() => onRespondToOffer(message, 'REJECTED')}>
                                    <XCircle className="mr-2 h-4 w-4" /> Refuser
                                </Button>
                            </div>
                        )}
                        {status === 'ACCEPTED' && <Badge className="mt-4 bg-green-100 text-green-800">Acceptée</Badge>}
                        {status === 'REJECTED' && <Badge variant="destructive" className="mt-4">Refusée</Badge>}
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

    // For the initial context message
    if (message.type === 'TEXT' && message.content.startsWith('Discussion ouverte pour la campagne:')) {
        const isCreator = userProfile?.role === 'creator';
        let content = message.content;
        if(isCreator) {
            content = content.replace("L'offre d'ouverture du créateur est de", "Votre offre d'ouverture est de").replace("sa lettre de motivation est", "votre lettre de motivation est");
        }
        return (
            <div className="py-4">
                <div className="text-center text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg max-w-md mx-auto border">
                    <p className="whitespace-pre-wrap">{content}</p>
                    {message.timestamp && (
                        <p className="text-xs mt-2">
                            {format(message.timestamp.toDate(), 'MMM d, yyyy HH:mm')}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return null;
}

const MessageStream = ({ messages, conversation, onRespondToOffer }: any) => {
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
                 if (msg.type !== 'TEXT' || msg.content.startsWith('Discussion ouverte pour la campagne:')) {
                    return <SystemCard key={msg.id} message={msg} onRespondToOffer={onRespondToOffer} />
                 }
                return <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.sender_id === user?.uid} senderProfile={profiles[msg.sender_id]} />
            })}
        </div>
    );
};

const ActionFooter = ({ conversation, onMakeOffer }: { conversation: any, onMakeOffer: (amount: number, message: string) => void }) => {
    const { userProfile } = useUserProfile();
    const { user } = useUser();
    const [newOffer, setNewOffer] = useState('');
    const [message, setMessage] = useState('');
    
    const isBrand = userProfile?.role === 'brand';
    const isMyTurn = conversation.last_offer_by !== user?.uid;

    if (!isMyTurn) {
        return (
            <div className="p-4 bg-background border-t text-center text-sm text-muted-foreground">
                En attente de la réponse de l'autre partie...
            </div>
        )
    }

    const handleAcceptInitial = () => {
        onMakeOffer(conversation.agreed_budget, "J'accepte votre tarif initial.");
    }
    
    const handleSubmitOffer = () => {
        if (!newOffer || isNaN(parseFloat(newOffer)) || parseFloat(newOffer) <= 0) {
            alert("Veuillez entrer un montant valide.");
            return;
        }
        onMakeOffer(parseFloat(newOffer), message || "Voici une nouvelle proposition.");
        setNewOffer('');
        setMessage('');
    }

    // Brand's first move
    if (isBrand && conversation.last_offer_by === conversation.creator_id) {
         return (
            <div className="p-4 bg-background border-t space-y-4">
                 <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleAcceptInitial}>Accepter le Tarif ({conversation.agreed_budget} MAD)</Button>
                    <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="flex-1">Proposer un Autre Tarif</Button></PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2"><h4 className="font-medium leading-none">Nouvelle Proposition</h4><p className="text-sm text-muted-foreground">Proposez un nouveau budget et ajoutez un message si vous le souhaitez.</p></div>
                                <div className="grid gap-2">
                                     <Label htmlFor="budget">Montant (MAD)</Label>
                                     <Input id="budget" type="number" value={newOffer} onChange={(e) => setNewOffer(e.target.value)} />
                                     <Label htmlFor="message">Message (optionnel)</Label>
                                     <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="ex: C'est mon budget maximum pour cette opération..."/>
                                     <Button onClick={handleSubmitOffer}>Envoyer l'Offre</Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button variant="destructive" className="flex-1">Refuser</Button>
                </div>
            </div>
        );
    }
    
    // Creator or Brand responding to a counter-offer
    if (isMyTurn) {
        return (
             <div className="p-4 bg-background border-t space-y-4">
                <p className="text-center text-sm text-muted-foreground">Répondez à l'offre ci-dessus.</p>
            </div>
        );
    }

    return null;
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
                    <AlertTitle>Message Bloqué par Guardian Bot</AlertTitle>
                    <AlertDescription>Le partage d'informations de contact est interdit durant la négociation. Veuillez garder la communication sur VibeMatch pour votre sécurité.</AlertDescription>
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

    const isLoading = isUserLoading || isConversationLoading || areMessagesLoading || isCampaignLoading;
    
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
                            <h2 className="mt-4 text-xl font-semibold text-muted-foreground">Conversation non trouvée</h2>
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
                           <AlertTitle>Accès Refusé</AlertTitle>
                           <AlertDescription>Vous ne participez pas à cette conversation.</AlertDescription>
                        </Alert>
                    </main>
                </div>
            </div>
         )
     }
     
    const handleMakeOffer = async (amount: number, message: string) => {
        if (!firestore || !user || !userProfile || !conversationRef) return;
        
        // 1. Find the current pending offer and mark it as 'SUPERSEDED' or 'REJECTED'
        const lastOffer = messages?.filter((m: any) => m.type === 'SYSTEM_OFFER' && m.metadata.offer_status === 'PENDING').pop();
        if(lastOffer) {
            const lastOfferRef = doc(firestore, 'conversations', conversationId as string, 'messages', lastOffer.id);
            await updateDoc(lastOfferRef, { 'metadata.offer_status': 'REJECTED' });
        }

        // 2. Add the new offer message
        const messagesRef = collection(firestore, 'conversations', conversationId as string, 'messages');
        await addDoc(messagesRef, {
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

        // 3. Update the conversation document
        await updateDoc(conversationRef, { 
            agreed_budget: amount,
            last_offer_by: user.uid,
            lastMessage: `Nouvelle offre: ${amount} MAD`,
            updatedAt: serverTimestamp(),
         });
    };

    const handleSendMessage = async (text: string) => {
        if (!firestore || !user || isSubmitting) return;
        
        setIsSubmitting(true);
        const messagesRef = collection(firestore, 'conversations', conversationId as string, 'messages');
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
            toast({ variant: 'destructive', title: 'Erreur lors de l\'envoi du message', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRespondToOffer = async (message: any, response: 'ACCEPTED' | 'REJECTED') => {
        if (!firestore || !user || !conversationRef) return;
        
        const msgRef = doc(firestore, 'conversations', conversationId as string, 'messages', message.id);
        const messagesRef = collection(firestore, 'conversations', conversationId as string, 'messages');
        
        const updates = [];
        
        updates.push(updateDoc(msgRef, { 'metadata.offer_status': response }));
        
        if (response === 'ACCEPTED') {
            updates.push(updateDoc(conversationRef, { agreed_budget: message.metadata.offer_amount, status: 'OFFER_ACCEPTED' }));
            updates.push(addDoc(messagesRef, {
                conversation_id: conversationId,
                sender_id: user.uid,
                type: 'SYSTEM_EVENT',
                content: `Offre acceptée par le Créateur. En attente du dépôt des fonds par la Marque.`,
                timestamp: serverTimestamp(),
            }));
            toast({ title: 'Offre Acceptée!', description: 'La marque peut maintenant financer le projet.'});
        } else {
             // If creator rejects, it's their turn to make a counter-offer
             updates.push(updateDoc(conversationRef, { last_offer_by: user.uid }));
             toast({ title: 'Offre Refusée' });
        }
        
        await Promise.all(updates);
    };

    const isChatActive = conversation.status === 'ACTIVE' && campaign?.status !== 'PENDING_PAYMENT';
    const textInputPlaceholder = isChatActive ? "Discutez des détails créatifs..." : "Choisissez une action pour commencer.";

    return (
        <div className="h-screen w-full flex flex-col">
            <AppHeader />
            <div className="flex flex-1 overflow-hidden">
                <ChatSidebar conversationId={conversationId as string} />
                <main className="flex-1 flex flex-col bg-muted/50">
                    <DealStatusHeader conversation={conversation} campaign={campaign} onOfferSent={() => {}} />
                    <MessageStream messages={messages} conversation={conversation} onRespondToOffer={handleRespondToOffer} />
                    {conversation.status === 'NEGOTIATION' ? (
                       <ActionFooter conversation={conversation} onMakeOffer={handleMakeOffer} />
                    ) : (
                       <MessageInput onSend={handleSendMessage} disabled={!isChatActive} placeholder={textInputPlaceholder} />
                    )}
                </main>
            </div>
        </div>
    );
}
