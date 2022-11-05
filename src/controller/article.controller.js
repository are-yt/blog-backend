const {
	NO_VALID_PARAMES
} = require('../constants/error.types')
const {
	update: updateArticleMain,
	tags: updateTags,
	cate: updateCate,
	surface: updateSurface,
	getImg: getImgInfo,
	img: saveImg,
	list: getList,
	total,
	classification: getClassificationList,
	detail: getDetail,
	getArticleByCate: getArticleListByCate,
	getArticleByTag: getArticleListByTag,
	getArticleTotalByTag,
	queryArticle: queryArticleByInput
} = require('../services/article.services')
const {
	APP_PORT,
	APP_HOST
} = require('../config/index')
const { createReadStream } = require('fs')
const { resolve } = require('path')
class Article {
	async update(ctx) {
		const { content, title, desc, uploadId, articleId } = ctx.request.body
		if (!content || !title || !desc || !uploadId) {
			// 更新文章必须具备文章主体内容，标题，描述以及上传者id
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 400, ctx)
		}
		const res = await updateArticleMain(content, title, desc, uploadId, articleId)
		if (res.affectedRows && articleId) {
			// 更新文章成功
			return ctx.body = {
				errorCode: 0,
				message: '更新帖子成功',
				data: res
			}
		}
		if (res.affectedRows && !articleId) {
			// 添加文章成功
			ctx.body = {
				errorCode: 0,
				message: '成功发表帖子',
				data: res
			}
		}
	}
	async tags(ctx) {
		const { articleId } = ctx.request.params
		const { tags } = ctx.request.body
		if (!tags || !tags.length) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const errorTags = await updateTags(articleId, tags)
		ctx.body = {
			errorCode: 0,
			errorTags
		}
	}
	async cate(ctx) {
		const { articleId } = ctx.request.params
		const { cate } = ctx.request.body
		if (!articleId || !cate) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200 ,ctx)
		}
		const res = await updateCate(articleId, cate)
		if (res.affectedRows) {
			// 更新成功
			return ctx.body = {
				errorCode: 0
			}
		}
		// 更新失败
		ctx.body = {
			errorCode: 1,
			message: '分类信息上传失败'
		}
	}
	async surface(ctx) {
		const { articleId } = ctx.request.params
		const { filename, mimetype } = ctx.req.file
		const res = await updateSurface(articleId, filename, mimetype)
		if (res.affectedRows) {
			// 更新成功
			return ctx.body = {
				errorCode: 0,
				url: `http://${APP_HOST}:${APP_PORT}/article/imgs/${filename}`
			}
		}
		// 更新失败
		ctx.body = {
			errorCode: 1,
			message: '封面图上传失败'
		}
	}
	async getImg(ctx) {
		const { filename } = ctx.request.params
		const { mimetype } = await getImgInfo(filename)
		ctx.response.set('content-type', mimetype)
		ctx.body = createReadStream(resolve(__dirname, '../files/article', filename))
	}
	async img(ctx) {
		const { filename, mimetype } = ctx.req.file
		// 保存上传的文章图片
		await saveImg(filename, mimetype)
		ctx.body = {
			url: `http://${APP_HOST}:${APP_PORT}/article/imgs/${filename}`
		}
	}
	async list(ctx) {
		const { size, offset } = ctx.request.params
		// 获取文章分页数据
		const res = await getList()
		// 获取文章总数
		const res2 = await total()
		if (res.length && total) {
			// 获取成功
			return ctx.body = {
				errorCode: 0,
				data: res.splice(offset * size, size),
				total: res2.total
			}
		}
		// 获取失败
		ctx.body = {
			errorCode: 1,
			message: '获取文章数据失败'
		}
	}
	async classification(ctx) {
		const { pageIndex, pageSize } = ctx.request.params
		if (!pageIndex || !pageSize) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const { res, res2: [{ total }] } = await getClassificationList()
		ctx.body = {
			errorCode: 0,
			list: res.splice(pageIndex * pageSize, pageSize),
			total
		}
	}
	async detail(ctx) {
		const { id } = ctx.request.params
		const res = await getDetail(id)
		if (res.length) {
			// 获取成功
			return ctx.body = {
				errorCode: 0,
				data: res[0]
			}
		}
		// 获取失败
		ctx.body = {
			errorCode: 1,
			message: '获取文章详情失败'
		}
	}
	async getArticleByCate(ctx) {
		const { cateId, offset, size } = ctx.request.params
		const [res] = await getArticleListByCate(cateId)
		if (!res.list) {
			// 没有这个分类的文章
			return ctx.body = {
				errorCode: 1,
				message: '还没有该分类的文章'
			}
		}
		ctx.body = {
			errorCode: 0,
			list: res.list.splice(offset * size, size)
		}
	}
	async getArticleByTag(ctx) {
		const { tagId, offset, size } = ctx.request.params
		const res = await getArticleListByTag(tagId)
		const res2 = await getArticleTotalByTag(tagId)
		if (!res || !res.length) {
			return ctx.body = {
				errorCode: 1,
				message: '还没有该标签的文章~'
			}
		}
		ctx.body = {
			errorCode: 0,
			list: res.splice(offset * size, size),
			total: res2[0].total
		}
	}
	async queryArticle(ctx) {
		const { data } = ctx.request.query
		if (!data) {
			return ctx.app.emit('error', new Error(NO_VALID_PARAMES), 200, ctx)
		}
		const res = await queryArticleByInput(data)
		ctx.body = {
			errorCode: 0,
			list: res
		}
	}
}

module.exports = new Article()