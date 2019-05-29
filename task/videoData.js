//子进程处理爬取后的数据
const cp = require('child_process')
const { resolve } = require('path')

const mongoose = require('mongoose')
// `Movie` is a "Model", a subclass of `mongoose.Model`.
const Movie = mongoose.model('Movie')

const Category = mongoose.model('Category')

;(async () => {

  console.log('videoData.js:start...');

  //Movie.find() return a document 
  let movies = await Movie.find({
    $or: [
      { video: { $exists: false }},
      { video: null }
    ]
  })

  //运行爬取的脚本
  const script = resolve(__dirname, '../crawler/getVideoData.js')
  const child = cp.fork(script, [])
  //检测是否被处理过
  let invoked = false

  child.on('error', err => {
    if (invoked) return

    invoked = true
  
    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return

    invoked = true
    let err = code === 0 ? null : new Error('exit code ' + code)

    console.log(err)
  })

  child.on('message', async data => {
    let doubanId = data.doubanId
    let movie = await Movie.findOne({
      doubanId: doubanId
    })
    if (data.videoSrc) {
      movie.video = data.videoSrc
      movie.cover = data.videoCover
      await movie.save()
    } else {
      await movie.remove()

      let movieTypes = movie.movieTypes

      for (let i = 0; i < movieTypes.length; i++) {
        let type = movieTypes[i]
        let cat = await Category.findOne({
          name: type
        })
        if (cat && cat.movies) {
          let idx = cat.movies.indexOf(movie._id)

          if (idx > -1) {
            cat.movies = cat.movies.splice(idx, 1)
          }

          await cat.save()
        }
      }
    }
  })
    // console.log(movies)
    child.send(movies)
    console.log('videoData.js:end...')
    
})()