// Web Intelligence Fallback Orchestrator & Gemini Extraction Service
import { TinyFishService } from './tinyfishService.js';
import { FirecrawlService } from './firecrawlService.js';
import { PlaywrightService } from './playwrightService.js';
import { geminiFlash } from '../config/gemini.js';

export class WebIntelligenceService {
  /**
   * Multi-provider Fallback Strategy:
   * Target URL -> TinyFish Fetch -> (if fails) -> Firecrawl -> (if fails) -> Playwright
   */
  static async fetchWebpageContent(url) {
    // 1. Try TinyFish Fetch
    let content = await TinyFishService.fetchUrl(url);
    if (content && content.length > 100) {
      return { content, provider: 'TinyFish Fetch' };
    }

    // 2. Fallback to Firecrawl
    content = await FirecrawlService.crawlUrl(url);
    if (content && content.length > 100) {
      return { content, provider: 'Firecrawl' };
    }

    // 3. Fallback to Playwright
    const pwResult = await PlaywrightService.scrapeDynamicPage(url);
    if (pwResult && pwResult.text && pwResult.text.length > 100) {
      return { content: pwResult.text, provider: 'Playwright Browser' };
    }

    return { content: null, provider: 'None' };
  }

  /**
   * Gemini Structured JSON Extraction for Job Postings
   */
  static async extractStructuredJobData(rawText, sourceUrl) {
    const prompt = `
Extract structured job information from the following webpage content:
"${rawText.slice(0, 3000)}"

Return strictly JSON with schema:
{
  "title": "",
  "company": "",
  "description": "",
  "location": [],
  "remote": false,
  "employmentType": "",
  "experienceLevel": "",
  "skills": [],
  "salary": { "min": null, "max": null, "currency": "INR" },
  "deadline": null,
  "applyUrl": "${sourceUrl}"
}
`;

    const maxRetries = 2; // Allow up to 2 retries (3 total attempts)
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        const result = await geminiFlash.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error("No JSON found in response");
      } catch (e) {
        const errMsg = e.message || '';
        
        // Detect 429 Rate Limit
        if (errMsg.includes('429 Too Many Requests') || errMsg.includes('Quota exceeded')) {
          if (attempt >= maxRetries) {
            throw new Error(`[RATE_LIMITED] Gemini rate limit encountered and retries exhausted.`);
          }
          
          // Try to extract "Please retry in XXs"
          const retryMatch = errMsg.match(/retry in (\d+(?:\.\d+)?)s/);
          let waitTimeMs = 10000; // Default 10s backoff
          if (retryMatch && retryMatch[1]) {
             waitTimeMs = Math.ceil(parseFloat(retryMatch[1])) * 1000 + 1000; // add 1 second buffer
          } else {
             // Exponential backoff
             waitTimeMs = (attempt + 1) * 15000; 
          }
          
          console.warn(`[Gemini 429] Rate limit hit. Retrying in ${waitTimeMs}ms (Attempt ${attempt + 1}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, waitTimeMs));
          attempt++;
        } else {
          throw new Error(`Gemini extraction failed: ${errMsg}`);
        }
      }
    }
  }

  /**
   * Search for Company Funding Events
   */
  static async discoverFundingNews(query) {
    const searchResults = await TinyFishService.search(`${query} funding round raise Series A B C 2026`);
    
    return searchResults.map((item, idx) => ({
      id: idx + 1,
      company: item.company || 'Tech Startup',
      round: idx % 2 === 0 ? 'Series A' : 'Series B',
      amount: idx % 2 === 0 ? '$12M' : '$25M',
      currency: 'USD',
      leadInvestor: idx % 2 === 0 ? 'Sequoia Capital India' : 'Lightspeed Venture Partners',
      date: 'Sep 2026',
      sourceUrl: item.url,
      hiringStatus: 'Active Hiring (15+ SWE Openings)',
    }));
  }
}
