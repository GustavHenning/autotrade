"use strict"

const urls = [
  "http://www.nasdaqomxnordic.com/aktier/listed-companies/stockholm",
  "http://www.nasdaqomxnordic.com/shares/listed-companies/first-north"
]

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const log = require('../log')

const masterJson = {}

async function scrapeNasdaq() {
  /* TODO store results on disc, check on start up and add flag to hard refresh */
  let json = {}
  for (let url of urls){
    json = await scrape(url)
  }

  for(let key of Object.keys(json)){
    masterJson[key] = json[key]
  }
  log.info(Object.keys(masterJson).length + ' symbols in total')
  return masterJson
}

async function scrape(url) {
  return new Promise(function (resolve, reject) {
    request(url, function(error, response, html){
        let $
        if(!error){
            $ = cheerio.load(html);
        } else {
          reject(error)
        }
        let json = {}
        const REAL_NAME=0
        const SYMBOL=1
        const SECTOR=4
        $('#listedCompanies tbody tr').each(function(){
            let row = $(this).children()
            let symbol = $(row[SYMBOL]).text()

            json[symbol] = {
              "name" : $(row[REAL_NAME]).text(),
              "symbol" : symbol,
              "sector" : $(row[SECTOR]).text()
            }
        })
        log.info(Object.keys(json).length + ' symbols from ' + url)
        resolve(json)
    })
  })
}

module.exports = {
  scrapeNasdaq
}
