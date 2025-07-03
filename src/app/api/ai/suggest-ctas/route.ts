
import { suggestCtasFlow } from '@/ai/flows/suggest-ctas';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();

    if (!context) {
      return NextResponse.json({ error: 'Missing context' }, { status: 400 });
    }

    const ctas = await suggestCtasFlow.run({ context });

    return NextResponse.json(ctas);
  } catch (error: any) {
    console.error('Error in suggestCTAs API route:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while suggesting CTAs.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
