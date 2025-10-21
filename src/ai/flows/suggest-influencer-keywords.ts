'use server';

/**
 * @fileOverview Suggests relevant keywords for influencer discovery based on a brand description.
 *
 * - suggestInfluencerKeywords - A function that suggests keywords for influencer discovery.
 * - SuggestInfluencerKeywordsInput - The input type for the suggestInfluencerKeywords function.
 * - SuggestInfluencerKeywordsOutput - The return type for the suggestInfluencerKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInfluencerKeywordsInputSchema = z.object({
  brandDescription: z
    .string()
    .describe('A description of the brand, its values, and target audience.'),
});
export type SuggestInfluencerKeywordsInput = z.infer<
  typeof SuggestInfluencerKeywordsInputSchema
>;

const SuggestInfluencerKeywordsOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe(
      'A list of relevant keywords for finding influencers who align with the brand aesthetic and campaign goals.'
    ),
});
export type SuggestInfluencerKeywordsOutput = z.infer<
  typeof SuggestInfluencerKeywordsOutputSchema
>;

export async function suggestInfluencerKeywords(
  input: SuggestInfluencerKeywordsInput
): Promise<SuggestInfluencerKeywordsOutput> {
  return suggestInfluencerKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInfluencerKeywordsPrompt',
  input: {schema: SuggestInfluencerKeywordsInputSchema},
  output: {schema: SuggestInfluencerKeywordsOutputSchema},
  prompt: `You are an expert marketing assistant specializing in influencer discovery.

  Given the following brand description, suggest a list of keywords that can be used to find relevant influencers.
  The keywords should be specific and relevant to the brand's aesthetic, values, and target audience.

  Brand Description: {{{brandDescription}}}

  Your output should be a list of keywords that will help the brand find the perfect influencers for their campaigns.
  Make sure the keywords are comma separated.
  `, // Ensure comma separated keywords for parsing
});

const suggestInfluencerKeywordsFlow = ai.defineFlow(
  {
    name: 'suggestInfluencerKeywordsFlow',
    inputSchema: SuggestInfluencerKeywordsInputSchema,
    outputSchema: SuggestInfluencerKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
