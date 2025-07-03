
'use server';
/**
 * @fileOverview AI flow for generating product marketing hooks.
 * This file has been corrected to use the Genkit library pattern.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { ProductHookBrief, GeneratedProductHooks } from '../types';

const GeneratedProductHooksSchema = z.object({
  hooks: z.array(z.string()),
});

const constructPrompt = (brief: Omit<ProductHookBrief, 'apiKey'>): string => {
  return `
    You are an expert in Viral Marketing.
    Your task is to generate 3-5 short, punchy marketing hook ideas designed to grab attention and evoke a specific emotion.

    **Product Description:** ${brief.productDescription}
    **Target Emotion:** ${brief.emotion}

    **Instructions:**
    - Generate hooks that are concise and memorable.
    - Each hook should strongly resonate with the target emotion.
    - The hooks should be directly related to the product.

    Output structured data that adheres to the provided JSON schema.
  `;
};

export const generateProductHook = async (brief: ProductHookBrief): Promise<GeneratedProductHooks> => {
    const { apiKey, ...promptBrief } = brief;

    if (!apiKey) {
        throw new Error("API key is required for product hook generation.");
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
                temperature: 0.9,
            },
            output: {
                schema: GeneratedProductHooksSchema
            }
        });
        
        if (!output) {
            throw new Error("The AI returned an empty or blocked response.");
        }
        
        return output;

    } catch (error: any) {
        console.error("Product hook generation error:", error);
         if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
