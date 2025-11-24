'use client';

import React from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { query, collection, where, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const ConversationListItem = ({ conversation, isActive, onClick }: { conversation: any, isActive: boolean, onClick: () => void }) => {
    const { user } = useUser();
    const otherUserName = user?.uid === conversation.brand_id ? conversation.creator_name : conversation.brand_name;
    const otherUserAvatar = user?.uid === conversation.brand_id ? conversation.creator_avatar : conversation.brand_avatar;

    return (
        <div 
            className={cn(
                "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                isActive ? "bg-muted" : ""
            )}
            onClick={onClick}
        >
            <Avatar className="h-12 w-12 border">
                <AvatarImage src={otherUserAvatar} alt={otherUserName} />
                <AvatarFallback>{otherUserName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{otherUserName}</p>
                    {conversation.updatedAt && (
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(conversation.updatedAt.toDate(), { addSuffix: true })}
                        </p>
                    )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
            </div>
        </div>
    );
};

export const ConversationList = ({ onConversationSelect, selectedConversationId }: { onConversationSelect: (id: string) => void, selectedConversationId?: string }) => {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const conversationsQuery = useMemoFirebase(
        () => (user && firestore)
            ? query(
                collection(firestore, 'conversations'),
                where(user.uid === 'brand_id' ? 'brand_id' : 'creator_id', '==', user.uid),
                orderBy('updatedAt', 'desc')
            )
            : null,
        [user, firestore]
    );

    const { data: conversations, isLoading: conversationsLoading } = useCollection(conversationsQuery);

    if (isUserLoading || conversationsLoading) {
        return (
            <div className="h-full p-2 space-y-2">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="h-full border-r">
             <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto">
            {conversations && conversations.map(conv => (
                <ConversationListItem 
                    key={conv.id}
                    conversation={conv}
                    isActive={selectedConversationId === conv.id}
                    onClick={() => onConversationSelect(conv.id)}
                />
            ))}
            </div>
        </div>
    );
};