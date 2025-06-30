
import { run } from '@genkit-ai/core';
import { generateFunnelCopy } from './flows/generate-funnel-copy';
import * as dotenv from 'dotenv';

// This is a developer utility to test flows in a Node.js environment.
// To run: `npm run test:flow`

async function testFlow() {
  // Load environment variables from .env file
  dotenv.config();

  try {
    const result = await run(generateFunnelCopy, {
        productDescription: 'An all-in-one platform for digital marketers to build funnels, manage CRM, and automate workflows, powered by cutting-edge AI.',
        copyType: 'Hero Headline',
        userPrompt: 'Make it sound revolutionary for solo creators.',
    });

    console.log('Flow Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error running flow:', error);
  }
}

testFlow();
