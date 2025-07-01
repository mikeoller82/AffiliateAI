
import { configureGenkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { generate } from '@genkit-ai/ai';
import * as dotenv from 'dotenv';

let isGenkitConfigured = false;
let genkitInstance: any = null;

export function initGenkit() {
  if (!isGenkitConfigured) {
    try {
      // Load environment variables
      dotenv.config();

      console.log("Initializing Genkit...");
      
      // Check for API key
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        console.error("GOOGLE_API_KEY is not defined. Please set it in your .env file.");
        throw new Error("Missing GOOGLE_API_KEY environment variable");
      }

      // Configure Genkit
      genkitInstance = configureGenkit({
        plugins: [
          googleAI({ 
            apiKey: apiKey,
            // Optional: specify which models to enable
            models: ['gemini-2.0-flash-preview-image-generation', 'gemini-pro', 'gemini-pro-vision']
          }),
        ],
        logLevel: 'debug',
        // Optional: enable telemetry for better debugging
        enableTracingAndMetrics: false,
      });

      isGenkitConfigured = true;
      console.log("Genkit initialized successfully.");
      
    } catch (error) {
      console.error("Failed to initialize Genkit:", error);
      isGenkitConfigured = false;
      throw error;
    }
  }
  
  return genkitInstance;
}

// Create AI instance with proper initialization
export const ai = {
  generate: async (config: any) => {
    // Ensure Genkit is initialized before any AI operations
    if (!isGenkitConfigured) {
      initGenkit();
    }
    
    try {
      // Use the generate function from Genkit
      const result = await generate(config);
      return result;
    } catch (error) {
      console.error("AI generation error:", error);
      throw error;
    }
  }
};

// Alternative initialization for dynamic API keys
export function initGenkitWithApiKey(apiKey: string) {
  try {
    console.log("Initializing Genkit with provided API key...");
    
    if (!apiKey) {
      throw new Error("API key is required");
    }

    const instance = configureGenkit({
      plugins: [
        googleAI({ 
          apiKey: apiKey,
          models: ['gemini-2.0-flash-preview-image-generation', 'gemini-pro', 'gemini-pro-vision']
        }),
      ],
      logLevel: 'debug',
      enableTracingAndMetrics: false,
    });

    console.log("Genkit initialized successfully with provided API key.");
    return instance;
    
  } catch (error) {
    console.error("Failed to initialize Genkit with API key:", error);
    throw error;
  }
}

// Utility function to check if Genkit is properly configured
export function isGenkitReady(): boolean {
  return isGenkitConfigured;
}

// Reset function for testing or reconfiguration
export function resetGenkit() {
  isGenkitConfigured = false;
  genkitInstance = null;
  console.log("Genkit configuration reset.");
}

// Export the initialization function for auto-initialization
initGenkit();
