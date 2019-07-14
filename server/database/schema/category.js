/*
利用mongoose.Schema,model创建电影模型
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const CategorySchema = new Schema({
	
    name:{
      type:String,
      unique:true
    },

    movies:[
      {
        type:ObjectId,
        ref:'Movie'
      }
    ],

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
})

//保存数据之前，判断数据是新来的，还是更新的
//Schema.prototype.pre() 参数:1. method name or regular expression to match method name
//                            2.callback «Function»
//save and isNew :Document.prototyep.的
CategorySchema.pre('save',function (next) {
  //save 是Document实例的方法，故其回调函数里的this是指向Document实例的
  if( this.isNew ){
      this.meta.createdAt = this.meta.updatedAt = Date.now();
  }else{
      this.meta.updatedAt = Date.now();
  }
  //放行
  next();
});
  


mongoose.model('Category',CategorySchema);




