// Gemini API Service Client for Interact.ai

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function generateGeminiResponse(promptText) {
  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || 'Could not parse response from Gemini API.';
  } catch (error) {
    console.warn('Gemini API request error, using fallback:', error);
    return null; // Return null so caller handles fallback gracefully
  }
}

export async function generateCareerRoadmap(domainInterest, currentSkillLevel) {
  const prompt = `Act as an expert AI Career Counselor for college students. The candidate is interested in '${domainInterest}' and currently at skill level '${currentSkillLevel}'. Suggest a 3-step action plan to reach SDE-1 / high growth tech roles.`;
  
  const result = await generateGeminiResponse(prompt);
  if (result) return result;

  // Fallback response for offline or dev testing
  return `Focus on Data Structures & Algorithms, build 2 full-stack projects, and practice mock interviews on Interact.ai.`;
}
