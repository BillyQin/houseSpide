const express = require('express');
const app = express();
const { HzfcInfo } = require('./src/hzfc');
const { mtInfo } = require('./src/mt');
const port = 3001;

app.get('/', async (req, res) => {
  res.send(await HzfcInfo());
  await mtInfo();
});

var server = app.listen(port, function () {
  console.log('Example app listening at http://localhost:%s', port);
});
