'use client';
import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { ChatSidebar } from '@/components/chat-sidebar';
import ChatView from '@/components/chat-view';
import { useUser } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('id');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    setSelectedConversation(conversationId);
  }, [conversationId]);

  const handleSelectConversation = (id: string) => {
    router.push(`/chat?id=${id}`);
  };

  const handleBack = () => {
    router.push('/chat');
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  const variants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        {!isMobile ? (
          <>
            <div className="w-96 border-r flex-col h-full bg-background flex">
              <ChatSidebar onSelectConversation={handleSelectConversation} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedConversation ? (
                <ChatView conversationId={selectedConversation} onBack={handleBack} />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-muted/50">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold text-muted-foreground">Select a conversation</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Choose a deal from the list to start chatting.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence>
              {!selectedConversation ? (
                <motion.div
                  key="sidebar"
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full h-full"
                >
                  <ChatSidebar onSelectConversation={handleSelectConversation} />
                </motion.div>
              ) : (
                <motion.div
                  key="chatview"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={variants}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full h-full absolute top-0 left-0"
                >
                  <ChatView conversationId={selectedConversation} onBack={handleBack} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
