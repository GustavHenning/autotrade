"use strict"
/** src: https://api.test.nordnet.se/projects/api/wiki/Nodejs_example */
const constants = require('./../constants')
const log = require('./../log')

const util = require('util')
const fs = require('fs')
const ursa = require('ursa')
const tls = require('tls')

const api = require('nordnet-next-api');

/* TODO Add method to "touch" to the api let the session stay alive
  if we compute longer than the maximum alive time for the session
  https://api.test.nordnet.se/api-docs/index.html#!/login/touch_session  */

async function login(user, pass) {
  const auth = encryptLogin(user, pass, constants.CERT)

  const jsonData = {
    service: constants.SERVICE,
    auth: auth
  };

  const loginUrl = constants.BASE_URL + constants.API_VERSION + '/login'
  var response = ""
  try {
     return await api.post(loginUrl, jsonData)
   } catch(e){
     e = e["response"]
     log.error(e.status + ": " + e.statusText)
     return e
   }
}

function encryptLogin(user, pass, keyfile) {
  var rsaPublic = fs.readFileSync(keyfile, 'ascii');
  var key = ursa.createPublicKey(rsaPublic, 'utf8');

  if (!key) {
    console.log('KEY error');
  }

  var auth = new Buffer(user).toString('base64');
  auth += ':';
  auth += new Buffer(pass).toString('base64');
  auth += ':';
  auth += new Buffer('' + new Date().getTime()).toString('base64');
  return key.encrypt(auth, 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
}


module.exports = {
  login
}
