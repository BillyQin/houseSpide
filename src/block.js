const { getHtml, writeFile } = require('./common');
const request = require('request');
const fs = require('fs');
const slog = require('single-line-log').stdout;

const targetUrl = 'https://explorer.simplechain.com/account/0x6e55b983f8b6221b522373450d905323478e39c3';
const img = './file/hot';

const options = {
  headers: {
    Referer: targetUrl
  }
};

let mtInfo = async () => {
  const $ = await getHtml(targetUrl).catch(err => console.log(err));
  let list = pageList($);
  console.log(list.length)
  // writeFile('./hash.txt',list)
  // console.log('lists',list)
  await downLoad(list);
}

let pageList = ($) => {
  const pages = []
  $('tbody tr td a').each((idx, element) => {
    const href = $(element).attr('href');
    // const title = $(element).text();
    if (href.includes('/transaction/')) {
      pages.push(href)
    }
  });
  return pages;
}

getData = ($) => {
  console.log('get data')
  $('#utf8Input').each((idx, element) => {
    const href = $(element).attr('value');
    console.log('input data', href)
    writeFile('./data', href+'\n')
  });
  return
}

let getSinglePage = async (targetUrl) => {
  const page = await getHtml(targetUrl).catch(err => console.log(err));
  let list = getData(page);
}

let downLoad = async (pageList) => {
  // let i = 1;
  // const len = pageList.size;
  const baseUrl = 'https://explorer.simplechain.com'
  // slog('download: 0%');
  // for (let [key, value] of pageList) {
  //   // await getPageAllImg(key, value);
  //   // slog(`download: ${parseInt((i++)/len * 100)}%`);
  //   getInput(baseUrl+value)
  // }
  pageList.map((item) => {
    getSinglePage(baseUrl+item)
  })
}

module.exports = { mtInfo }
