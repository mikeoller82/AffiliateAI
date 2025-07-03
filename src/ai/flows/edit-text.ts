
'use server';
/**
 * @fileOverview AI flow for editing a piece of text based on an instruction.
 * This file has been corrected to use the standard Google AI SDK pattern.
 */
import * as genAI from "@google/genai";
import { EditTextInput, EditTextOutput } from '../types';

export const editText = async (input: EditTextInput): Promise<EditTextOutput> => {
    const { text, instruction, apiKey } = input;

    if (!apiKey) {
        throw new Error("API key is required for text editing.");
    }

    const genAIApi = new genAI.GoogleGenerativeAI(apiKey);
    const model = genAIApi.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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
        const result = await model.generateContent([systemInstruction, userPrompt]);
        const response = result.response;
        
        if (!response || !response.candidates || response.candidates.length === 0) {
            if (response?.promptFeedback?.blockReason) {
                throw new Error(`Text generation was blocked. Reason: ${response.promptFeedback.blockReason}.`);
            }
            throw new Error("The AI returned an empty or blocked response.");
        }
        
        return { editedText: response.text().trim() };

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
