var express = require('express');
var url = require('url');  // 解析操作url
var cheerio  = require('cheerio'); // 服务器端的jquery,获取html
var iconv = require('iconv-lite');
var charset = require('superagent-charset');
var superagent = charset(require('superagent')); // ajax使用的http库

var app = express();
const port = 3000;

// 透明售房网 http://www.tmsf.com/index.jsp
var targetUrl = 'http://www.hzfc.gov.cn/yszmore.php'; // 政府房产网

var content = '';
let $ = '';

superagent
  .get(targetUrl)
  .charset() // 自动检测编码
  .end(function (err, res) {
  content = res
});

app.get('/', function (req, res) {
  // $ = cheerio.load(content);
  // let text = $('.policy');
  // console.log(text);
  res.send(content);
});

var server = app.listen(port, function () {
  console.log('Example app listening at http://localhost:%s', port);
});

// function getNoticeList() {
//   let result = [];
// }