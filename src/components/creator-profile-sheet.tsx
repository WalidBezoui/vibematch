'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import CreatorProfilePreview from "./creator-profile-preview";


export default function CreatorProfileSheet({ creatorId, open, onOpenChange }: { creatorId: string | null; open: boolean, onOpenChange: (open: boolean) => void }) {
    
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full max-w-none sm:max-w-[60vw] p-0">
                {creatorId ? (
                   <CreatorProfilePreview creatorId={creatorId} />
                ): (
                    <div className="p-8">
                        <SheetHeader>
                            <SheetTitle>No Creator Selected</SheetTitle>
                            <SheetDescription>
                                Please select a creator to view their profile.
                            </SheetDescription>
                        </SheetHeader>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
