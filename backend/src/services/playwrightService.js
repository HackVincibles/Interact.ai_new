// Playwright Browser Automation Fallback Service
import { chromium } from 'playwright';

export class PlaywrightService {
  /**
   * Browser automation fallback when normal fetch/crawl is blocked or rendered via heavy client-side JavaScript.
   */
  static async scrapeDynamicPage(url) {
    let browser = null;
    try {
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });
      const page = await context.newPage();
      
      // Timeout guard: 12 seconds max navigation limit
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 });
      const content = await page.content();
      const text = await page.innerText('body').catch(() => '');
      
      await browser.close();
      return { html: content, text };
    } catch (err) {
      if (browser) await browser.close().catch(() => {});
      console.warn('Playwright Service fallback:', err.message);
      return null;
    }
  }
}
