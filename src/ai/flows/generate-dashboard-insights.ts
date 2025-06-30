
'use server';
/**
 * @fileOverview An AI agent that analyzes marketing data to provide insights.
 * This flow is designed to be called from a server environment.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import * as Icons from 'lucide-react';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

export const FunnelPerformanceInputSchema = z.object({
  name: z.string().describe('The name of the marketing funnel'),
  ctr: z.string().describe('Click-Through Rate (e.g., "2.5%")'),
  optInRate: z.string().describe('Opt-In Rate for lead magnets (e.g., "35%")'),
});

export const MetricsInputSchema = z.object({
  clicks: z.number().describe('Total clicks across all funnels'),
  conversions: z.number().describe('Total conversions or sales'),
  commission: z.number().describe('Total affiliate commission earned in USD'),
});

export const GenerateDashboardInsightsInputSchema = z.object({
  metrics: MetricsInputSchema,
  funnels: z.array(FunnelPerformanceInputSchema),
  apiKey: z.string().optional().describe('User-provided Google AI API Key.'),
});
export type GenerateDashboardInsightsInput = z.infer<typeof GenerateDashboardInsightsInputSchema>;

export const GenerateDashboardInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe("Bulleted list of key observations and insights from the data."),
  recommendations: z.array(z.object({
    title: z.string().describe("The main headline for the recommendation."),
    description: z.string().describe("A brief explanation of the recommendation."),
    icon: z.string().describe("A relevant Lucide icon name (e.g., 'Target', 'DollarSign', 'LineChart')."),
    ctaText: z.string().describe("The call-to-action text for the button."),
    ctaLink: z.string().describe("The relative URL for the call-to-action button (e.g., '/dashboard/funnels')."),
  })),
});
export type GenerateDashboardInsightsOutput = z.infer<typeof GenerateDashboardInsightsOutputSchema>;

export async function generateDashboardInsights(input: GenerateDashboardInsightsInput): Promise<GenerateDashboardInsightsOutput> {
    const dynamicAI = input.apiKey ? genkit({ plugins: [googleAI({ apiKey: input.apiKey })] }) : ai;
    
    const funnelDetails = input.funnels.map(f =>
        `*   **Funnel: ${f.name}**
    *   Click-Through Rate (CTR): ${f.ctr}
    *   Opt-In Rate: ${f.optInRate}`
    ).join('\n');

    const prompt = `You are a world-class expert in Marketing Analysis.
Your task is to analyze the following marketing data and provide actionable insights and recommendations for a digital marketer.

**Data Provided:**
*   **Overall Metrics:**
    *   Total Clicks: ${input.metrics.clicks}
    *   Total Conversions: ${input.metrics.conversions}
    *   Total Commission: $${input.metrics.commission}
*   **Funnel Performance:**
${funnelDetails}

**Your Task:**
Generate a JSON object with two keys: "insights" and "recommendations".
1.  **insights**: A bulleted list of 3-4 key, data-driven observations.
2.  **recommendations**: A list of 3 actionable recommendations with the structure: \`{ title, description, icon, ctaText, ctaLink }\`. The icon must be a valid name from the lucide-react library.

Return only the raw JSON object.`;

    const { output } = await dynamicAI.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: prompt,
      output: {
        format: 'json',
        schema: GenerateDashboardInsightsOutputSchema,
      },
    });

    if (!output) {
      throw new Error("AI failed to generate a response. The model may have returned empty output.");
    }
    return output;
}
