"use strict"

const config = require('config');
const express = require('express');

const auth = require('./lib/account/auth')
const log = require('./lib/log')

const app = express();

app.get('/', async function (req, res) {
  const response = await auth.login(config.get('username'), config.get('password'))

  if(response.status == 401){
    log.info("Probably invalid login credentials: Check yours in config/ and cert/")
  } else if (response.status = 200) {
    log.info("Hooray!")
  }
  //var response = await api.get('https://api.test.nordnet.se/next/2')
  //res.send(response)
});


app.listen(3000, () => console.log('nordnet-autotrade is listening on port 3000!'))
