const {
	reply: replyMoment,
	list: getList,
	total,
	like: handleLike,
	userLikeList: getUserLikeList,
	momentDetail: getMomentDetail,
	momentComment: getMomomentCommentListById,
	replyComment: replyMomentComment,
	momentCommentTotal: getMomentCommentTotal
} = require('../services/moment.services')
const {
	NO_VALID_PARAMES
} = require('../constants/error.types')
class Moment {
	async reply(ctx) {
		// 发表说说
		const { content, userId } = ctx.request.body
		if (!content || !userId) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await replyMoment(content, userId)
		if (res.affectedRows) {
			// 发表说说成功
			return ctx.body = {
				errorCode: 0
			}
		}
		// 发表说说失败
		ctx.body = {
			errorCode: 1,
			message: '发表说说失败'
		}
	}
	async list(ctx) {
		const { offset, size } = ctx.request.params
		const res = await getList(offset, size)
		const res2 = await total()
		ctx.body = {
			errorCode: 0,
			data: res.splice(offset * size, size),
			total: res2[0].total
		}
	}
	async like(ctx) {
		const { userId, momentId } = ctx.request.params
		if (!userId || !momentId) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await handleLike(userId, momentId)
		if (res) {
			// 点赞行为
			return ctx.body = {
				like: 1,
				errorCode: 0
			}
		}
		// 取消点赞行为
		ctx.body = {
			errorCode: 0,
			like: 0
		}
	}
	async userLikeList(ctx) {
		const { userId } = ctx.request.params 
		if (!userId) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await getUserLikeList(userId)
		ctx.body = {
			errorCode: 0,
			list: res
		}
	}
	async momentDetail(ctx) {
		const { momentId } = ctx.request.params
		const res = await getMomentDetail(momentId)
		if (res.length) {
			return ctx.body = {
				errorCode: 0,
				data: res[0]
			}
		}
		// 获取说说详情失败
		ctx.body = {
			errorCode: 1,
			message: '获取文章详情失败'
		}
	}
	async momentComment(ctx) {
		const { momentId, offset, size } = ctx.request.params
		const res = await getMomomentCommentListById(momentId)
		const res2 = await getMomentCommentTotal(momentId)
		ctx.body = {
			errorCode: 0,
			list: res.splice(offset * size, size),
			total: res2[0].total
		}
	}
	async replyComment(ctx) {
		const { user_id, parent_id, reply_id, content } = ctx.request.body
		const { momentId } = ctx.request.params
		if (!user_id || !content) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await replyMomentComment(user_id, parent_id, reply_id, momentId, content)
		if (res.affectedRows) {
			// 评论成功
			return ctx.body = {
				errorCode: 0,
				id: res.insertId
			}
		}
		// 评论失败
		ctx.body = {
			errorCode: 1,
			message: '评论失败'
		}
	}
}

module.exports = new Moment()