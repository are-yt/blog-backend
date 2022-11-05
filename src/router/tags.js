const Router = require('koa-router')
const tagsRouter = new Router({ prefix: '/tags' })
const { verifyToken } = require('../middleware/auth.middleware')
const {
	add,
	list,
	del
} = require('../controller/tags.controller')
tagsRouter.post('/:name', verifyToken, add)
tagsRouter.get('/list', list)
tagsRouter.post('/del/:name', verifyToken, del)

module.exports = tagsRouter