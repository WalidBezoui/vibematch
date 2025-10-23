import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-influencer-keywords.ts';
import '@/ai/flows/analyze-influencer-aesthetic.ts';
import '@/ai/flows/generate-brand-description.ts';
import '@/ai/flows/validate-social-handle.ts';
