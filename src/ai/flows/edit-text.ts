'use server';
/**
 * @fileOverview AI flow for editing a piece of text based on an instruction.
 */
import { GoogleGenAI } from "@google/genai";
import { EditTextInput, EditTextOutput } from '../types';

const constructPrompt = (input: Omit<EditTextInput, 'apiKey'>): string => {
  return `
    You are an expert editor. Your task is to modify the following text based on the user's instruction.
    The output should be only the modified text, without any preamble or explanation.

    **Original Text:**
    ---
    ${input.text}
    ---

    **Instruction:**
    ${input.instruction}
  `;
};

export const editText = async (input: EditTextInput): Promise<EditTextOutput> => {
    const { apiKey, ...promptInput } = input;
    
    if (!apiKey) {
        throw new Error("API key is required for editing text.");
    }
    
    const prompt = constructPrompt(promptInput);
    const ai = new GoogleGenAI(apiKey);

    try {
        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash-preview-0514",
            generationConfig: {
                temperature: 0.7,
            }
        });
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        return { editedText: response.text().trim() };

    } catch (error: any) {
        console.error("Text editing error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
        throw new Error("Failed to communicate with the AI service for text editing.");
    }
};
