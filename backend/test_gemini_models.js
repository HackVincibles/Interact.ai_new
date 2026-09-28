import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const apiKey = process.env.GEMINI_API_KEY || '';
async function run() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.models) {
    console.log("Models available:", data.models.map(m => m.name).join(', '));
  } else {
    console.log("Error:", data);
  }
}
run();
