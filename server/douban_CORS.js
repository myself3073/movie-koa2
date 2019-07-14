let http = require('http')
let request = require('request')
let fs = require('fs')
let { resolve } = require('path')

// 1. 创建 Server
let server = http.createServer()

server.on('request', function (req, res) {
   res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});//设置response编码为utf-8
  let url = '/201905292307/f7e21f6ddae09d2c54c89da4044b4269/view/movie/M/402460013.mp4'
   console.log("url:"+url);
   //发送请求豆瓣获取json数据
    request({
        url: "http://vt1.doubanio.com"+url,
        method: "GET",
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body) // 请求成功的处理逻辑
            // res.write(JSON.stringify(body))
            console.log("oopp");
            res.end()
        }
    });

})

// 3. 绑定端口号，启动服务
server.listen(3000, function () {
  console.log('running...')
})