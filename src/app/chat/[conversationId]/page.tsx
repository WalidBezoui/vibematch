'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatSidebar } from '@/components/chat-sidebar';
import { AppHeader } from '@/components/app-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Lock, Shield, CheckCircle, XCircle, Info, Bot } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useUser, useUserProfile, useMemoFirebase } from '@/firebase';
import { doc, collection, query, addDoc, serverTimestamp, updateDoc, orderBy } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

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

const ActionHeader = ({ conversation, onOfferSent }: { conversation: any, onOfferSent: () => void }) => {
    const { user } = useUser();
    const { userProfile } = useUserProfile();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [newOffer, setNewOffer] = useState('');
    const { conversationId } = useParams();

    const isBrand = userProfile?.role === 'brand';
    const isCreator = userProfile?.role === 'creator';
    
    const handleMakeOffer = async () => {
        if (!firestore || !newOffer || isNaN(parseFloat(newOffer))) {
            toast({ variant: 'destructive', title: 'Invalid amount' });
            return;
        }

        const messagesRef = collection(firestore, 'conversations', conversationId as string, 'messages');
        await addDoc(messagesRef, {
            conversation_id: conversationId,
            sender_id: user?.uid,
            type: 'SYSTEM_OFFER',
            content: `The Brand proposed a new budget of: ${newOffer} MAD`,
            metadata: {
                offer_amount: parseFloat(newOffer),
                offer_status: 'PENDING',
            },
            timestamp: serverTimestamp(),
        });
        onOfferSent();
        setNewOffer('');
        toast({ title: 'Offer Sent!' });
    };

    const handleAcceptOffer = async (message: any) => {
        if (!firestore) return;
        
        const convRef = doc(firestore, 'conversations', conversationId as string);
        const msgRef = doc(firestore, 'conversations', conversationId as string, 'messages', message.id);
        
        await updateDoc(convRef, {
            agreed_budget: message.metadata.offer_amount,
            status: 'NEGOTIATION', // Stays in negotiation until funded
        });
        await updateDoc(msgRef, {
            'metadata.offer_status': 'ACCEPTED',
        });
        toast({ title: 'Offer Accepted!', description: 'The brand can now fund the project.'});
    };

     const handleRejectOffer = async (messageId: string) => {
        if (!firestore) return;
        const msgRef = doc(firestore, 'conversations', conversationId as string, 'messages', messageId);
        await updateDoc(msgRef, { 'metadata.offer_status': 'REJECTED' });
        toast({ title: 'Offer Rejected' });
    };
    
    const handleFund = () => {
      // In a real app, this would redirect to a payment gateway like Stripe
      toast({ title: "Redirecting to payment...", description: "This is a simulation."});
      setTimeout(async () => {
         const convRef = doc(firestore, 'conversations', conversationId as string);
         await updateDoc(convRef, { is_funded: true, status: 'ACTIVE' });
         
         const messagesRef = collection(firestore, 'conversations', conversationId as string, 'messages');
         await addDoc(messagesRef, {
            conversation_id: conversationId,
            sender_id: 'system',
            type: 'SYSTEM_ESCROW',
            content: `Funds (${conversation.agreed_budget} MAD) have been secured in VibeMatch escrow. The work can now begin safely.`,
            timestamp: serverTimestamp(),
        });
         toast({ title: "Payment Successful!", description: "The project is now active."});
      }, 2000);
    }
    
    // RENDER LOGIC
    if (conversation.is_funded) {
        return (
            <Card className="rounded-none border-x-0 border-t-0 p-4 bg-green-50 dark:bg-green-900/30 border-b-green-200">
                <div className="flex justify-center items-center font-semibold text-green-700">
                    <Lock className="h-4 w-4 mr-2" />
                    Funds Secured: {conversation.agreed_budget} MAD. Project is Active.
                </div>
            </Card>
        );
    }

    if (conversation.status === 'NEGOTIATION') {
        return (
             <Card className="rounded-none border-x-0 border-t-0 p-4">
                <div className="flex justify-between items-center">
                    <div className="font-semibold">
                        Agreed Budget: <span className="text-primary">{conversation.agreed_budget} MAD</span>
                    </div>
                    {isBrand && (
                        <div className="flex gap-2">
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">Change Offer</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">New Budget</h4>
                                            <p className="text-sm text-muted-foreground">Propose a new budget for this deal.</p>
                                        </div>
                                        <div className="grid gap-2">
                                             <Label htmlFor="budget">Amount (MAD)</Label>
                                             <Input id="budget" type="number" value={newOffer} onChange={(e) => setNewOffer(e.target.value)} />
                                             <Button onClick={handleMakeOffer}>Send New Offer</Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button onClick={handleFund} disabled={!conversation.agreed_budget || conversation.agreed_budget <= 0}>Fund & Hire ({conversation.agreed_budget} MAD)</Button>
                        </div>
                    )}
                </div>
            </Card>
        )
    }

    // Default empty header
    return <div className="p-4 border-b"></div>;
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
                <p className="text-sm">{message.content}</p>
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
        const isCreator = userProfile?.role === 'creator';
        const status = message.metadata.offer_status;
        return (
            <div className="py-4">
                <Card className="max-w-sm mx-auto bg-muted/50">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-lg">Budget Proposal</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground mb-2">The brand proposed a new budget of</p>
                        <p className="text-2xl font-bold">{message.metadata.offer_amount} MAD</p>

                        {status === 'PENDING' && isCreator && (
                            <div className="flex gap-2 mt-4">
                                <Button className="w-full" onClick={() => onRespondToOffer(message, 'ACCEPTED')}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Accept
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={() => onRespondToOffer(message, 'REJECTED')}>
                                    <XCircle className="mr-2 h-4 w-4" /> Decline
                                </Button>
                            </div>
                        )}
                        {status === 'ACCEPTED' && <Badge className="mt-4 bg-green-100 text-green-800">Accepted</Badge>}
                        {status === 'REJECTED' && <Badge variant="destructive" className="mt-4">Rejected</Badge>}
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if(message.type === 'SYSTEM_ESCROW') {
        return (
            <div className="py-4 text-center text-sm text-muted-foreground flex justify-center items-center gap-2">
                 <Shield className="h-4 w-4 text-green-500"/>
                 <p>{message.content}</p>
            </div>
        )
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
                    const docSnap = await doc(firestore, 'users', pId).get();
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
                if (msg.type === 'TEXT') {
                    return <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.sender_id === user?.uid} senderProfile={profiles[msg.sender_id]} />
                }
                return <SystemCard key={msg.id} message={msg} onRespondToOffer={onRespondToOffer} />
            })}
        </div>
    );
};

const MessageInput = ({ onSend }: { onSend: (text: string) => void }) => {
    const [input, setInput] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;
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
                    <AlertDescription>Sharing contact information is not allowed during negotiation. Please keep communication on VibeMatch for your security.</AlertDescription>
                </Alert>
            )}
            <div className="relative">
                <Input
                    placeholder="Type your message..."
                    className="pr-12"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2" onClick={handleSend}>
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
    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const conversationRef = useMemoFirebase(
        () => (firestore && conversationId ? doc(firestore, 'conversations', conversationId as string) : null),
        [firestore, conversationId]
    );
    const { data: conversation, isLoading: isConversationLoading } = useDoc(conversationRef);

    const messagesQuery = useMemoFirebase(
        () => (firestore && conversationId ? query(collection(firestore, 'conversations', conversationId as string, 'messages'), orderBy('timestamp', 'asc')) : null),
        [firestore, conversationId]
    );
    const { data: messages, isLoading: areMessagesLoading } = useCollection(messagesQuery);

    const isLoading = isConversationLoading || areMessagesLoading;

    if (!user) {
        router.push('/login');
        return <Skeleton className="h-screen w-full" />;
    }

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

     const isParticipant = user.uid === conversation.brand_id || user.uid === conversation.creator_id;
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

    const handleSendMessage = async (text: string) => {
        if (!firestore || !user || isSubmitting) return;

        // Guardian Bot check for negotiation phase
        if (conversation.status === 'NEGOTIATION' && !GuardianBot.isSecure(text)) {
            toast({
                variant: 'destructive',
                title: 'Message Blocked',
                description: 'For your security, sharing contact information is not allowed until the deal is funded.',
            });
            return;
        }
        
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
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error sending message', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRespondToOffer = async (message: any, response: 'ACCEPTED' | 'REJECTED') => {
        if (!firestore) return;
        
        const convRef = doc(firestore, 'conversations', conversationId as string);
        const msgRef = doc(firestore, 'conversations', conversationId as string, 'messages', message.id);
        
        const updates = [];
        
        if (response === 'ACCEPTED') {
            updates.push(updateDoc(convRef, { agreed_budget: message.metadata.offer_amount }));
            toast({ title: 'Offer Accepted!', description: 'The brand can now fund the project.'});
        } else {
            toast({ title: 'Offer Rejected' });
        }

        updates.push(updateDoc(msgRef, { 'metadata.offer_status': response }));
        
        await Promise.all(updates);
    };


    return (
        <div className="h-screen w-full flex flex-col">
            <AppHeader />
            <div className="flex flex-1 overflow-hidden">
                <ChatSidebar conversationId={conversationId as string} />
                <main className="flex-1 flex flex-col bg-muted/50">
                    <ActionHeader conversation={conversation} onOfferSent={() => {}} />
                    <MessageStream messages={messages} conversation={conversation} onRespondToOffer={handleRespondToOffer} />
                    <MessageInput onSend={handleSendMessage} />
                </main>
            </div>
        </div>
    );
}
