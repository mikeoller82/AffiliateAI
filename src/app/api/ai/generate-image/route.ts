
import { NextRequest, NextResponse } from 'next/server';
import { generateImage, ImageGenerationBrief } from '@/ai/flows/generate-image';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { prompt, style, apiKey } = body;
    if (typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid input', details: 'Missing or invalid prompt field.' }, { status: 400 });
    }

    const brief: ImageGenerationBrief = { prompt, style, apiKey };
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out after 30 seconds.')), 30000)
    );

    const generationPromise = generateImage(brief);
    
    const result = await Promise.race([generationPromise, timeoutPromise]);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in generateImage API route:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the image.', details: error.message },
      { status: 500 }
    );
  }
}
