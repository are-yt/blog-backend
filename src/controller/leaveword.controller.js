const {
	send: sendLeaveword,
	list: getList
} = require('../services/leaveword.services')
const {
	NO_VALID_PARAMES
} = require('../constants/error.types')
class Leaveword {
	async send(ctx) {
		const { user_id, content } = ctx.request.body
		if (!user_id || !content) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await sendLeaveword(user_id, content)
		if (res.affectedRows) {
			// 发送留言成功
			return ctx.body = {
				errorCode: 0,
				id: res.insertId
			}
		}
		// 发送留言失败
		ctx.body = {
			errorCode: 1,
			message: '留言失败'
		}
	}
	async list(ctx) {
		const res = await getList()
		ctx.body = res
	}
}

module.exports = new Leaveword()