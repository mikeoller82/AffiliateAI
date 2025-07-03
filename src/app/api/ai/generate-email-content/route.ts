
import { generateEmailContentFlow } from '@/ai/flows/generate-email-content';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { audience, product, goal, tone } = await req.json();

    if (!audience || !product || !goal || !tone) {
      return NextResponse.json(
        { error: 'Missing audience, product, goal, or tone' },
        { status: 400 }
      );
    }

    const emailContent = await generateEmailContentFlow.run({
      audience,
      product,
      goal,
      tone,
    });

    return NextResponse.json(emailContent);
  } catch (error: any) {
    console.error('Error in generateEmailContent API route:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while generating email content.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
