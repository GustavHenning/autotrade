"use strict"

const config = require('config');
const api = require('nordnet-next-api');
const express = require('express');

const app = express();

app.get('/', async function (req, res) {
  console.log(config.get('username'))
  //var response = await api.get('https://api.test.nordnet.se/next/2')
  //res.send(response)
});


app.listen(3000, () => console.log('nordnet-autotrade is listening on port 3000!'))
