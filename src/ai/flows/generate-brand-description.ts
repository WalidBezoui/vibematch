'use server';

/**
 * @fileOverview An AI agent to generate a compelling brand description.
 *
 * - generateBrandDescription - A function that generates the brand description.
 * - GenerateBrandDescriptionInput - The input type for the generateBrandDescription function.
 * - GenerateBrandDescriptionOutput - The return type for the generateBrandDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrandDescriptionInputSchema = z.object({
  keywords: z.string().describe('Keywords that describe the brand.'),
  targetAudience: z.string().describe('Description of the target audience.'),
});
export type GenerateBrandDescriptionInput = z.infer<
  typeof GenerateBrandDescriptionInputSchema
>;

const GenerateBrandDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling brand description.'),
});
export type GenerateBrandDescriptionOutput = z.infer<
  typeof GenerateBrandDescriptionOutputSchema
>;

export async function generateBrandDescription(
  input: GenerateBrandDescriptionInput
): Promise<GenerateBrandDescriptionOutput> {
  return generateBrandDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBrandDescriptionPrompt',
  input: {schema: GenerateBrandDescriptionInputSchema},
  output: {schema: GenerateBrandDescriptionOutputSchema},
  prompt: `You are an expert brand strategist. Generate a compelling brand description using the following keywords and target audience details.

Keywords: {{{keywords}}}
Target Audience: {{{targetAudience}}}

Description:`,
});

const generateBrandDescriptionFlow = ai.defineFlow(
  {
    name: 'generateBrandDescriptionFlow',
    inputSchema: GenerateBrandDescriptionInputSchema,
    outputSchema: GenerateBrandDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
