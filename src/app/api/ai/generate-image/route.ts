
import { NextRequest, NextResponse } from 'next/server';
import { generateImage, GenerateImageInputSchema } from '@/ai/flows/generate-image';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = GenerateImageInputSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedBody.error.format() }, { status: 400 });
    }
    
    const result = await generateImage(validatedBody.data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error running generateImage flow:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the image.', details: error.message },
      { status: 500 }
    );
  }
}
