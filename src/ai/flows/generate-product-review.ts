
'use server';
/**
 * @fileOverview AI flow for generating a product review.
 * This file has been corrected to use the Genkit library pattern.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { ProductReviewBrief, GeneratedProductReview } from '../types';

const GeneratedProductReviewSchema = z.object({
  review: z.string(),
});

const constructPrompt = (brief: Omit<ProductReviewBrief, 'apiKey'>): string => {
  return `
    You are an expert in SEO Copywriting and Affiliate Marketing.
    Your task is to generate a well-structured and engaging product review in Markdown format.

    **Product Name:** ${brief.productName}
    **Key Features/Talking Points:** ${brief.features}

    **Instructions:**
    - Create a catchy introduction to grab the reader's attention.
    - Write a "Pros" section with bullet points highlighting the product's strengths.
    - Write a "Cons" section with bullet points for a balanced perspective.
    - Provide a concluding summary that helps the reader make a decision.
    - The entire output should be a single string in Markdown format.

    Output structured data that adheres to the provided JSON schema.
  `;
};

export const generateProductReview = async (brief: ProductReviewBrief): Promise<GeneratedProductReview> => {
    const { apiKey, ...promptBrief } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for product review generation.");
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
                schema: GeneratedProductReviewSchema
            }
        });
        
        if (!output) {
            throw new Error("The AI returned an empty or blocked response.");
        }

        return output;

    } catch (error: any) {
        console.error("Product review generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
