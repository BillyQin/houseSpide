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
    const href = $(element).attr('href'); // 获取每个详情页pid编号
    if (href.includes('pid')) {
      pages.set(idx, href);
    }
  });
  return [...pages.values()];
}

let getPageDetail = async (pageList) => {
  let pageInfo = new Map();
  let getDetail = pageList.map(async (item, index) => {
    let newPage = await getHtml(`http://www.hzfc.gov.cn/${item}`).catch(err => console.log(err));
    let attr = newPage('TABLE p.style1').text().trim(); // 获取预售属性是否为住宅
    if ('住宅' === attr && attr.length === 2) {
      // let info = {
      //   company: newPage('TABLE p.style1').text().trim(),
      //   company1: newPage('TABLE TR').eq.text().trim(),
      //   company2: newPage('TABLE p.style1').text().trim(),
      //   company3: newPage('TABLE p.style1').text().trim()
      // }
      console.log(newPage('TABLE TR').eq(2).text().trim());
      pageInfo.set(index, attr);
    }
  })
  await Promise.all(getDetail);
  return [...pageInfo].sort((a, b)=>{return a[0] - b[0]});
  // return [...pageInfo];
}

app.get('/', async (req, res) => {
  const $ = await getHtml(targetUrl).catch(err => console.log(err));
  let list = pageList($);
  let pageInfo = await getPageDetail(list);
  res.send(pageInfo);
});

var server = app.listen(port, function () {
  console.log('Example app listening at http://localhost:%s', port);
});
