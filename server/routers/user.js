
const  checkPassword  = require('../service/admin.js')

const { 
	get,
	post,
	put,
	controller
 } = require('../lib/decorator.js')


@controller('/api/v0/users')
export class movieController{
	@post('/')
	async login(ctx,next){
		console.log(ctx.request.body);
		let { email,password } = ctx.request.body

		

		let matchData = await checkPassword(email,password)

		if(!matchData.user){
			ctx.body = {
				success:false,
				err:"用户不存在！"
			}
			return;
		}

		if(!matchData.match){
			ctx.body = {
				success:false,
				err:"用户名或密码不正确！"
			}
			return;
		}

		return (ctx.body = {
			success:true
		})


	}




}