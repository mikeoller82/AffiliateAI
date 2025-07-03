
'use server';
/**
 * @fileOverview AI flow for generating marketing email content.
 * This file has been corrected to use the Genkit library pattern.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { CampaignBrief, GeneratedEmail } from '../types';

const GeneratedEmailSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

const constructPrompt = (brief: Omit<CampaignBrief, 'apiKey'>): string => {
  return `
    You are an expert marketing copywriter and CRM specialist. Your task is to generate a compelling marketing email based on the following brief.

    **Campaign Brief:**
    - **Target Audience:** ${brief.audience}
    - **Product/Service:** ${brief.product}
    - **Key Goal:** ${brief.goal}
    - **Desired Tone:** ${brief.tone}

    **Instructions:**
    1.  Create a compelling, attention-grabbing subject line.
    2.  Write a persuasive email body. The body should be in simple HTML format (using tags like <p>, <strong>, <em>, <ul>, <li>, <a>).
    3.  Address the target audience directly.
    4.  Clearly explain the value proposition of the product/service.
    5.  Include a strong call to action related to the campaign goal.
    6.  Ensure the tone of the email matches the desired tone from the brief.

    Output structured data that adheres to the provided JSON schema.
  `;
};

export const generateEmailCampaign = async (brief: CampaignBrief): Promise<GeneratedEmail> => {
    const { apiKey, ...promptBrief } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for email generation.");
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
                schema: GeneratedEmailSchema
            }
        });
        
        if (!output) {
            throw new Error("The AI returned an empty or blocked response.");
        }

        return output;

    } catch (error: any) {
        console.error("Email generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
