'use server';

/**
 * @fileOverview Analyzes an influencer's content and provides a summary of their aesthetic and typical content themes.
 *
 * - analyzeInfluencerAesthetic - A function that handles the analysis process.
 * - AnalyzeInfluencerAestheticInput - The input type for the analyzeInfluencerAesthetic function.
 * - AnalyzeInfluencerAestheticOutput - The return type for the analyzeInfluencerAesthetic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInfluencerAestheticInputSchema = z.object({
  contentUrl: z
    .string()
    .describe("A URL to the influencer's content (e.g., Instagram profile, blog)."),
  campaignGoals: z.string().describe('The goals of the marketing campaign.'),
  includeContentDetails: z
    .boolean()
    .describe(
      'Whether or not to include specific details of the content (e.g., recent posts) in the analysis.'
    ),
});

export type AnalyzeInfluencerAestheticInput = z.infer<
  typeof AnalyzeInfluencerAestheticInputSchema
>;

const AnalyzeInfluencerAestheticOutputSchema = z.object({
  aestheticSummary: z.string().describe('A summary of the influencer’s aesthetic.'),
  contentThemes: z
    .string()
    .describe('A summary of the typical content themes.'),
  fitForBrand: z
    .string()
    .describe('An analysis of how well the influencer fits the brand.'),
});

export type AnalyzeInfluencerAestheticOutput = z.infer<
  typeof AnalyzeInfluencerAestheticOutputSchema
>;

const getContentDetails = ai.defineTool({
  name: 'getContentDetails',
  description: 'Retrieves specific details about the content at a given URL.',
  inputSchema: z.object({
    url: z.string().describe('The URL to retrieve content details from.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
  // Placeholder implementation for fetching content details from the URL.
  // In a real application, this would involve scraping the website or using an API.
  // For now, just return a placeholder string.
  console.log("Fetching content details from ", input.url);
  return `Details from ${input.url}: [PLACEHOLDER CONTENT - IMPLEMENT REAL CONTENT SCRAPING HERE]`;
});

export async function analyzeInfluencerAesthetic(
  input: AnalyzeInfluencerAestheticInput
): Promise<AnalyzeInfluencerAestheticOutput> {
  return analyzeInfluencerAestheticFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInfluencerAestheticPrompt',
  input: {schema: AnalyzeInfluencerAestheticInputSchema},
  output: {schema: AnalyzeInfluencerAestheticOutputSchema},
  tools: [getContentDetails],
  prompt: `You are an expert marketing analyst specializing in influencer marketing.

You will analyze the provided influencer content and determine their aesthetic, typical content themes, and how well they fit with the brand's campaign goals.

Include information about the influencer's aesthetic, such as color palettes, styles, and overall vibe.
Include information about their content themes, such as topics they cover and types of content they create.

Based on these observations, make a determination as to whether the influencer is a good fit for the brand's marketing campaign.

Campaign Goals: {{{campaignGoals}}}
Influencer Content URL: {{{contentUrl}}}

{{#if includeContentDetails}}
  {{#tool_use name="getContentDetails"}}
    Content Details: {{result}}
  {{/tool_use}}
{{/if}}
`,
});

const analyzeInfluencerAestheticFlow = ai.defineFlow(
  {
    name: 'analyzeInfluencerAestheticFlow',
    inputSchema: AnalyzeInfluencerAestheticInputSchema,
    outputSchema: AnalyzeInfluencerAestheticOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
