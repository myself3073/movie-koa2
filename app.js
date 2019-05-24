const Koa = require('koa');

const render = require('koa-art-template');

const path = require('path');

const app = new Koa();

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