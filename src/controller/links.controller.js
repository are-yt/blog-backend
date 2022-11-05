const {
	add: addLink
} = require('../services/links.services')
const {
	NO_VALID_PARAMES
} = require('../constants/error.types')
class Links {
	async add(ctx) {
		const { url, name, desc } = ctx.request.body
		if (!url || !name || !desc) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await addLink(url, name, desc)
		if (res.affectedRows) {
			// 添加友链成功
			return ctx.body = {
				errorCode: 0
			}
		}
		// 添加友链失败
		ctx.body = {
			errorCode: 1,
			message: '添加友链失败'
		}
	}
}
module.exports = new Links()