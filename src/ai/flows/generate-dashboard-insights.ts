
'use server';
/**
 * @fileOverview AI flow for generating dashboard insights.
 * This file has been corrected to use the Genkit library pattern.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { DashboardData, GeneratedInsights } from '../types';

const RecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
});

const GeneratedInsightsSchema = z.object({
  insights: z.array(z.string()),
  recommendations: z.array(RecommendationSchema),
});


const constructPrompt = (data: Omit<DashboardData, 'apiKey'>): string => {
  const funnelData = data.funnels.map(f => `
    *   **Funnel: ${f.name}**
        *   Click-Through Rate (CTR): ${f.ctr}
        *   Opt-In Rate: ${f.optInRate}
  `).join('');

  return `
    You are a world-class expert in Marketing Analysis.
    Your task is to analyze the following marketing data and provide actionable insights and recommendations for a digital marketer.

    **Data Provided:**
    *   **Overall Metrics:**
        *   Total Clicks: ${data.metrics.clicks}
        *   Total Conversions: ${data.metrics.conversions}
        *   Total Commission: $${data.metrics.commission}
    *   **Funnel Performance:**${funnelData}

    **Your Task:**
    1.  Generate a list of 3-4 key, data-driven observations for the "insights" field. These should be concise and directly related to the provided data.
    2.  Generate a list of 3 actionable recommendations for the "recommendations" field. Each recommendation should be practical and aimed at improving the user's marketing performance.
    3.  For each recommendation, provide a title, a brief description, a relevant Lucide icon name (e.g., 'Target', 'DollarSign', 'LineChart'), a call-to-action text, and a relevant relative URL.

    Output structured data that adheres to the provided JSON schema.
  `;
};

export const generateDashboardInsights = async (data: DashboardData): Promise<GeneratedInsights> => {
    const { apiKey, ...promptData } = data;

    if (!apiKey) {
        throw new Error("API key is required for generating dashboard insights.");
    }
    
    const userAi = genkit({
        plugins: [googleAI({ apiKey })],
    });

    const prompt = constructPrompt(promptData);

    try {
        const { output } = await userAi.generate({
            model: 'googleai/gemini-1.5-flash',
            prompt,
            config: {
                temperature: 0.6,
            },
            output: {
                schema: GeneratedInsightsSchema
            }
        });
        
        if (!output) {
             throw new Error("The AI returned an empty or blocked response.");
        }

        return output;

    } catch (error: any) {
        console.error("Dashboard insights generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
