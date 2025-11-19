'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useCollection, useFirestore, useUser, useMemoFirebase, useUserProfile } from '@/firebase';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ConversationCard = ({
  href,
  avatar,
  name,
  title,
  lastMessage,
  isActive,
  hasAction,
}: {
  href: string;
  avatar: string;
  name: string;
  title: string;
  lastMessage: string;
  isActive: boolean;
  hasAction?: boolean;
}) => {
  return (
    <Link href={href} className={cn(
        "block p-3 rounded-lg transition-colors",
        isActive ? "bg-muted" : "hover:bg-muted/50"
    )}>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                {hasAction && (
                     <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-background" />
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="font-semibold truncate">{title}</p>
                <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
            </div>
        </div>
    </Link>
  );
};

const ConversationList = ({ conversations, conversationId }: { conversations: any[], conversationId?: string }) => {
    const firestore = useFirestore();
    const { user } = useUser();
    const [enrichedConversations, setEnrichedConversations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const enrichConversations = async () => {
            if (!firestore || conversations.length === 0) {
                setEnrichedConversations([]);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            
            const enriched = await Promise.all(conversations.map(async (convo) => {
                const otherUserId = user?.uid === convo.brand_id ? convo.creator_id : convo.brand_id;
                
                try {
                    const campaignSnap = await getDocs(query(collection(firestore, 'campaigns'), where('__name__', '==', convo.campaign_id)));
                    const userSnap = await getDocs(query(collection(firestore, 'users'), where('uid', '==', otherUserId)));
                    
                    const campaignTitle = !campaignSnap.empty ? campaignSnap.docs[0].data().title : 'Deleted Campaign';
                    const otherUser = !userSnap.empty ? userSnap.docs[0].data() : { name: 'Unknown User', photoURL: '' };

                    return {
                        ...convo,
                        campaignTitle,
                        otherUser,
                    };
                } catch (error) {
                    console.error("Error enriching conversation:", error);
                    return { ...convo, campaignTitle: 'Error', otherUser: { name: 'Error', photoURL: '' } };
                }
            }));
            
            setEnrichedConversations(enriched);
            setIsLoading(false);
        };

        enrichConversations();
    }, [conversations, firestore, user]);

    if (isLoading) {
        return (
            <div className="p-2 space-y-1">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        )
    }

    if (enrichedConversations.length === 0) {
        return <p className="text-sm text-center text-muted-foreground p-4">No conversations here.</p>
    }

    return (
        <div className="p-2 space-y-1">
            {enrichedConversations.map((item) => (
                <ConversationCard 
                    key={item.id} 
                    href={`/chat/${item.id}`} 
                    isActive={conversationId === item.id} 
                    avatar={item.otherUser.photoURL}
                    name={item.otherUser.name}
                    title={item.campaignTitle}
                    lastMessage={item.lastMessage || 'No messages yet'}
                    hasAction={item.status === 'NEGOTIATION' && !item.is_funded}
                />
            ))}
        </div>
    );
};

export function ChatSidebar({ conversationId }: { conversationId?: string }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { userProfile } = useUserProfile();

  const conversationsQuery = useMemoFirebase(() => {
    if (!user || !firestore || !userProfile) return null;
    const field = userProfile.role === 'brand' ? 'brand_id' : 'creator_id';
    return query(collection(firestore, 'conversations'), where(field, '==', user.uid));
  }, [user, firestore, userProfile]);

  const { data: conversations, isLoading } = useCollection(conversationsQuery);
  
  const negotiations = conversations?.filter(c => c.status === 'NEGOTIATION') || [];
  const active = conversations?.filter(c => c.status === 'ACTIVE' || c.status === 'REVIEW') || [];
  const completed = conversations?.filter(c => c.status === 'COMPLETED' || c.status === 'CANCELLED') || [];

  return (
    <aside className="w-80 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold tracking-tight">Deals</h2>
      </div>
       {isLoading ? (
            <div className="p-4 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        ) : (
             <Tabs defaultValue="negotiations" className="flex-1 flex flex-col">
                <TabsList className="m-2">
                <TabsTrigger value="negotiations" className="flex-1">Négociations</TabsTrigger>
                <TabsTrigger value="active" className="flex-1">Actifs</TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">Terminés</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto">
                    <TabsContent value="negotiations" className="m-0">
                        <ConversationList conversations={negotiations} conversationId={conversationId} />
                    </TabsContent>
                    <TabsContent value="active" className="m-0">
                         <ConversationList conversations={active} conversationId={conversationId} />
                    </TabsContent>
                    <TabsContent value="completed" className="m-0">
                         <ConversationList conversations={completed} conversationId={conversationId} />
                    </TabsContent>
                </div>
            </Tabs>
        )}
    </aside>
  );
}
