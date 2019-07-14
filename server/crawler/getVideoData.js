/*
通过电影列表拿到doubanId去拿详细的数据 video
 */
const puppeteer = require('puppeteer')
//某个电影的介绍页面
const base = `https://movie.douban.com/subject/`

// const douBanId = 26909790

// const url = `https://movie.douban.com/trailer/246310/#content`

//延时
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

//这里去nodejs的process模块那里去理解
//当getMoviesData_list.js那里的//将数据送出去 process.send({movieList})时这个触发
process.on('message', async (movieList) => {
    console.log('Start visit the target page===2')
    // console.log(movieList)

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage()

    
        for (let i = 0; i < movieList.length; i++) {
            let doubanId = movieList[i].doubanId
            await page.goto(base + doubanId, {
                waitUntil: 'networkidle2'
            })

            await sleep(1000)

            const result = await page.evaluate(() => {
                var $ = window.$
                var item = $('.related-pic-video')
                if (item && item.length > 0) {
                    let prevVideoSrc = item.attr('href')
                    let prevVideoCover = item.attr('style')
                    prevVideoCover = prevVideoCover.slice(prevVideoCover.indexOf('(') + 1, prevVideoCover.indexOf('?'))
                    return {
                        prevVideoSrc,
                        prevVideoCover
                    }
                }
                return {}
            })

            let videoSrc = ''
            //电影预告片存在，则进去拿视频
            if (result.prevVideoSrc) {
                await page.goto(result.prevVideoSrc, {
                    waitUntil: 'networkidle2'
                })

                await sleep(2000)
                videoSrc = await page.evaluate(() => {
                    var $ = window.$
                    var video = $('source')
                    if (video && video.length > 0) {
                        return video.attr('src')
                    }
                })
            }

            //整理所要的数据(预告短片，豆瓣id,电影封面)，返回回去
            let data = {
                doubanId,
                videoSrc,
                videoCover: result.prevVideoCover
            }

            //将数据(对象)送出去
            process.send(data)
            // console.log('getVideoData.js:将数据(对象)送出去')
        }

    browser.close()
    console.log('End visit the target page===2')
    process.exit(0)

    
})