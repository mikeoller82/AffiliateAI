
'use server';
/**
 * @fileOverview AI flow for generating copy for a landing page funnel.
 * This file has been corrected to use the Genkit library pattern.
 */
import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { FunnelCopyBrief, GeneratedFunnelCopy } from '../types';

const GeneratedFunnelCopySchema = z.object({
    generatedCopy: z.string(),
});

const constructPrompt = (brief: Omit<FunnelCopyBrief, 'apiKey'>): string => {
  return `
    You are an expert conversion copywriter designing a landing page funnel.

    The product is: ${brief.productDescription}

    Your task is to generate a "${brief.copyType}".

    Follow this instruction from the user: ${brief.userPrompt}

    Output structured data that adheres to the provided JSON schema.
  `;
};

export const generateFunnelCopy = async (brief: FunnelCopyBrief): Promise<GeneratedFunnelCopy> => {
    const { apiKey, ...promptBrief } = brief;

    if (!apiKey) {
        throw new Error("API key is required for funnel copy generation.");
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
                temperature: 0.7,
            },
            output: {
                schema: GeneratedFunnelCopySchema
            }
        });
        
        if (!output) {
            throw new Error("The AI returned an empty or blocked response.");
        }
        
        return output;

    } catch (error: any) {
        console.error("Funnel copy generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
