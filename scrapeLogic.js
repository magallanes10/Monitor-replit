const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();

const cookiesPath = "cookies.json";

const scrapeLogic = async (res, screenshot = false) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
      "--ignore-certificate-errors",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--disable-dev-shm-usage"
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();

    if (fs.existsSync(cookiesPath)) {
      try {
        const cookies = JSON.parse(fs.readFileSync(cookiesPath));
        await page.setCookie(...cookies);
      } catch (err) {
        console.error("Error loading cookies:", err);
      }
    }

    try {
      await page.goto("https://replit.com/@Jonellmagallanes10/Puppeteer-render#index.js", { waitUntil: 'networkidle2' });
    } catch (err) {
      console.error("Error navigating to the site:", err);
    }

    await page.setViewport({ width: 1080, height: 1024 });

    if (screenshot) {
      await page.screenshot({ path: "screenshot.png", fullPage: true });
      res.sendFile(`${__dirname}/screenshot.png`);
    } else {
      const fullTitle = await page.title();
      const logStatement = `The title of the page is ${fullTitle}`;
      console.log(logStatement);
      res.send(logStatement);
    }

    const newCookies = await page.cookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(newCookies, null, 2));

  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
