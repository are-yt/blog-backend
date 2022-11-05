const Router = require('koa-router')
const {
	verifyToken
} = require('../middleware/auth.middleware')
const {
	linkReply,
	linkList,
	articleList,
	articleReply
} = require('../controller/comment.controller')
const commentRouter = new Router({ prefix: '/comment' })
// 发布友链评论
commentRouter.post('/link/reply', verifyToken, linkReply)
// 获取友链评论列表
commentRouter.get('/link/list/:offset/:size', linkList)

// 发布文章评论
commentRouter.post('/article/reply', verifyToken, articleReply)
// 根据文章id获取评论
commentRouter.get('/article/list/:id/:offset/:size', articleList)
module.exports = commentRouter