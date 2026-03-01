const { chromium } = require('playwright');

const seeds = [22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/tds2025-01-ga2/scrape-playwright?seed=${seed}`;
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for any content to load
    await page.waitForTimeout(2000);

    // Debug: print the full page content so we can see the structure
    const content = await page.content();
    console.log(`--- Seed ${seed} HTML snippet ---`);
    console.log(content.substring(0, 2000));

    const total = await page.evaluate(() => {
      let sum = 0;
      
      // Try all number-like text in the entire page
      const allElements = document.querySelectorAll('td, th, span, div, p, li');
      allElements.forEach(el => {
        const text = el.innerText?.trim();
        if (text) {
          const num = parseFloat(text.replace(/,/g, ''));
          if (!isNaN(num) && text.match(/^-?[\d,]+\.?\d*$/)) {
            sum += num;
          }
        }
      });
      return sum;
    });

    console.log(`Seed ${seed}: ${total}`);
    grandTotal += total;
  }

  await browser.close();
  console.log(`Total sum of all numbers: ${grandTotal}`);
})();
