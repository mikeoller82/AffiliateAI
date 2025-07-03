
'use server';
/**
 * @fileOverview AI flow for generating ad copy.
 * This file has been corrected to use the Genkit library pattern.
 */
import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { AdCopyBrief, GeneratedAdCopy } from '../types';

const GeneratedAdCopySchema = z.object({
  headlines: z.array(z.string()),
  primary_text: z.string(),
  descriptions: z.array(z.string()),
});

const constructPrompt = (brief: Omit<AdCopyBrief, 'apiKey'>): string => {
  return `
    You are a world-class expert in Direct-Response Copywriting.
    Your task is to generate compelling ad copy based on the following brief.

    **Ad Copy Brief:**
    - **Product/Service:** ${brief.product}
    - **Target Audience:** ${brief.audience}
    - **Platform:** ${brief.platform}

    **Instructions:**
    1.  Create 3-5 compelling, attention-grabbing headlines.
    2.  Write a persuasive primary text for the ad body.
    3.  Create 3-5 concise and relevant descriptions.
    4.  Ensure the tone and style are appropriate for the specified platform.
    
    Output structured data that adheres to the provided JSON schema.
  `;
};

export const generateAdCopy = async (brief: AdCopyBrief): Promise<GeneratedAdCopy> => {
    const { apiKey, ...promptBrief } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for ad copy generation.");
    }

    const userAi = genkit({
        plugins: [googleAI({ apiKey })],
    });
    
    const prompt = constructPrompt(promptBrief);

    try {
        const { output } = await userAi.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt,
            config: {
                temperature: 0.8,
            },
            output: {
                schema: GeneratedAdCopySchema
            }
        });
        
        if (!output) {
            throw new Error("The AI returned an empty or blocked response.");
        }

        return output;

    } catch (error: any) {
        console.error("Ad copy generation error:", error);
         if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
