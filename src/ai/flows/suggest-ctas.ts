
'use server';
/**
 * @fileOverview AI flow for suggesting Call-To-Action phrases.
 * This file has been corrected to use the Genkit library pattern.
 */
import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { CTABrief, GeneratedCTAs } from '../types';

const GeneratedCTAsSchema = z.object({
  ctas: z.array(z.string()),
});

const constructPrompt = (brief: Omit<CTABrief, 'apiKey'>): string => {
  return `
    You are a world-class expert in Marketing Strategy and Conversion Rate Optimization.
    Your task is to suggest 3-5 compelling Call-To-Action (CTA) phrases for the given context.

    **Context:** ${brief.context}

    **Instructions:**
    - The CTAs should be short, punchy, and action-oriented.
    - Tailor the CTAs to be highly relevant to the provided context.
    - Focus on creating a sense of urgency or clear benefit for the user.
    
    Output structured data that adheres to the provided JSON schema.
  `;
};

export const suggestCTAs = async (brief: CTABrief): Promise<GeneratedCTAs> => {
    const { apiKey, ...promptBrief } = brief;

    if (!apiKey) {
        throw new Error("API key is required for CTA suggestion.");
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
                schema: GeneratedCTAsSchema
            }
        });
        
        if (!output) {
            throw new Error("The AI returned an empty or blocked response.");
        }
        
        return output;

    } catch (error: any) {
        console.error("CTA suggestion error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
