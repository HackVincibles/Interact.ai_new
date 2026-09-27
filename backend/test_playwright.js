import { chromium } from 'playwright';
(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent('<h1>Hello PDF</h1><p>Selectable text</p>');
    await page.pdf({ path: 'test.pdf' });
    await browser.close();
    console.log('PDF success');
  } catch(e) {
    console.error('PDF error', e);
  }
})();
