import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
async function run() {
  try {
    const result = await model.generateContent("Reply with exactly: GEMINI_CONNECTION_TEST_OK");
    console.log("Status: 200 / successful");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.log("Gemini Error:", error.status || "Unknown", error.message);
  }
}
run();
