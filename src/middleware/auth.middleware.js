const jwt = require('jsonwebtoken')
const {
	NO_TOKEN,
	EXPIRED_TOKEN
} = require('../constants/error.types')
const { PUBLIC_KEY } = require('../config/index')

// 验证token的中间件
const verifyToken = async (ctx, next) => {
	const token = ctx.header['authorization'] ? ctx.header.authorization.replace('Bearer ', '') : null
	if (!token) {
		// 没有传递token
		return ctx.app.emit('error', new Error(NO_TOKEN), 200, ctx)
	}
	// 传入了token，解析它
	try {
		const res = jwt.verify(token, PUBLIC_KEY, {
			algorithms: ['RS256']
		})
		// 解析成功
		await next()
	} catch (err) {
		// 解析失败
		ctx.app.emit('error', new Error(EXPIRED_TOKEN), 200, ctx)
	}
}

module.exports = {
	verifyToken
}