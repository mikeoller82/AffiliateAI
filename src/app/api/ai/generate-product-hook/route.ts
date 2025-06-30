
import { NextRequest, NextResponse } from 'next/server';
import { generateProductHook, GenerateProductHookInputSchema } from '@/ai/flows/generate-product-hook';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = GenerateProductHookInputSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedBody.error.format() }, { status: 400 });
    }
    
    const result = await generateProductHook(validatedBody.data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error running generateProductHook flow:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating product hooks.', details: error.message },
      { status: 500 }
    );
  }
}
