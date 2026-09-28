import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Root .env


export class TinyFishService {
  /**
   * TinyFish Search: Discovers company career pages, tech internships, funding news, and job posts.
   */
  static async search(query) {
    if (!query) return [];

    try {
      // TinyFish REST API call
      const url = new URL('https://api.search.tinyfish.ai');
      url.searchParams.append('query', query);
      url.searchParams.append('limit', '10');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-API-Key': process.env.TINYFISH_API_KEY || '',
          'Content-Type': 'application/json',
        },
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        return data.results || [];
      } else if (response) {
        console.warn('TinyFish Search API failed:', response.status, response.statusText);
      } else {
        console.warn('TinyFish Search API request failed (no response)');
      }
    } catch (err) {
      console.warn('TinyFish Search API exception:', err.message);
    }

    // If no results or fetch failed, return empty array
    return [];
  }

  /**
   * TinyFish Fetch: Retrieves webpage HTML and text contents for a target URL.
   */
  static async fetchUrl(targetUrl) {
    try {
      const response = await fetch('https://api.fetch.tinyfish.ai', {
        method: 'POST',
        headers: {
          'X-API-Key': process.env.TINYFISH_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: [targetUrl] }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
           const res = data.results[0];
           return res.text || res.content || res.html || null;
        }
      }
    } catch (err) {
      console.warn('TinyFish Fetch API notice:', err.message);
    }

    return null;
  }
}
