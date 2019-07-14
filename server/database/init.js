
//mongoose的用法：https://mongoosejs.com/docs/api.html#mongoose_Mongoose

//const mongoose = module.exports = exports = new Mongoose({
//   [defaultMongooseSymbol]: true
// });
const mongoose = require('mongoose');

const glob = require('glob');

const path = require('path');

const myConfig = require('../../config')

const db = myConfig.douban.db;

//使mongoose用原生的Promise

	mongoose.Promise = global.Promise;

	//Opens the default mongoose connection.
	mongoose.connect(db);

exports.initSchma = ()=>{
	// glob.sync(path.resolve(path.join(__dirname,'./schema','**/*.js'))).forEach(require);
	glob.sync(path.resolve(path.join(__dirname,'./schema','**/*.js'))).forEach((ele)=>{
		require(ele);
	});
	
}

exports.connect = ()=>{

	let maxConnectTime = 0;

	return new Promise((resolve,reject)=>{
		if(process.env.NODE_ENV !== 'production'){
			// 启用日志记录收集方法+控制台的参数
				// mongoose.set('debug', true);
			}
			maxConnectTime++;
			mongoose.connect(db);

			mongoose.connection.on('disconnect',()=>{
				if(maxConnectTime >= 5) throw new Error('数据库已挂');
				mongoose.connect(db);
			});

			mongoose.connection.on('error',(err)=>{
				console.log(err);
			});

			mongoose.connection.on('open',()=>{
				
				resolve();
				console.log('MongoDB connected successful!');
			})
		})

}


