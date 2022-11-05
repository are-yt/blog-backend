const {
	add: addTag,
	list: getList,
	del: delTag
} = require('../services/tags.services')
class Tags {
	async add(ctx) {
		const { name } = ctx.request.params
		const res = await addTag(name)
		if (res.affectedRows) {
			// 新增成功
			return ctx.body = {
				data: {},
				errorCode: 0
			}
		} else if (!res) {
			return ctx.body = {
				errorCode: 1,
				message: '存在同名标签'
			}
		}
		// 增加标签失败
		ctx.body = {
			errorCode: 1,
			message: '新增标签失败'
		}
	}
	async list(ctx) {
		const res = await getList()
		ctx.body = res
	}
	async del(ctx) {
		const { name } = ctx.request.params
		const res = await delTag(name)
		if (res.affectedRows) {
			// 删除成功
			return ctx.body = {
				errorCode: 0
			}
		}
		ctx.body = {
			errorCode: 1,
			message: '删除失败'
		}
	}
}

module.exports = new Tags()