
process.env.DISABLE_OTEL = 'true'; // Disable OpenTelemetry tracing for this route to prevent timeouts.

import { NextRequest, NextResponse } from 'next/server';
import { generateImage, type ImageGenerationBrief } from '@/ai/flows/generate-image';

export const maxDuration = 30; // Set a 30-second timeout for this route

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, style, apiKey } = body;

    if (typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid input', details: 'Missing or invalid prompt field.' }, { status: 400 });
    }

    const brief: ImageGenerationBrief = { prompt, style, apiKey };
    const result = await generateImage(brief);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in generateImage API route:', error);
    const status = error.message.includes('timed out') ? 504 : 500;
    const details = status === 504 
      ? 'The image generation request timed out. Please try again later or with a simpler prompt.'
      : error.message;
      
    return NextResponse.json(
      { error: 'An error occurred while generating the image.', details },
      { status }
    );
  }
}
