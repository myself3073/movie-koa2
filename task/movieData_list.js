//子进程处理爬取后的数据
const cp = require('child_process')
const { resolve } = require('path')

const mongoose = require('mongoose')

const Movie = mongoose.model('Movie')



;(async () => {
  //运行爬取的脚本
  const script = resolve(__dirname, '../crawler/getMoviesData_list.js')
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

  
  child.on('message', data => {
    let movieList = data.movieList
    // console.log(movieList)//数组对象
    movieList.forEach(async(ele)=>{
      let movie = await Movie.findOne({
        doubanId:ele.doubanId
      })
      if(!movie){
        movie = new Movie(ele);
        await movie.save()
      }
    })
  })
})()