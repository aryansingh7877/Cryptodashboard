const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://lovable.dev/projects/5986d60c-f259-4993-8a6f-35f906fcdd34', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 8000));
  
  const iframes = page.frames();
  for (let i = 0; i < iframes.length; i++) {
    const f = iframes[i];
    console.log("Frame", i, ":", f.url());
    try {
      const info = await f.evaluate(() => {
        const root = document.getElementById('root') || document.body;
        return {
          id: root.id,
          html: root.innerHTML.substring(0, 200),
          bg: window.getComputedStyle(document.body).backgroundColor,
          bgImg: window.getComputedStyle(document.body).backgroundImage
        };
      });
      console.log("Info:", info);
    } catch(e) {
      console.log("Error evaluating frame", i, e.message);
    }
  }
  
  await browser.close();
})();
