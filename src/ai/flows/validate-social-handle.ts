'use server';

/**
 * @fileOverview Validates a social media handle.
 *
 * - validateSocialHandle - A function that handles the validation process.
 * - ValidateSocialHandleInput - The input type for the validateSocialHandle function.
 * - ValidateSocialHandleOutput - The return type for the validateSocialHandle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateSocialHandleInputSchema = z.object({
  platform: z.enum(['instagram', 'tiktok']).describe('The social media platform.'),
  handle: z.string().describe('The user handle to validate.'),
});

export type ValidateSocialHandleInput = z.infer<
  typeof ValidateSocialHandleInputSchema
>;

const ValidateSocialHandleOutputSchema = z.object({
  exists: z.boolean().describe('Whether or not the handle exists.'),
});

export type ValidateSocialHandleOutput = z.infer<
  typeof ValidateSocialHandleOutputSchema
>;

export async function validateSocialHandle(
  input: ValidateSocialHandleInput
): Promise<ValidateSocialHandleOutput> {
  return validateSocialHandleFlow(input);
}

const validateSocialHandleFlow = ai.defineFlow(
  {
    name: 'validateSocialHandleFlow',
    inputSchema: ValidateSocialHandleInputSchema,
    outputSchema: ValidateSocialHandleOutputSchema,
  },
  async ({platform, handle}) => {
    // This is a more robust simulation of a real-world validation.
    // It checks for common handle patterns and constraints.
    // In a production app, you would replace this with a real API call.
    console.log(`Simulating validation for @${handle} on ${platform}...`);
    
    // Simulate network delay to feel like a real API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    let isValid = false;
    
    if (platform === 'instagram') {
        // Instagram handles: 1-30 chars, letters, numbers, periods, underscores.
        // Cannot start or end with a period. No consecutive periods.
        isValid = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9_.]{1,30}$/.test(handle);
    } else if (platform === 'tiktok') {
        // TikTok handles: 2-24 chars, letters, numbers, underscores, periods.
        // Cannot end with a period.
        isValid = /^[a-zA-Z0-9_.]+$/.test(handle) &&
                  handle.length >= 2 &&
                  handle.length <= 24 &&
                  !handle.endsWith('.');
    }
    
    // Simulate that some valid-looking handles might not exist.
    // For this example, let's say handles containing "test" or "vibematch" are valid
    // and others have a 50% chance of being "taken" (not existing for a new user, but valid in format).
    // For the purpose of this form, we'll assume we're checking if it *exists* for a user to claim,
    // so we'll treat most valid formats as existing.
    if (isValid) {
        if (handle.includes('test') || handle.includes('vibematch')) {
            // These will always be "non-existent" for our test.
            return { exists: false };
        }
        // Let's pretend most valid-looking handles exist.
        return { exists: true };
    }

    return {
        exists: false,
    }
  }
);
