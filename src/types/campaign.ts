export interface Campaign {
    id: string;
    title: string;
    budget: number;
    campaignBrief: string;
    status: string;
    tags?: string[];
    conversationId?: string;
}