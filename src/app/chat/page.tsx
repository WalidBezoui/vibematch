'use client';

import { ChatSidebar } from '@/components/chat-sidebar';
import { AppHeader } from '@/components/app-header';
import { MessageSquare } from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { query, collection, where, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/firebase';
import { useEffect } from 'react';

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  // Query to find the most recent conversation to redirect to
  const conversationsQuery = useMemoFirebase(
    () => (user && firestore)
      ? query(
          collection(firestore, 'conversations'),
          where(user.uid === 'brand_id' ? 'brand_id' : 'creator_id', '==', user.uid),
          limit(1)
        )
      : null,
    [user, firestore]
  );
  const { data: conversations, isLoading: conversationsLoading } = useCollection(conversationsQuery);
  
  useEffect(() => {
    if(!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (!conversationsLoading && conversations && conversations.length > 0) {
      // Redirect to the first conversation in the list
      router.replace(`/chat/${conversations[0].id}`);
    }
  }, [conversations, conversationsLoading, router]);

  // While loading or redirecting, show a placeholder
  if (isUserLoading || conversationsLoading || (conversations && conversations.length > 0)) {
    return (
      <div className="h-screen w-full flex flex-col">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar />
          <main className="flex-1 flex items-center justify-center bg-muted/50">
             <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
              <h2 className="mt-4 text-xl font-semibold text-muted-foreground">Loading Conversations...</h2>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // If loading is finished and there are no conversations
  return (
    <div className="h-screen w-full flex flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <main className="flex-1 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-muted-foreground">Select a conversation</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose a deal from the list to start chatting.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
