const { checkAdminName, matchAccount } = require('../services/account.services')
const {
	NO_VALID_PARAMES,
	EXISTS_SAME_NAME_ACCOUNT,
	NAME_OR_PASSWORD_IS_ERROR
} = require('../constants/error.types')
const password2md5 = require('../utils/password2md5')
// 管理员注册中间件，验证是否已存在同名管理者账号
const hasAdmin = async (ctx, next) => {
	const { name, password } = ctx.request.body
	if (!name || !password) {
		// 没有正确传递了参数
		return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 400, ctx)
	}
	const res = await checkAdminName(name)
	if (res.length) {
		// 管理员账户已存在同名
		return ctx.app.emit('error', new Error(EXISTS_SAME_NAME_ACCOUNT), 200, ctx)
	}
	// 可以被注册了
	await next()
}
// 管理员登录中间件，验证管理员登录账号的真实性
const checkAdmin = async (ctx, next) => {
	const { name, password } = ctx.request.body
	if (!name || !password) {
		return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 400, ctx)
	}
	const res = await matchAccount(name, password2md5(password))
	if (!res.length) {
		// 登录账号验证失败
		return ctx.app.emit('error', new Error(NAME_OR_PASSWORD_IS_ERROR), 200, ctx)
	}
	ctx.account = res[0]
	await next()
}

module.exports = {
	hasAdmin,
	checkAdmin
}