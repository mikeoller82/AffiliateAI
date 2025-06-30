
import express from 'express';
import cors from 'cors';
import { run } from '@genkit-ai/core';
import { getGenerateImageFlow } from './ai/flows/generate-image';
import { getGenerateAdCopyFlow } from './ai/flows/generate-ad-copy';
import { getSuggestCTAsFlow } from './ai/flows/suggest-ctas';
import { getGenerateProductReviewFlow } from './ai/flows/generate-product-review';
import { getGenerateProductHookFlow } from './ai/flows/generate-product-hook';
import { getGenerateEmailContentFlow } from './ai/flows/generate-email-content';

// Initialize Genkit
import './ai/genkit-init';

const app = express();
const port = 3001; // The AI server will run on a different port

app.use(cors());
app.use(express.json());

// A simple middleware to handle all flow runs
const runFlowMiddleware = (getFlow: Function) => async (req: express.Request, res: express.Response) => {
  try {
    const result = await run(getFlow(), req.body);
    res.json(result);
  } catch (error: any) {
    console.error(`Error running flow: ${getFlow.name}`, error);
    res.status(500).json({
      error: 'An error occurred while running the AI flow.',
      details: error.message,
    });
  }
};

// Define endpoints for each AI flow
app.post('/api/ai/generate-image', runFlowMiddleware(getGenerateImageFlow));
app.post('/api/ai/generate-ad-copy', runFlowMiddleware(getGenerateAdCopyFlow));
app.post('/api/ai/suggest-ctas', runFlowMiddleware(getSuggestCTAsFlow));
app.post('/api/ai/generate-product-review', runFlowMiddleware(getGenerateProductReviewFlow));
app.post('/api/ai/generate-product-hook', runFlowMiddleware(getGenerateProductHookFlow));
app.post('/api/ai/generate-email-content', runFlowMiddleware(getGenerateEmailContentFlow));

app.listen(port, () => {
  console.log(`AI server listening at http://localhost:${port}`);
});
