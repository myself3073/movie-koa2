const Koa = require('koa');

const render = require('koa-art-template');

const path = require('path');

const mongoose = require('mongoose');

const { connect,initSchma } = require('./database/init.js');

const app = new Koa();

/*
连接数据库and初始化
 */
;(async()=>{
	await connect();
	initSchma();
	// require('./task/movieData_list.js')
	require('./task/api.js')
	require('./task/videoData.js')
	
})()



render(app, {
  root: path.join(__dirname,'/views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});


app.use(async (ctx,next)=>{
	ctx.render('index',{
		one:1,
		two:"fdafadfadfa",
		three:3
	})
})

app.listen(8000,()=>{
	console.log("服务器启动在8000端口");
});