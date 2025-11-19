'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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


export function ChatSidebar({ conversationId }: { conversationId?: string }) {
  // Placeholder data
  const negotiations = [
    { id: '1', avatar: 'https://picsum.photos/seed/1/200', name: 'Brand A', title: 'Reels Lancement Été', lastMessage: 'Super, j\'attends votre offre !', hasAction: true },
    { id: '2', avatar: 'https://picsum.photos/seed/2/200', name: 'Brand B', title: 'Campagne Hiver', lastMessage: 'D\'accord, merci.', hasAction: false  },
  ];
  const active = [
    { id: '3', avatar: 'https://picsum.photos/seed/3/200', name: 'Brand C', title: 'Collab Ramadan', lastMessage: 'Parfait, les fonds sont sécurisés.', hasAction: false  },
  ];
  const completed = [
     { id: '4', avatar: 'https://picsum.photos/seed/4/200', name: 'Brand D', title: 'Déstockage Printemps', lastMessage: 'Merci pour cette excellente collaboration !', hasAction: false  },
  ];

  return (
    <aside className="w-80 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold tracking-tight">Deals</h2>
      </div>
      <Tabs defaultValue="negotiations" className="flex-1 flex flex-col">
        <TabsList className="m-2">
          <TabsTrigger value="negotiations" className="flex-1">Négociations</TabsTrigger>
          <TabsTrigger value="active" className="flex-1">Actifs</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">Terminés</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-y-auto">
            <TabsContent value="negotiations" className="m-0">
                 <div className="p-2 space-y-1">
                    {negotiations.map((item) => (
                        <ConversationCard key={item.id} href={`/chat/${item.id}`} isActive={conversationId === item.id} {...item} />
                    ))}
                 </div>
            </TabsContent>
            <TabsContent value="active" className="m-0">
                 <div className="p-2 space-y-1">
                    {active.map((item) => (
                        <ConversationCard key={item.id} href={`/chat/${item.id}`} isActive={conversationId === item.id} {...item} />
                    ))}
                 </div>
            </TabsContent>
            <TabsContent value="completed" className="m-0">
                 <div className="p-2 space-y-1">
                    {completed.map((item) => (
                        <ConversationCard key={item.id} href={`/chat/${item.id}`} isActive={conversationId === item.id} {...item} />
                    ))}
                 </div>
            </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
