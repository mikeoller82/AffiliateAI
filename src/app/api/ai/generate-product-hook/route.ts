
import { generateProductHookFlow } from '@/ai/flows/generate-product-hook';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { productDescription, emotion } = await req.json();

    if (!productDescription || !emotion) {
      return NextResponse.json(
        { error: 'Missing productDescription or emotion' },
        { status: 400 }
      );
    }

    const hooks = await generateProductHookFlow.run({
      productDescription,
      emotion,
    });

    return NextResponse.json(hooks);
  } catch (error: any) {
    console.error('Error in generateProductHook API route:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while generating product hooks.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
