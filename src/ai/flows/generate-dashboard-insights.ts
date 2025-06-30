'use server';
/**
 * @fileOverview An AI agent that analyzes marketing data to provide insights.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import * as Icons from 'lucide-react';

const FunnelPerformanceInputSchema = z.object({
  name: z.string().describe('The name of the marketing funnel'),
  ctr: z.string().describe('Click-Through Rate (e.g., "2.5%")'),
  optInRate: z.string().describe('Opt-In Rate for lead magnets (e.g., "35%")'),
});

const MetricsInputSchema = z.object({
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


const insightsPrompt = ai.definePrompt({
    name: 'insightsPrompt',
    input: { schema: GenerateDashboardInsightsInputSchema },
    output: { schema: GenerateDashboardInsightsOutputSchema },
    prompt: `You are a world-class expert in Marketing Analysis.
Your task is to analyze the following marketing data and provide actionable insights and recommendations for a digital marketer.

**Data Provided:**
*   **Overall Metrics:**
    *   Total Clicks: {{{metrics.clicks}}}
    *   Total Conversions: {{{metrics.conversions}}}
    *   Total Commission: \${{{metrics.commission}}}
*   **Funnel Performance:**
    {{#each funnels}}
    *   **Funnel: {{name}}**
        *   Click-Through Rate (CTR): {{ctr}}
        *   Opt-In Rate: {{optInRate}}
    {{/each}}

**Your Task:**
1.  Generate a list of 3-4 key, data-driven observations for the "insights" field.
2.  Generate a list of 3 actionable recommendations for the "recommendations" field. The icon must be a valid name from the lucide-react library.`
});


const generateDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'generateDashboardInsightsFlow',
    inputSchema: GenerateDashboardInsightsInputSchema,
    outputSchema: GenerateDashboardInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await insightsPrompt(input, {
        model: 'googleai/gemini-2.0-flash',
        pluginOptions: input.apiKey ? { googleai: { apiKey: input.apiKey } } : undefined,
    });
    
    if (!output) {
      throw new Error("AI failed to generate a response for dashboard insights.");
    }
    return output;
  }
);

export async function generateDashboardInsights(input: GenerateDashboardInsightsInput): Promise<GenerateDashboardInsightsOutput> {
    return await generateDashboardInsightsFlow(input);
}
