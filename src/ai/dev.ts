
import { run } from '@genkit-ai/core';
import { initGenkit } from '../genkit';

// This is a developer utility to test flows in a Node.js environment.
// It's not part of the main application bundle.
// To run: `npx ts-node -r dotenv/config src/ai/dev.ts`

async function testFlow() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY environment variable not set.');
    return;
  }
  
  initGenkit(apiKey);

  try {
    const funnelCopyFlow = (await import('./flows/generate-funnel-copy')).generateFunnelCopyFlow;
    const result = await run(funnelCopyFlow, {
        productName: 'HighLaunchPad AI',
        productDescription: 'An all-in-one platform for digital marketers to build funnels, manage CRM, and automate workflows, powered by cutting-edge AI.',
        targetAudience: 'Digital marketing agencies and solo entrepreneurs',
    });

    console.log('Flow Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error running flow:', error);
  }
}

testFlow();
