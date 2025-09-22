const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport size
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    // Wait a bit for any animations or dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take full page screenshot
    console.log('Taking full page screenshot...');
    await page.screenshot({
      path: 'current-design-full.png',
      fullPage: true
    });

    // Take viewport screenshot
    console.log('Taking viewport screenshot...');
    await page.screenshot({
      path: 'current-design-viewport.png',
      fullPage: false
    });

    // Try to navigate to different routes if they exist
    const routes = ['/tasks', '/settings'];

    for (const route of routes) {
      try {
        console.log(`Navigating to ${route}...`);
        await page.goto(`http://localhost:5173${route}`, {
          waitUntil: 'networkidle2',
          timeout: 5000
        });
        await new Promise(resolve => setTimeout(resolve, 1000));

        const filename = `current-design${route.replace('/', '-')}.png`;
        await page.screenshot({
          path: filename,
          fullPage: true
        });
        console.log(`Screenshot saved: ${filename}`);
      } catch (error) {
        console.log(`Could not capture ${route}: ${error.message}`);
      }
    }

    console.log('Screenshots completed successfully!');

  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots();