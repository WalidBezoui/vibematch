'use client';

import { ChatSidebar } from '@/components/chat-sidebar';
import { AppHeader } from '@/components/app-header';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
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
