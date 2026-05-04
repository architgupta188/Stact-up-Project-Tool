import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { env } from './env.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const geminiPro = genAI.getGenerativeModel({
  model: 'gemini-flash-lite-latest',
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.4,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
});
