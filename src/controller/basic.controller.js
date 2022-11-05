const { update, getInfo } = require('../services/basic.services')
const {
	NO_VALID_PARAMES
} = require('../constants/error.types')
class Basic {
	async updateBasic(ctx) {
		const { title, notice } = ctx.request.body
		if (!title) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 400, ctx)
		}
		const res = await update(title, notice)
		if (res.affectedRows) {
			// 更新网站基本信息成功
			return ctx.body = {
				data: {},
				errorCode: 0,
				message: '更新网站基本信息成功'
			}
		}
		// 更新网站信息失败
		ctx.body = {
			data: {},
			errorCode: 1,
			message: '更新网站基本信息失败'
		}
	}
	async getBasic(ctx) {
		const res = await getInfo()
		ctx.body = {
			data: res || {},
			errorCode: 0
		}
	}
}
module.exports = new Basic()