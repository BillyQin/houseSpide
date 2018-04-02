const { getHtml } = require('./common');
const request = require('request');
const fs = require('fs');
const slog = require('single-line-log').stdout;

const targetUrl = 'http://www.mzitu.com/hot';
const rosi = 'http://www.mzitu.com/search/%E5%B0%A4%E6%9E%9C%E7%BD%91/';
const img = './file/hot';

const options = {
  headers: {
    Referer: targetUrl
  }
};

let mtInfo = async () => {
  const $ = await getHtml(targetUrl).catch(err => console.log(err));
  let list = pageList($);
  await downLoad(list);
}

let pageList = ($) => {
  const pages = new Map();
  $('#pins li a').each((idx, element) => {
    const href = $(element).attr('href');
    const title = $(element).text();
    pages.set(title, href);
  });
  return pages;
}

let downloadImg = (fpath, url) => {
  return new Promise((resolve, reject) => {
    options.url = url;
    request(options)
    .on('error', ()=>{
      reject()
    })
    .pipe(fs.createWriteStream(fpath))
    .on('close', ()=>{
      resolve();
    });
  })
}

let getPageAllImg = async (fpath, value) => {
  let dir = img + fpath;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let page = await getHtml(value).catch(err => console.log(err));
  let allPages = parseInt(page('.pagenavi span').eq(-2).text());
  for (let i = 1; i <= allPages; i++) {
    let page_one = await getHtml(i===1? value:`${value}/${i}`).catch(err => console.log(err));
    await downloadImg(`${dir}/${i}.jpg`, page_one('.main-image img').attr('src')).catch(err => console.log(err));
  }
}

let downLoad = async (pageList) => {
  let i = 1;
  const len = pageList.size;
  slog('download: 0%');
  for (let [key, value] of pageList) {
    await getPageAllImg(key, value);
    slog(`download: ${parseInt((i++)/len * 100)}%`);
  }
  slog('download finish!');
}

module.exports = { mtInfo }
