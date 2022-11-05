const Router = require('koa-router')
const {
	verifyToken
} = require('../middleware/auth.middleware')
const {
	reply,
	list,
	like,
	userLikeList,
	momentDetail,
	momentComment,
	replyComment
} = require('../controller/moment.controller')
const momentRouter = new Router({ prefix: '/moment' })
momentRouter.post('/reply', verifyToken, reply)
momentRouter.get('/list/:offset/:size', list)
momentRouter.post('/like/:userId/:momentId', verifyToken, like)
momentRouter.get('/like/list/:userId', userLikeList)
// 说说的基本信息
momentRouter.get('/detail/:momentId', momentDetail)
// 说说的评论信息
momentRouter.get('/comment/:momentId/:offset/:size', momentComment)
// 发表说说的评论
momentRouter.post('/reply/:momentId', verifyToken, replyComment)

module.exports = momentRouter