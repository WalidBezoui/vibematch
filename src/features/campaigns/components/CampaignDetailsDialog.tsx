
'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { Check, CircleDollarSign, FileText, Megaphone, Package, Users } from 'lucide-react';
import { format } from 'date-fns';

const statusStyles: { [key: string]: string } = {
    OPEN_FOR_APPLICATIONS: 'bg-green-100 text-green-800 border-green-200',
    PENDING_SELECTION: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PENDING_CREATOR_ACCEPTANCE: 'bg-blue-100 text-blue-800 border-blue-200',
    OFFER_PENDING: 'bg-blue-100 text-blue-800 border-blue-200',
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    DELIVERED: 'bg-purple-100 text-purple-800 border-purple-200',
    COMPLETED: 'bg-gray-200 text-gray-800 border-gray-300',
    REJECTED_BY_CREATOR: 'bg-red-100 text-red-800 border-red-200',
};

export function CampaignDetailsDialog({ campaign, open, onOpenChange }: { campaign: any, open: boolean, onOpenChange: (open: boolean) => void }) {
    const { t } = useLanguage();

    if (!campaign) {
        return null;
    }

    const statusKey = `status.${campaign.status}`;
    const statusText = t(statusKey, { default: campaign.status.replace(/_/g, ' ') });
    
    const formattedDate = campaign.createdAt && typeof campaign.createdAt.toDate === 'function' 
        ? format(campaign.createdAt.toDate(), 'MMM d, yyyy') 
        : 'N/A';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                            <Badge className={cn('whitespace-nowrap text-xs mb-2', statusStyles[campaign.status])}>
                                {statusText}
                            </Badge>
                            <DialogTitle className="text-2xl tracking-tight font-extrabold">{campaign.title}</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1">
                                {t('brandDashboard.createdOn', { date: formattedDate })}
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-6 text-sm flex-shrink-0">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CircleDollarSign className="h-4 w-4" />
                                <span className="font-semibold text-foreground">{campaign.budget} DH</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span className="font-semibold text-foreground">{campaign.creatorIds?.length || 0} / {campaign.numberOfCreators || 1} Hired</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto px-1">
                    <div>
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2 mb-2"><FileText className="h-4 w-4" /> Campaign Brief</h4>
                        <p className="text-foreground/80 whitespace-pre-wrap">{campaign.campaignBrief}</p>
                    </div>

                    {campaign.deliverables && campaign.deliverables.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2 mb-2"><Megaphone className="h-4 w-4" /> Deliverables</h4>
                            <ul className="space-y-3">
                                {campaign.deliverables.map((item: { type: string, quantity: number }, index: number) => (
                                    <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{t(`deliverableTypes.${item.type}`, { count: item.quantity, defaultValue: `${item.quantity} ${item.type}` })}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                     {campaign.instructions && (
                        <div>
                             <h4 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2 mb-2"><FileText className="h-4 w-4" /> Instructions</h4>
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{campaign.instructions}</p>
                        </div>
                    )}

                    {campaign.productLogistics && (
                         <div>
                             <h4 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2 mb-2"><Package className="h-4 w-4" /> Product Logistics</h4>
                            <p className="text-sm text-foreground/80">{t(`logistics.${campaign.productLogistics}`)}</p>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}

