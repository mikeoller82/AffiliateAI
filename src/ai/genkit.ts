
import { initGenkit } from './genkit-init';
import { geminiPro, imagen2 } from '@genkit-ai/googleai';

// Initialize Genkit
initGenkit();

// Export the models
export const gemma = geminiPro;
export const imageGen = imagen2;
