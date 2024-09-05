const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/ss", (req, res) => {
  const url = req.query.url;
  const device = req.query.device || 'desktop';

  if (!url) {
    return res.send("Error: URL is required.");
  }

  scrapeLogic(res, url, device);
});

app.get("/", (req, res) => {
  res.send("Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
