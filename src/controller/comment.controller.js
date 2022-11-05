const {
	linkReply: replyLinkComment,
	articleReply: replyArticleComment,
	linkList: getLinkList,
	getLinkCommentTotal,
	getArticleCommentListById,
	getArticleCommentTotal
} = require('../services/comment.services')
const {
	NO_VALID_PARAMES
} = require('../constants/error.types')
class Comment {
	async linkReply(ctx) {
		const { parent_id, reply_id, user_id, content } = ctx.request.body
		if (!content || !user_id) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await replyLinkComment(parent_id, reply_id, user_id, content)
		if (res.affectedRows) {
			// 发布友链评论成功
			return ctx.body = {
				errorCode: 0,
				id: res.insertId
			}
		}
		// 发布友链评论失败
		ctx.body = {
			errorCode: 1,
			message: '评论失败'
		}
	}
	async linkList(ctx) {
		const { offset, size } = ctx.request.params
		const res = await getLinkList(offset, size)
		const res2 = await getLinkCommentTotal()
		ctx.body = {
			errorCode: 0,
			data: res.splice(offset * size, size),
			total: res2[0].total
		}
	}
	async articleList(ctx) {
		const { id, offset, size } = ctx.request.params
		if (!id || !offset || !size) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await getArticleCommentListById(id)
		const res2 = await getArticleCommentTotal(id)
		ctx.body = {
			data: res.splice(offset * size, size),
			total: res2[0].total
		}
	}
	async articleReply(ctx) {
		const { parent_id, reply_id, article_id, user_id, content } = ctx.request.body
		console.log(parent_id, reply_id, article_id, user_id, content.length * 2)
		if (!article_id || !user_id || !content) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await replyArticleComment(parent_id, reply_id, article_id, user_id, content)
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
module.exports = new Comment()