// Firecrawl Website Crawling Service
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Root .env
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || '';

export class FirecrawlService {
  /**
   * Crawls a company career portal or multi-page job board.
   */
  static async crawlUrl(url) {
    if (!url) return null;

    try {
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        },
        body: JSON.stringify({
          url,
          formats: ['markdown', 'html'],
          onlyMainContent: true,
        }),
      });
      console.log('Firecrawl HTTP status:', response.status);
      if (response && response.ok) {
        const data = await response.json();
        return data.data?.markdown || data.data?.html || null;
      }
    } catch (err) {
      console.warn('Firecrawl API notice:', err.message);
    }

    return null;
  }
}
