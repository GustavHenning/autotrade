"use strict"

const request = require('request')
const cheerio = require('cheerio')
const log = require('../../log')
const files = require('../../files')

const dataFileName = "symbols.json"
const dataPath = files.dataPath(dataFileName)

const urls = [
  "http://www.nasdaqomxnordic.com/aktier/listed-companies/stockholm",
  "http://www.nasdaqomxnordic.com/shares/listed-companies/first-north"
]

async function scrapeNasdaq(forceScraping) {
  try {
    if(!forceScraping){
      let symbols = await loadSymbols()
      if(symbols) return symbols
    }
    let masterJson = {}
    let json = {}

    for (let url of urls){
      json = await scrape(url)
      /* Append result */
      for(let key of Object.keys(json)){
        masterJson[key] = json[key]
      }
      /* Respect the website */
      await sleep(500)
    }
    log.info(Object.keys(masterJson).length + ' symbols in total')
    await saveSymbols(masterJson)
    return masterJson
  } catch(err){
    throw err
  }
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

async function loadSymbols(){
  try {
    return await files.readJSON(dataPath)
  } catch(err){
    throw err
  }
}

async function saveSymbols(json) {
  try {
    await files.writeJSON(dataPath, json)
  } catch (err){
    throw err
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  scrapeNasdaq
}
