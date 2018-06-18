"use strict"

const express = require('express');

const log = require('./lib/log')
const scrape = require('./lib/pipeline/datagathering/scrapeNasdaq')

const app = express();

const forceSymbolScraping = process.env.FORCE_SYMBOL_SCRAPING

app.get('/', async function (req, res) {

  let scraping
  try {
    scraping = await scrape.scrapeNasdaq(forceSymbolScraping)
    res.send(scraping)
  } catch (err){
    console.log(err)
  }
});


app.listen(3000, () => console.log('autotrade is listening on port 3000!'))
