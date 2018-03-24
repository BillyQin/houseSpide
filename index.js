var express = require('express');
var url = require('url');  // 解析操作url
var cheerio  = require('cheerio'); // 服务器端的jquery,获取html
var iconv = require('iconv-lite');
var charset = require('superagent-charset');
var superagent = charset(require('superagent')); // ajax使用的http库

var app = express();
const port = 3000;

// 透明售房网 http://www.tmsf.com/index.jsp
const targetUrl = 'http://www.hzfc.gov.cn/yszmore.php'; // 政府房产网
// var targetUrl = 'https://cnodejs.org';

let getHtml = (url) => {
  return new Promise((resolve, reject) => {
    superagent
    .get(url)
    .charset() // 自动检测编码
    .end((err, res) => {
      resolve(cheerio.load(res.text));
      if (err) {
        console.log(err);
        reject(err);
      }
    });
  })
}

let pageList = ($) => {
  const pages = new Map();
  $('.policy a').each((idx, element) => {
    const href = $(element).attr('href');
    if (href.includes('pid')) {
      pages.set(idx, href);
    }
  });
  return [...pages.values()];
}

let getPageDetail = async (pageList) => {
  let pageInfo = [];
  pageList.forEach(async (item, index) => {
    let newPage = await getHtml(`http://www.hzfc.gov.cn/${item}`).catch(err => console.log(err));
    let attr = newPage('TABLE p.style1').text();
    console.log(index, attr);
    pageInfo.push(attr);
  });
  return pageInfo;
}

app.get('/', async (req, res) => {
  const $ = await getHtml(targetUrl).catch(err => console.log(err));
  let list = pageList($);
  let pageInfo = await getPageDetail(list);
  console.log(pageInfo);
  res.send(pageInfo);
});

var server = app.listen(port, function () {
  console.log('Example app listening at http://localhost:%s', port);
});
