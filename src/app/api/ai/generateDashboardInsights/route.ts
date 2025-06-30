
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Dynamically import Genkit-related modules
    const { run } = await import('@genkit-ai/core');
    const { generateDashboardInsightsFlow, GenerateDashboardInsightsInputSchema } = await import('@/ai/flows/generate-dashboard-insights');
    
    // Initialize Genkit inside the request
    await import('@/ai/genkit-init').then(module => module.initGenkit());

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
