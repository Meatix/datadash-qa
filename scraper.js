const { chromium } = require('playwright');

const seeds = [22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/tds2025-01-ga2/scrape-playwright?seed=${seed}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    const total = await page.evaluate(() => {
      let sum = 0;
      document.querySelectorAll('table td, table th').forEach(cell => {
        const num = parseFloat(cell.innerText.replace(/,/g, ''));
        if (!isNaN(num)) sum += num;
      });
      return sum;
    });

    console.log(`Seed ${seed}: ${total}`);
    grandTotal += total;
  }

  await browser.close();
  console.log(`Total sum of all numbers: ${grandTotal}`);
})();
