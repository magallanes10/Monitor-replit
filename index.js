const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res, false); // Normal scraping without screenshot
});

app.get("/ss", (req, res) => {
  scrapeLogic(res, true); // Scraping with screenshot response
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
