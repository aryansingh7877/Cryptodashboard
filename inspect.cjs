const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://lovable.dev/projects/5986d60c-f259-4993-8a6f-35f906fcdd34', { waitUntil: 'networkidle2' });
  
  // Wait a bit for any dynamic content to load
  await new Promise(r => setTimeout(r, 5000));
  
  // Look for iframes (the preview is usually an iframe)
  const iframes = await page.frames();
  let targetFrame = iframes.find(f => f.url().includes('lovableproject.com'));
  
  if (!targetFrame) {
    console.log("No lovableproject iframe found. Trying to find any iframe with a body.");
    targetFrame = iframes.length > 1 ? iframes[1] : iframes[0];
  }

  if (targetFrame) {
    const bgInfo = await targetFrame.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      
      // Also look for root/app wrappers
      const root = document.getElementById('root') || document.querySelector('#__next') || body;
      const rootStyle = window.getComputedStyle(root);
      
      // Look for a grid pattern SVG
      const svg = document.querySelector('svg');
      let svgHtml = '';
      if (svg) {
        svgHtml = svg.outerHTML;
      }
      
      return {
        body: {
          backgroundColor: computedStyle.backgroundColor,
          backgroundImage: computedStyle.backgroundImage,
          backgroundSize: computedStyle.backgroundSize,
          backgroundPosition: computedStyle.backgroundPosition,
        },
        root: {
          backgroundColor: rootStyle.backgroundColor,
          backgroundImage: rootStyle.backgroundImage,
        },
        svgHtml: svgHtml.substring(0, 500)
      };
    });
    console.log(JSON.stringify(bgInfo, null, 2));
    
    // Also capture full computed styles of body to find css variables
    const cssVars = await targetFrame.evaluate(() => {
        const root = document.documentElement;
        const styles = window.getComputedStyle(root);
        return {
            background: styles.getPropertyValue('--background'),
            foreground: styles.getPropertyValue('--foreground')
        };
    });
    console.log("CSS Vars:", cssVars);
    
  } else {
    console.log("No target frame.");
  }
  
  await browser.close();
})();
