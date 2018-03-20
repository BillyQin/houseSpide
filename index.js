var express = require('express');
var url = require('url');  // 解析操作url
var superagent  = require('superagent'); // ajax使用的http库
var cheerio  = require('cheerio'); // 服务器端的jquery,获取html

var app = express();
const port = 3000;

// 透明售房网 http://www.tmsf.com/index.jsp
var targetUrl = 'http://www.hzfc.gov.cn/yszmore.php'; // 政府房产网

var content = '';

superagent
  .get(targetUrl)
  // .set('charset', 'utf-8')
  .charset('gbk')
  .end(function (err, res) {
  content = res
});

app.get('/', function (req, res) {
  res.send(content);
});

var server = app.listen(port, function () {
  console.log('Example app listening at http://localhost:%s', port);
});