import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Root .env
const apiKey = process.env.GEMINI_API_KEY || '';

export const genAI = new GoogleGenerativeAI(apiKey);

// Model presets
export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
export const geminiPro = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
