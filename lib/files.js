"use strict"

const fs = require('fs')
const mkdirpNative = require('mkdirp')
const path = require('path')
const promisify = require('util').promisify

const mkdir = promisify(mkdirpNative)
const fileExists = promisify(fs.stat)
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const constants = require('./constants')
const log = require('./log')

/* Use this method with a file name as parameter
 and then pass the resulting string to the other methods */
function dataPath(fileName){
  return path.join(constants.DATA_DIR, fileName)
}

async function readJSON(filePath){
  try {
    let exists = await fileExists(filePath)
    if(exists){
      log.info('JSON parsed from ' + filePath)
      return JSON.parse(await readFile(filePath, 'utf8'));
    }
  } catch (err){
    if(err.code == 'ENOENT'){
      log.info(filePath + ' not found on disk')
      return undefined
    } else {
      throw err
    }
  }
}

async function writeJSON(filePath, json){
  try {
    await mkdir(path.dirname(filePath))
    await writeFile(filePath, JSON.stringify(json))
    log.info('JSON data written to ' + filePath)
  } catch (err){
    throw err
  }
}

module.exports = {
  dataPath,
  readJSON,
  writeJSON
}
