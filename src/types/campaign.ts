export interface Campaign {
  id: string;
  tags?: string[];
  creatorIds?: string[];
  numberOfCreators?: number;
  status: string;
  title: string;
  budget: number;
  campaignBrief: string;
  campaignType?: 'influence' | 'ugc';
  conversationId?: string;
  // Add any other properties your campaign objects might have
}
