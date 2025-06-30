
import { NextRequest, NextResponse } from 'next/server';

const AI_SERVER_URL = 'http://localhost:3001/api/ai/suggest-ctas';

export async function POST(req: NextRequest) {
  try {
    const response = await fetch(AI_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(await req.json()),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error proxying to AI server:', error);
    return NextResponse.json(
      { error: 'An error occurred while proxying to the AI server.' },
      { status: 500 }
    );
  }
}
