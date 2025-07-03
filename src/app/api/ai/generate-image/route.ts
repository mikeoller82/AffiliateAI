
import { generateImageFlow } from '@/ai/flows/generate-image';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const imageUrl = await generateImageFlow.run({ prompt, style });

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Error in generateImage API route:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while generating the image.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
