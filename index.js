"use strict"

const config = require('config');
const express = require('express');

const auth = require('./lib/account/auth')
const log = require('./lib/log')
const scrape = require('./lib/data/scrapeNasdaq')

const app = express();

app.get('/', async function (req, res) {
  var scraping = await scrape.scrapeNasdaq()
  res.send(scraping)
});


app.listen(3000, () => console.log('nordnet-autotrade is listening on port 3000!'))
