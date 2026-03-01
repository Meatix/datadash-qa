const { chromium } = require('playwright');

const seeds = [22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const total = await page.evaluate(() => {
      let sum = 0;
      // Get ALL text content and extract numbers
      const body = document.body.innerText;
      const numbers = body.match(/-?\d+(\.\d+)?/g);
      if (numbers) {
        numbers.forEach(n => {
          sum += parseFloat(n);
        });
      }
      return sum;
    });

    console.log(`Seed ${seed}: ${total}`);
    grandTotal += total;
  }

  await browser.close();
  console.log(`Total sum of all numbers: ${grandTotal}`);
})();
