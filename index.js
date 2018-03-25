const express = require('express');
const app = express();
const { HzfcInfo } = require('./hzfc');
const port = 3000;

app.get('/', async (req, res) => {
  res.send(await HzfcInfo());
});

var server = app.listen(port, function () {
  console.log('Example app listening at http://localhost:%s', port);
});
