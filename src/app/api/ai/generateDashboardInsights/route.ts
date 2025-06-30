
import { NextRequest, NextResponse } from 'next/server';
import { generateDashboardInsights, GenerateDashboardInsightsInputSchema } from '@/ai/flows/generate-dashboard-insights';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const validatedBody = GenerateDashboardInsightsInputSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validatedBody.error.format() },
        { status: 400 }
      );
    }
    
    const result = await generateDashboardInsights(validatedBody.data);

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
