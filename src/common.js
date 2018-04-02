const charset = require('superagent-charset');
const superagent = charset(require('superagent')); // ajax使用的http库
const cheerio  = require('cheerio'); // 服务器端的jquery,获取html 参考http://cnodejs.org/topic/5203a71844e76d216a727d2e
const fs = require('fs');

let getHtml = (url) => {
  return new Promise((resolve, reject) => {
    superagent
    .get(url)
    .charset() // 自动检测编码
    .end((err, res) => {
      resolve(cheerio.load(res['text']));
      if (err) {
        console.log(url, err);
        reject(err);
      }
    });
  })
}

let readFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      resolve(data.toString());
      reject(err);
    })
  })
}

module.exports = { getHtml, readFile }
