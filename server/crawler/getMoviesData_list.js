
//用puppeteer爬取数据 电影列表
const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=%E7%94%B5%E5%BD%B1`

//延时
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page===1')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await browser.newPage()
  //去那个页面地址爬
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  await sleep(3000)

  await page.waitForSelector('.more')

  //页面class为：more的元素点击多少次
  for (let i = 0; i < 3; i++) {
    await sleep(3000)
    await page.click('.more')
  }
 //回调
  const movieList = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp a')
    var links = []
    //找到元素
    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  browser.close()

  // console.log(movieList)

  //将数据送出去
  process.send({movieList})

  console.log('End visit the target page===1');

  process.exit(0)

})()