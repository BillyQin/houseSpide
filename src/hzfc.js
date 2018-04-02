const { getHtml } = require('./common');

const targetUrl = 'http://www.hzfc.gov.cn/yszmore.php'; // 政府房产网

let HzfcInfo = async () => {
  const $ = await getHtml(targetUrl).catch(err => console.log(err));
  let list = pageList($);
  return await getPageDetail(list);
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

// 获取最新预售证中住宅的信息
let getPageDetail = async (pageList) => {
  let pageInfo = [];
  let getDetail = pageList.map(async (item, index) => {
    let newPage = await getHtml(`http://www.hzfc.gov.cn/${item}`).catch(err => console.log(err));
    let attr = newPage('TABLE p.style1').text().trim(); // 获取预售属性是否为住宅
    if ('住宅' === attr && attr.length === 2) {
      let info = {
        id: index,
        company: newPage('TABLE TR').next().children('TD').first().children('div').children('div').text().trim(),
        name: newPage('TABLE TR').next().children('TD').eq(1).children('p').text().trim(),
        address: newPage('TABLE TR').next().children('TD').eq(2).text().trim(),
        attr: attr,
        number: newPage('TABLE TR').next().children('TD').eq(4).children('div').text().trim(),
        confirmTime: newPage('TABLE TR').next().children('TD').last().text().trim()
      }
      pageInfo.push(info);
    }
  })
  await Promise.all(getDetail);
  return pageInfo.sort((a, b) => {
    return a.id - b.id
  })
}

module.exports = { HzfcInfo }
