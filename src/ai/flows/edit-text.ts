
'use server';
/**
 * @fileOverview AI flow for editing a piece of text based on an instruction.
 * This file has been corrected to use the Genkit library pattern.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { EditTextInput, EditTextOutput } from '../types';

const EditTextOutputSchema = z.object({
  editedText: z.string(),
});

export const editText = async (input: EditTextInput): Promise<EditTextOutput> => {
    const { text, instruction, apiKey } = input;

    if (!apiKey) {
        throw new Error("API key is required for text editing.");
    }

    const userAi = genkit({
        plugins: [googleAI({ apiKey })],
    });

    const systemInstruction = `You are an expert editor. Your task is to modify the provided text based on the user's instruction. You must output ONLY the modified text, without any preamble, explanation, or markdown formatting.`;
    
    const userPrompt = `
        **Original Text:**
        ---
        ${text}
        ---

        **Instruction:**
        ${instruction}
    `;
    
    try {
        const { output } = await userAi.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt: `${systemInstruction}\n\n${userPrompt}`,
            output: {
                schema: EditTextOutputSchema
            }
        });
        
        if (!output) {
            throw new Error("The AI returned an empty or blocked response.");
        }
        
        return output;

    } catch (error: any) {
        console.error("Text editing error:", error);
        if (error.message.includes('API key not valid')) {
            throw new Error("Your API key is invalid. Please check it and try again.");
       }
       if (error.message.includes('400 Bad Request')) {
            throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
       }
       throw new Error("Failed to communicate with the AI service for text editing.");
    }
};
