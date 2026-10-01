import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Root .env
const apiKey = process.env.GEMINI_API_KEY || '';

export const genAI = new GoogleGenerativeAI(apiKey);

const FALLBACK_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];

function createResilientModel(primaryModelName) {
  const models = [primaryModelName, ...FALLBACK_MODELS.filter(m => m !== primaryModelName)];
  
  const baseModel = genAI.getGenerativeModel({ model: primaryModelName });
  return new Proxy(baseModel, {
    get(target, prop) {
      if (prop === 'generateContent') {
        return async (...args) => {
          let lastErr;
          for (const modelName of models) {
            try {
              const m = genAI.getGenerativeModel({ model: modelName });
              return await m.generateContent(...args);
            } catch (err) {
              lastErr = err;
              console.warn(`[Gemini Model Fallback] ${modelName} notice: ${err.message}, trying fallback...`);
            }
          }
          throw lastErr;
        };
      }
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    }
  });
}

export const geminiFlash = createResilientModel('gemini-3.5-flash-lite');
export const geminiPro = createResilientModel('gemini-3.8-flash');
