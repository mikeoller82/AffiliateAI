
'use server';
/**
 * @fileOverview An AI agent that analyzes marketing data to provide insights.
 * This flow is designed to be called from a server environment.
 *
 * - generateDashboardInsights - A function that handles the analysis process.
 * - GenerateDashboardInsightsInput - The input type for the function.
 * - GenerateDashboardInsightsOutput - The return type for the function.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import * as prompts from '../prompts';
import { funnelTemplates } from '@/lib/funnel-templates';

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

// This exported function will be the primary way server-side components or API routes interact with the flow.
export async function generateDashboardInsights(input: GenerateDashboardInsightsInput): Promise<GenerateDashboardInsightsOutput> {
    return generateDashboardInsightsFlow(input);
}


export const generateDashboardInsightsFlow = ai.defineFlow(
    {
      name: 'generateDashboardInsightsFlow',
      inputSchema: GenerateDashboardInsightsInputSchema,
      outputSchema: GenerateDashboardInsightsOutputSchema,
    },
    async (input) => {
        const prompt = prompts.generateDashboardInsights(input.metrics, input.funnels);
        
        const llmResponse = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            prompt: prompt,
            output: {
                format: 'json',
                schema: GenerateDashboardInsightsOutputSchema,
            },
        });

        const output = llmResponse.output;
        if (!output) {
            throw new Error("AI failed to generate a response. The model may have returned empty output.");
        }
        return output;
    }
);
