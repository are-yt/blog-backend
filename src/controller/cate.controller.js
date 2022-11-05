const {
	add: addCate,
	list: getList,
	del: delCate
} = require('../services/cate.services')
class Cate {
	async add(ctx) {
		const { name } = ctx.request.params
		const res = await addCate(name)
		if (res === 0) {
			return ctx.body = {
				errorCode: 1,
				message: '已有同名分类'
			}
		} else if (res.affectedRows) {
			// 新增分类成功
			return ctx.body = {
				errorCode: 0
			}
		}
		ctx.body = {
			errorCode: 1,
			message: '新增分类失败'
		}
	}
	async list(ctx) {
		const res = await getList()
		ctx.body = res
	}
	async del(ctx) {
		const { name } = ctx.request.params
		const res = await delCate(name)
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

module.exports = new Cate()