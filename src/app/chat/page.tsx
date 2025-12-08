
import { Suspense } from 'react';
import { ChatPageContent } from '@/features/chat/pages/ChatPageContent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
