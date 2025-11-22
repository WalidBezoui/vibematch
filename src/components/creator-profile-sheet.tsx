
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import CreatorProfilePreview from "./creator-profile-preview";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";


export default function CreatorProfileSheet({ creatorId, open, onOpenChange }: { creatorId: string | null; open: boolean, onOpenChange: (open: boolean) => void }) {
    const firestore = useFirestore();

    const creatorRef = useMemoFirebase(
        () => (firestore && creatorId) ? doc(firestore, 'users', creatorId as string) : null,
        [firestore, creatorId]
    );
    const { data: creator, isLoading } = useDoc(creatorRef);
    
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full max-w-none sm:max-w-[60vw] p-0 flex flex-col">
                <SheetHeader className="p-6 pb-0">
                    <SheetTitle>
                        {isLoading || !creator ? "Creator Profile" : `Creator Profile: ${creator.displayName}`}
                    </SheetTitle>
                    {!(creatorId && creator) && !isLoading && (
                         <SheetDescription>
                            Please select a creator to view their profile.
                        </SheetDescription>
                    )}
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                    {creatorId ? (
                       <CreatorProfilePreview creatorId={creatorId} />
                    ): (
                        <div className="p-8">
                            <p>No creator selected.</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
