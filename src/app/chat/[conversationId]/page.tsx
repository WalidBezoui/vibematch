'use client';

import { ChatSidebar } from '@/components/chat-sidebar';
import { AppHeader } from '@/components/app-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const ActionHeader = () => {
    // This will be dynamic in the future based on deal state
    return (
        <Card className="rounded-none border-x-0 border-t-0 p-4">
            <div className="flex justify-between items-center">
                <div className="font-semibold">
                    Budget Proposé : <span className="text-primary">2000 MAD</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Décliner</Button>
                    <Button>Accepter l'offre</Button>
                </div>
            </div>
        </Card>
    )
}

const MessageStream = () => {
     // Placeholder for messages
    return (
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg max-w-lg">
                    Bonjour, est-ce possible de livrer avant mardi ?
                </div>
            </div>
             <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-lg">
                    Oui, bien sûr. Je peux vous envoyer les livrables d'ici lundi soir.
                </div>
            </div>
        </div>
    )
}

const MessageInput = () => {
    return (
        <div className="p-4 bg-background border-t">
            <div className="relative">
                <Input placeholder="Type your message..." className="pr-12"/>
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2">
                    <Send className="h-5 w-5 text-muted-foreground"/>
                </Button>
            </div>
        </div>
    )
}


export default function SingleChatPage({ params }: { params: { conversationId: string } }) {
  return (
    <div className="h-screen w-full flex flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar conversationId={params.conversationId} />
        <main className="flex-1 flex flex-col bg-muted/50">
            <ActionHeader />
            <MessageStream />
            <MessageInput />
        </main>
      </div>
    </div>
  );
}
