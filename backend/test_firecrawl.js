import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
async function run() {
  const { FirecrawlService } = await import('./src/services/firecrawlService.js');
  const result = await FirecrawlService.crawlUrl("https://careers.google.com");
  if (result && result.length > 0) {
    console.log("Response received: YES");
    console.log("Usable result: YES");
  } else {
    console.log("Response received: YES (but empty/failed)");
    console.log("Usable result: NO");
  }
}
run();
