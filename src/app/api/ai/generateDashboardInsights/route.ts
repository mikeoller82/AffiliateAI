
import { NextRequest, NextResponse } from 'next/server';
import { generateDashboardInsights, DashboardData } from '@/ai/flows/generate-dashboard-insights';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation for the incoming data
    const { metrics, funnels, apiKey } = body;
    if (!metrics || !funnels || !Array.isArray(funnels)) {
        return NextResponse.json({ error: 'Invalid input data', details: 'Missing or invalid "metrics" or "funnels" fields.' }, { status: 400 });
    }
    
    // You could add more specific validation here if needed
    
    const data: DashboardData = { metrics, funnels, apiKey };
    
    const result = await generateDashboardInsights(data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in generateDashboardInsights API route:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while generating insights.', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
