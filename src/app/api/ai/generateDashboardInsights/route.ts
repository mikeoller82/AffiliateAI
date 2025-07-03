
import { generateDashboardInsightsFlow } from '@/ai/flows/generate-dashboard-insights';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { metrics, funnels } = await req.json();

    if (!metrics || !funnels) {
      return NextResponse.json(
        { error: 'Missing metrics or funnels' },
        { status: 400 }
      );
    }

    const insights = await generateDashboardInsightsFlow.run({
      metrics,
      funnels,
    });

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error('Error in generateDashboardInsights API route:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while generating dashboard insights.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
