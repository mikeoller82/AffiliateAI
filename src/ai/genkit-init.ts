
import { configureGenkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import * as dotenv from 'dotenv';

let isGenkitConfigured = false;

export function initGenkit() {
  if (!isGenkitConfigured) {
    dotenv.config();

    console.log("Initializing Genkit...");
    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is not defined. Please set it in your .env file.");
      throw new Error("Missing GOOGLE_API_KEY");
    }

    configureGenkit({
      plugins: [
        googleAI({ apiKey: process.env.GOOGLE_API_KEY as string }),
      ],
      logLevel: 'debug',
    });

    isGenkitConfigured = true;
    console.log("Genkit initialized successfully.");
  }
}
