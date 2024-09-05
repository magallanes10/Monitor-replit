const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res, url, deviceType) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();

    let viewport;
    switch (deviceType) {
      case 'iphone':
        viewport = puppeteer.devices['iPhone X'].viewport;
        break;
      case 'android':
        viewport = puppeteer.devices['Pixel 2'].viewport;
        break;
      case 'tablet':
        viewport = { width: 768, height: 1024 };
        break;
      case 'desktop':
      default:
        viewport = { width: 1080, height: 1024 };
        break;
    }

    await page.setViewport(viewport);

    await page.goto(url, { waitUntil: 'networkidle2' });

    const screenshotPath = `screenshot-${deviceType}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    res.sendFile(`${__dirname}/${screenshotPath}`);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
