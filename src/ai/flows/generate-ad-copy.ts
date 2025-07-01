'use server';
/**
 * @fileOverview AI flow for generating ad copy.
 * This has been corrected to strictly follow the required server-side pattern,
 * using environment variables for auth and a single prompt object.
 */
import { GoogleGenAI } from "@google/genai";
import { AdCopyBrief, GeneratedAdCopy } from '../types';

// This helper function correctly combines all instructions into a single
// prompt string, matching the pattern's use of a single `contents` field.
const constructPrompt = (brief: AdCopyBrief): string => {
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

    **Output Format:**
    Return your response as a valid JSON object. Do not wrap it in markdown backticks. 
    The JSON object must have three keys: 
    - "headlines": an array of strings.
    - "primary_text": a string.
    - "descriptions": an array of strings.
  `;
};

export const generateAdCopy = async (brief: AdCopyBrief): Promise<GeneratedAdCopy> => {
    // Correct initialization. This relies on your GOOGLE_API_KEY environment variable.
    const genAI = new GoogleGenAI({});
    
    // Construct the full prompt string from the user's brief.
    const prompt = constructPrompt(brief);

    try {
        // This is the modern, direct API call pattern you specified.
        const result = await genAI.models.generateContent({ 
            model: "gemini-1.5-flash", // Use 1.5-flash for its strong JSON capabilities
            contents: prompt,
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.8,
            }
        });
        
        const response = result.response;
        
        // This check is what's correctly throwing your "empty or blocked" error.
        if (!response || !response.candidates || response.candidates.length === 0) {
            // Check for specific feedback from the API if available.
            if (response?.promptFeedback?.blockReason) {
                const reason = response.promptFeedback.blockReason;
                throw new Error(`Request was blocked by safety filters. Reason: ${reason}.`);
            }
            throw new Error("The AI returned an empty or blocked response.");
        }

        const jsonStr = response.text();
        try {
            const parsedData = JSON.parse(jsonStr);
            if (Array.isArray(parsedData.headlines) && 
                typeof parsedData.primary_text === 'string' && 
                Array.isArray(parsedData.descriptions)) {
                return parsedData;
            } else {
                throw new Error("Invalid JSON structure received from the AI.");
            }
        } catch (e: any) {
            console.error("JSON parsing error:", e.message, "\nRaw AI response:", jsonStr);
            throw new Error("The AI returned a malformed response. Please try again.");
        }

    } catch (error: any) {
        console.error("Ad copy generation error:", error);
        throw new Error(error.message || "Failed to communicate with the AI service.");
    }
};