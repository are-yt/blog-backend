const Router = require('koa-router')
const articleRouter = new Router({ prefix: '/article' })
const {
	verifyToken
} = require('../middleware/auth.middleware')
const {
	update,
	tags,
	cate,
	surface,
	getImg,
	img,
	list,
	classification,
	detail,
	getArticleByCate,
	getArticleByTag,
	queryArticle
} = require('../controller/article.controller')
const {
	articleFileHandler
} = require('../middleware/file.middleware')
articleRouter.post('/update/main', verifyToken, update)
articleRouter.post('/update/tags/:articleId', verifyToken, tags)
articleRouter.post('/update/cate/:articleId', verifyToken, cate)
articleRouter.post('/update/file/:articleId', verifyToken, articleFileHandler, surface)
articleRouter.get('/imgs/:filename', getImg)
articleRouter.post('/upload/file', verifyToken, articleFileHandler, img)
articleRouter.get('/list/:offset/:size', list)
articleRouter.post('/update/all/:articleId', verifyToken)
articleRouter.get('/classification/:pageIndex/:pageSize', classification)
articleRouter.get('/detail/:id', detail)
articleRouter.get('/cate/:cateId/:offset/:size', getArticleByCate)
articleRouter.get('/tag/:tagId/:offset/:size', getArticleByTag)
articleRouter.get('/query', queryArticle)
module.exports = articleRouter