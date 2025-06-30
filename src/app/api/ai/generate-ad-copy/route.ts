
import { NextRequest, NextResponse } from 'next/server';
import { generateAdCopy, GenerateAdCopyInputSchema } from '@/ai/flows/generate-ad-copy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = GenerateAdCopyInputSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedBody.error.format() }, { status: 400 });
    }
    
    const result = await generateAdCopy(validatedBody.data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error running generateAdCopy flow:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating ad copy.', details: error.message },
      { status: 500 }
    );
  }
}
