import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1).default('postgres://postgres:postgres@localhost:5432/ventureiq'),
  JWT_SECRET: z.string().min(32).default('super-secret-key-that-is-at-least-32-chars-long'),
  JWT_REFRESH_SECRET: z.string().min(32).default('another-super-secret-key-that-is-at-least-32-chars-long'),
  GEMINI_API_KEY: z.string().min(1),
  NEWS_API_KEY: z.string().default(''),
});

export const env = envSchema.parse(process.env);
