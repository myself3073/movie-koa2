const Koa = require('koa');

const render = require('koa-art-template');

const path = require('path');

const mongoose = require('mongoose');

const R = require('ramda');

const { connect,initSchma } = require('./database/init.js');

const MIDDLEWARES = ['router','parcel']


/*  加载中间件使用 ramda */
const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => path.resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}


/*
连接数据库and初始化
 */
;(async()=>{
	await connect();
	initSchma();
	const app = new Koa();
  // require('./task/movieData_list.js')
  // require('./task/api.js')
  // require('./task/videoData.js')
  require('./task/qiniu.js')
	await useMiddlewares(app);
	app.listen(9966,()=>{
	console.log("服务器启动在9966端口");
	});
	
})()

// render(app, {
//   root: path.join(__dirname,'/views'),
//   extname: '.html',
//   debug: process.env.NODE_ENV !== 'production'
// });
