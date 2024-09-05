const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();

const cookiesPath = "cookies.json";

const scrapeLogic = async (res) => {
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

    if (fs.existsSync(cookiesPath)) {
      const cookies = JSON.parse(fs.readFileSync(cookiesPath));
      await page.setCookie(...cookies);
    }

    await page.goto("https://www.marscode.com/dashboard");
    await page.setViewport({ width: 1080, height: 1024 });

    await page.type(".search-box__input", "automate beyond recorder");
    const searchResultSelector = ".search-box__link";
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    const textSelector = await page.waitForSelector("text/Customize and automate");
    const fullTitle = await textSelector.evaluate((el) => el.textContent);
    const logStatement = `The title of this blog post is ${fullTitle}`;
    console.log(logStatement);
    res.send(logStatement);

    const cookies = await page.cookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));

    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    console.log("Screenshot saved.");

    // Browser will remain open without closing.
    
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  }
};

module.exports = { scrapeLogic };
