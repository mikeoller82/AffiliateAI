
'use server';
/**
 * @fileOverview AI flow for generating marketing email content.
 * This file has been corrected to use the standard Google AI SDK pattern.
 */
import * as genAI from "@google/genai";
import { CampaignBrief, GeneratedEmail } from '../types';

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

    **Output Format:**
    Return your response as a valid JSON object. Do not wrap it in markdown backticks. The JSON object must have two string keys: "subject" and "body".

    Example JSON output:
    {
      "subject": "This is a great subject line.",
      "body": "<p>Hello there,</p><p>This is the email body with <strong>HTML</strong> content.</p><p>Regards,<br>The Team</p>"
    }
  `;
};

export const generateEmailCampaign = async (brief: CampaignBrief): Promise<GeneratedEmail> => {
    const { apiKey, ...promptBrief } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for email generation.");
    }

    const genAIApi = new genAI.GoogleGenerativeAI(apiKey);
    const model = genAIApi.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
        }
    });

    const prompt = constructPrompt(promptBrief);

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        const jsonStr = response.text().trim().replace(/```json\n?|\n?```/g, '');

        try {
            const parsedData = JSON.parse(jsonStr);
            if (typeof parsedData.subject === 'string' && typeof parsedData.body === 'string') {
                return parsedData;
            } else {
                throw new Error("Invalid JSON structure from API.");
            }
        } catch (e: any) {
            console.error("JSON parsing error:", e.message, "\nRaw AI response:", jsonStr);
            throw new Error("The AI returned a malformed response. Please try again.");
        }

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
