import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

export const genAI = new GoogleGenerativeAI(apiKey);

// Model presets
export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
export const geminiPro = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
