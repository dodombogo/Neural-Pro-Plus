import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null
  });
  const page = await browser.newPage();
  const url = 'http://localhost:5173/Neural-Pro-Plus/';

  // Desktop screenshot
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations
  await page.screenshot({
    path: join(__dirname, '../public/screenshot-desktop.png'),
    fullPage: false
  });

  // Mobile screenshot
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
  await page.goto(url);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations
  await page.screenshot({
    path: join(__dirname, '../public/screenshot-mobile.png'),
    fullPage: false
  });

  await browser.close();
  console.log('Screenshots generated successfully!');
}

generateScreenshots().catch(console.error); 