const {
	isExistsUser: checkUserIsExists,
	checkMathUser: hasMatchUser,
	resetPasswordCheck: resetPasswordCheckUser
} = require('../services/users.services')
const {
	NO_VALID_PARAMES,
	USER_EXISTS,
	USER_NOT_EXISTS
} = require('../constants/error.types')
const password2md5 = require('../utils/password2md5')
class Users {
	async isExistsUser(ctx, next) {
		const { email, name, password } = ctx.request.body
		if (!email || !name || !password) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		// 检查该邮箱是否已被注册
		const res = await checkUserIsExists(email)
		if (res.length) {
			// 用户已注册了
			return ctx.app.emit('error', new Error(USER_EXISTS), 200, ctx)
		}
		// 用户还没有注册
		ctx.user = {
			email,
			name,
			password: password2md5(password)
		}
		await next()
	}
	async checkMatchUser(ctx, next) {
		const { email, password } = ctx.request.body
		if (!email || !password) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await hasMatchUser(email, password2md5(password))
		if (!res.length) {
			// 没有匹配的用户
			return ctx.body = {
				errorCode: 1,
				message: '账户或密码错误'
			}
		}
		// 账户密码正确，登录成功，前往下一中间件颁发token
		ctx.user = {
			id: res[0].id,
			name: res[0].name,
			email
		}
		await next()
	}
	async resetPasswordCheck(ctx, next) {
		const { email, password } = ctx.request.body
		if (!email || !password) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMS), 200, ctx)
		}
		const res = await resetPasswordCheckUser(email)
		if (!res.length) {
			// 该账号还未注册
			return ctx.app.emit('error', new Error(USER_NOT_EXISTS), 200, ctx)
		}
		ctx.user = {
			password: password2md5(password),
			email
		}
		await next()
	}
}
module.exports = new Users()