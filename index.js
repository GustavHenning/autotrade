"use strict"

const express = require('express');

const log = require('./lib/log')
const symbolsScraper = require('./lib/pipeline/datagathering/scrapeNasdaq')

const app = express();

let forceSymbolScrape = process.env.FORCE_SYMBOL_SCRAPE

app.get('/', async function (req, res) {

  let symbols
  try {
    symbols = await symbolsScraper.scrape(forceSymbolScrape)
    forceSymbolScrape = false
    res.send(symbols)
  } catch (err){
    console.log(err)
  }
});


app.listen(3000, () => console.log('autotrade is listening on port 3000!'))
