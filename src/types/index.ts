
export interface Campaign {
  id: string;
  title: string;
  campaignBrief: string;
  budget: string;
  tags: string[];
  creatorIds?: string[];
  numberOfCreators?: number;
  campaignType: 'influence' | 'ugc';
  status: string;
}

export interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
}

export interface Conversation {
  id: string;
  campaign_id: string;
  creator_id: string;
}
