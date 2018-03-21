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
// var targetUrl = 'https://cnodejs.org';

function getSuperagent(resquest) {
  superagent
  .get(targetUrl)
  .charset() // 自动检测编码
  .end((err, res) => {
    var $ = cheerio.load(res.text);
    var items = [];
    $('.policy a').each(function (idx, element) {
      var $element = $(element);
      items.push(
        $element.attr('href')
      );
    });
    items.push({length: items.length});
    resquest.send(items);
  });
}

app.get('/', function (req, res) {
  getSuperagent(res);
});

var server = app.listen(port, function () {
  console.log('Example app listening at http://localhost:%s', port);
});
