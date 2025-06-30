
// Ensure Genkit is configured before any other imports
import '@/ai/genkit';

import { NextRequest, NextResponse } from 'next/server';
import { run } from '@genkit-ai/core';
import { generateDashboardInsightsFlow } from '@/ai/flows/generate-dashboard-insights';
import { GenerateDashboardInsightsInputSchema } from '@/ai/flows/generate-dashboard-insights';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate the input using the Zod schema
    const validatedBody = GenerateDashboardInsightsInputSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validatedBody.error.format() },
        { status: 400 }
      );
    }
    
    const { metrics, funnels } = validatedBody.data;

    const result = await run(generateDashboardInsightsFlow, { metrics, funnels });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error running generateDashboardInsights flow:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while generating insights.', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
