'use server';
/**
 * @fileOverview AI flow for editing a piece of text based on an instruction.
 * This has been corrected to use the gemini-2.5-flash model and initialize the
 * AI client using environment variables, which is the secure, standard practice.
 */
import { GoogleGenAI } from "@google/genai";
import { EditTextInput, EditTextOutput } from '../types';

// The input type no longer needs an apiKey property.
// You should update this in your `types.ts` file.
// export interface EditTextInput {
//   text: string;
//   instruction: string;
// }

export const editText = async (input: EditTextInput): Promise<EditTextOutput> => {
    const { text, instruction } = input;

    // This is the correct initialization. It automatically finds the
    // GOOGLE_API_KEY from your .env.local file.
    const genAI = new GoogleGenAI();
    
    const systemInstruction = `You are an expert editor. Your task is to modify the provided text based on the user's instruction.
You must output ONLY the modified text, without any preamble, explanation, or markdown formatting.`;

    const userContent = `
        **Original Text:**
        ---
        ${text}
        ---

        **Instruction:**
        ${instruction}
    `;
    
    try {
        const result = await genAI.models.generateContent({
            // Corrected model name as you specified.
            model: "gemini-2.5-flash", 
            systemInstruction: systemInstruction,
            contents: userContent,
            generationConfig: {
                temperature: 0.7,
            },
        });

        const response = result.response;
        
        if (!response || !response.candidates || response.candidates.length === 0) {
            if (response?.promptFeedback?.blockReason) {
                const reason = response.promptFeedback.blockReason;
                throw new Error(`Text generation was blocked by safety filters. Reason: ${reason}.`);
            }
            throw new Error("The AI returned an empty or blocked response.");
        }
        
        return { editedText: response.text().trim() };

    } catch (error: any) {
        // This will now catch errors if the GOOGLE_API_KEY is missing or invalid.
        console.error("Text editing error:", error);
        
        // The library throws a specific error if the key is missing.
        // You can check for `error.message.includes('API key')` if you want.
        throw new Error(error.message || "Failed to communicate with the AI service for text editing.");
    }
};
