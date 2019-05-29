/*
利用mongoose.Schema,model创建电影模型
 */
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const saltRounds = 10;

//最大尝试登录
const MAX_LOGIN_ATTEMPTS = 5;

const LOCK_TIME = 2 * 60 * 60 * 1000;

const usersSchema = new Schema({
            //key和类型
            username: {
                //唯一性
                unique: true,
                required: true,
                type: String
            },

            password: {
                unique: true,
                type: String
            },
            email: {
                unique: true,
                required: true,
                type: String
            },

            loginAttempts: {
                type: Number,
                required: true,
                default: 0
              },

              //锁到何时
              lockUntil: Number,
            

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



        usersSchema.pre('save', function(next) {
            if (this.isNew) {
                this.meta.createdAt = this.meta.updatedAt = Date.now()
            } else {
                this.meta.updatedAt = Date.now()
            }

            next()
        });

        //虚拟字段，不加入数据库里
        usersSchema.virtual('isLocked').get(function() {

                return !!(this.lockUntil && this.lockUntil > Date.now())
            });


        //保存之前，对提交的明文密码进行加盐加密
        usersSchema.pre('save', function(next) {

            if (!this.isModified()) return next();

            bcrypt.genSalt(saltRounds, function(err, salt) {
                if (err) return next(err);
                bcrypt.hash(this.password, salt, function(error, hash) {
                    // Store hash in your password DB.
                    if (error) return next(error);
                    this.password = hash;
                });
            });

            //放行
            next();
        });

        //check password
        usersSchema.methods = {
            comparePassword: function(_password, password) {
                return new Promise((resolve, reject) => {
                    bcrypt.compare(_password, password, function(err, res) {
                        //加密后的密码hash与密码匹配：res==true
                        if (!err) resolve(res);
                        else {
                            reject(err);
                        }
                    })
                })
            },



            /*
            密码被频繁登录，登录的密码都是错误的==>进行机制保护==>尝试登录次数5，但密码都是错误的
            ，则锁定用户，让其通过手机号码或邮箱找回密码
             */
            /*机制start*/
            

            //密码出错，则记录+1
            incLoginAttepts: (user) => {
                return new Promise((resolve, reject) => {
                    if (this.lockUntil && this.lockUntil < Date.now()) {
                        this.update({
                            $set: {
                                loginAttempts: 1
                            },
                            $unset: {
                                lockUntil: 1
                            }
                        }, (err) => {
                            if (!err) resolve(true)
                            else reject(err)
                        })
                    } else {
                        let updates = {
                            $inc: {
                                loginAttempts: 1
                            }
                        }

                        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
                            updates.$set = {
                                lockUntil: Date.now() + LOCK_TIME
                            }
                        }

                        this.update(updates, err => {
                            if (!err) resolve(true)
                            else reject(err)
                        })
                    }
                })
            }
            /*机制end*/

            // comparePassword:async function(_password, password) {

            //   const match = await bcrypt.compare(_password, password);

            //   if(match) {

            //   }
            // }
        }


        mongoose.model('users', usersSchema);