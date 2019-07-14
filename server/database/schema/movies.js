/*
利用mongoose.Schema,model创建电影模型
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const {ObjectId,Mixed} = Schema.Types;

const movieSchema = new Schema({

  category:[{
    type:ObjectId,
    ref:'Category'
  }],

	//key和类型
	doubanId: {
    unique:true,
    type:String
  },
  	rate: Number,
  	title: String,
  	summary: String,
  	video: String,
 	  poster: String,
  	cover: String,

  	videoKey: String,
  	posterKey: String,
  	coverKey: String,

  	rawTitle: String,
  	// [String]==数组且数组里面的元素是String类型
  	movieTypes: [String],
  	pubdate: Mixed,
  	year: Number,

  	tags: [String],

  	//描述
  	meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

//保存数据之前，判断数据是新来的，还是更新的
//Schema.prototype.pre() 参数:1. method name or regular expression to match method name
//                            2.callback «Function»
//save and isNew :Document.prototyep.的
movieSchema.pre('save',function (next) {
  //save 是Document实例的方法，故其回调函数里的this是指向Document实例的
  if( this.isNew ){
      this.meta.createdAt = this.meta.updatedAt = Date.now();
  }else{
      this.meta.updatedAt = Date.now();
  }
  //放行
  next();
});
  


mongoose.model('Movie',movieSchema);




